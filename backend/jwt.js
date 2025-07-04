const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  // Add this line to log the incoming Authorization header
  console.log('Authorization header:', req.headers.authorization);
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: 'Token not found' });

  const token = authorization.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized Access' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 30000 });
};

module.exports = { jwtMiddleware, generateToken };
