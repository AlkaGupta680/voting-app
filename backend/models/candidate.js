const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// Define candidateSchema 
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    vote: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId, // Corrected here
                ref: 'user',
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now // Corrected to use Date.now without parentheses
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }
});

// Create candidate model 
const candidate = mongoose.model('candidate', candidateSchema);
module.exports = candidate;