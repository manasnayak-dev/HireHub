const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },
    education: [
      {
        degree: {
          type: String,
          trim: true,
        },

        institution: {
          type: String,
          trim: true,
        },

        fieldOfStudy: {
          type: String,
          trim: true,
        },

        startYear: {
          type: Number,
        },

        endYear: {
          type: Number,
        },
      },
    ],

    experience: [
      {
        company: {
          type: String,
          trim: true,
        },

        position: {
          type: String,
          trim: true,
        },

        startDate: {
          type: Date,
        },

        endDate: {
          type: Date,
        },

        description: {
          type: String,
          trim: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  },
);

const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema,
);

module.exports = CandidateProfile;
