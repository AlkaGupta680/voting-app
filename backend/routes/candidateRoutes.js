const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate'); 
const User = require('../models/users');         
const { jwtMiddleware } = require('../jwt');


const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID); // Use the correct model
        if (user && user.role === 'admin') {
            return true;
        }
    } catch (err) {
        console.error(err); // Log the error for debugging
    }
    return false; // Return false if user is not found or role is not admin
}

// POST METHOD route to add candidate
router.post('/', jwtMiddleware, async (req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "User  does not have admin role" });
        }

        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log("Data saved");

        res.status(201).json({ response: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update candidate
router.put('/:candidateID', jwtMiddleware, async (req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "User  does not have admin role" });
        }

        const candidateId = req.params.candidateID; // Use candidateID from params
        const updateCandidateData = req.body; // Update data for the candidate
        const response = await Candidate.findByIdAndUpdate(candidateId, updateCandidateData, {
            new: true, // Return the updated document
            runValidators: true // Run mongoose validation
        });

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        console.log("Candidate data updated");
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete candidate
router.delete('/:candidateID', jwtMiddleware, async (req, res) => { // Changed to delete
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "User  does not have admin role" });
        }

        const candidateId = req.params.candidateID; // Use candidateID from params
        const response = await Candidate.findByIdAndDelete(candidateId);
        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        console.log("Candidate deleted");
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//let's vote 
router.post('/vote/:candidateID' ,jwtMiddleware,async(req,res)=>{
    //no admin role can vote 
    //only users can vote 
    candidateID = req.params.candidateID ;
    userID = req.user.id ;
    try { 
        // Find candidate document with candidateId 
        const candidateDoc = await Candidate.findById(candidateID); // Renamed variable to candidateDoc
        if (!candidateDoc) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        const userDoc = await User.findById(userID); // Renamed variable to userDoc
        if (!userDoc) {
            return res.status(404).json({ message: "User  not found" });
        }

        if (userDoc.isVoted) {
            return res.status(400).json({ message: "You have already voted" });
        }
        if (userDoc.role === 'Admin') {
            return res.status(403).json({ message: "Admin is not allowed" });
        }

        // Update candidate document to record vote 
        candidateDoc.vote.push({ user: userID });
        candidateDoc.voteCount++;
        await candidateDoc.save();

        // Update user document 
        userDoc.isVoted = true;
        await userDoc.save();
        return res.status(200).json({ message: "Vote recorded successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
} )

//vote count 
router.get('/vote/count' , async(req,res)=>{
    try {
        //find all candidate  and sort them  by vote count  in descending order
        const candidates =  await  Candidate.find().sort({voteCount:'desc'}) ;
        //map  candidate    
         const voteRecord  = candidates.map((data)=>{
            return{
              party : data.party ,
              count:data.voteCount
            }
         })
         return res.status(200).json(voteRecord) ;
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

// Get candidate list 

router.get('/candidate', async (req, res) => {
    try {
        const data = await Candidate.find(); // Ensure the model name is capitalized
        console.log("Data fetched successfully"); // Corrected typo
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Module export
module.exports = router;