const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models/db');
const app = express();
require('dotenv').config();

// CORS for development (allow Vite dev server)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Routers
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// ======== Serve frontend in production ========
// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any other route, send back index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
// ==============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server is listening on port", PORT);
});
