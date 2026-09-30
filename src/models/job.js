const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    salary: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      required: true,
    },
    workMode: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      required: true,
    },
    experience: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Job", jobSchema);

// Job
// ├── title
// ├── description
// ├── skills
// ├── salary
// ├── location
// ├── jobType
// ├── experience
// ├── company
// ├── postedBy
// └── createdAt
