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

//  API routes
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
app.use('/api/user', userRoutes);
app.use('/api/candidate', candidateRoutes);

// ======== Serve frontend in production ========
// Serve static files from frontend/dist
if(process.env.NODE_ENV === 'production'){
app.use(express.static(path.join(__dirname,".." ,'/frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, ".." ,"frontend", "dist", "index.html"));
});
}


// Start server and connect DB
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server has started at http://localhost:" + PORT);
});
