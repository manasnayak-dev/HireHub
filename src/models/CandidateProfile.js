const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        phone: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        bio: {
            type: String,
            trim: true
        },

        skills: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const CandidateProfile = mongoose.model(
    "CandidateProfile",
    candidateProfileSchema
);

module.exports = CandidateProfile;