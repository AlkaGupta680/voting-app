const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/users');
const { jwtMiddleware, generateToken } = require('../jwt');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/profile_pics/');
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + path.extname(file.originalname)); // userID + extension
  }
});
const upload = multer({ storage: storage });

// POST METHOD route to add user
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        const payload = { id: response.id };
        const token = generateToken(payload);
        res.status(201).json({ response: response, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
});

// login route
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const foundUser = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if (!foundUser || !(await foundUser.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const payload = { id: foundUser.id, username: foundUser.username };
        const token = generateToken(payload);
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
});

// profile route
router.get('/profile', jwtMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const foundUser = await User.findById(userId);
        res.status(200).json({ user: foundUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
});

// update or change password
router.put('/profile/password', jwtMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        const foundUser = await User.findById(userId);
        if (!(await foundUser.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        foundUser.password = newPassword;
        await foundUser.save();
        res.status(200).json({ message: "password updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "internal server error" });
    }
});

// profile picture upload route
router.put('/profile/pic', jwtMiddleware, upload.single('profilePic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const profilePicUrl = `/profile_pics/${req.user.id}${path.extname(req.file.originalname)}`;
        await User.findByIdAndUpdate(req.user.id, { profilePic: profilePicUrl });
        res.status(200).json({ success: true, profilePic: profilePicUrl });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to upload profile picture' });
    }
});

module.exports = router;
