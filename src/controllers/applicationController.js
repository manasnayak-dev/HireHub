const Application = require("../models/Application");
const Job = require("../models/job");
const CandidateProfile = require("../models/CandidateProfile");
const mongoose = require("mongoose");
const applyForJob = async (req, res) => {
  const jobId = req.params.jobId;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({
      message: "Invalid job ID",
    });
  }

  const job = await Job.findById(jobId);

  if (!job) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  if (job.status !== "open") {
    return res.status(400).json({
      message: "This job is no longer accepting applications",
    });
  }

  const existingApplication = await Application.findOne({
    applicant: req.user.id,
    job: jobId,
  });

  if (existingApplication) {
    return res.status(409).json({
      message: "You have already applied for this job",
    });
  }

  const application = new Application({
    applicant: req.user.id,
    job: jobId,
  });

  await application.save();

  return res.status(201).json({
    message: "Application submitted successfully",
    application,
  });
};

const getMyApplications = async (req, res) => {
  const applications = await Application.find({
    applicant: req.user.id,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "job",
      select: "title description salary location jobType workMode company",
      populate: {
        path: "company",
        select: "name description website location logo",
      },
    });

  return res.status(200).json({
    applications,
  });
};

const getJobApplicants = async (req, res) => {
  const jobId = req.params.jobId;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({
      message: "Invalid job ID",
    });
  }

  const job = await Job.findById(jobId);

  if (!job) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  if (job.postedBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to view applicants for this job",
    });
  }

  const applications = await Application.find({
    job: jobId,
  })
    .sort({ createdAt: -1 })
    .populate("applicant", "firstname lastname email role");

  return res.status(200).json({
    job: {
      id: job._id,
      title: job.title,
    },
    totalApplicants: applications.length,
    applications,
  });
};

const updateApplicationStatus = async (req, res) => {
  const applicationId = req.params.applicationId;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({
      message: "Invalid application ID",
    });
  }

  const allowedStatuses = [
    "applied",
    "shortlisted",
    "interview",
    "rejected",
    "hired",
  ];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid application status",
    });
  }

  const application = await Application.findById(applicationId);

  const allowedTransitions = {
    applied: ["shortlisted", "rejected"],
    shortlisted: ["interview", "rejected"],
    interview: ["hired", "rejected"],
    hired: [],
    rejected: [],
  };

  const currentStatus = application.status;

  if (!allowedTransitions[currentStatus].includes(status)) {
    return res.status(400).json({
      message: `Cannot change application status from ${currentStatus} to ${status}`,
    });
  }

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  const job = await Job.findById(application.job);

  if (!job) {
    return res.status(404).json({
      message: "Job associated with this application not found",
    });
  }

  if (job.postedBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to update this application",
    });
  }

  application.status = status;

  await application.save();

  return res.status(200).json({
    message: "Application status updated successfully",
    application,
  });
};

const getApplicationById = async (req, res) => {
  const applicationId = req.params.applicationId;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({
      message: "Invalid application ID",
    });
  }

  const application = await Application.findById(applicationId).populate({
    path: "job",
    select: "title description salary location jobType workMode company",
    populate: {
      path: "company",
      select: "name description website location logo",
    },
  });

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  if (application.applicant.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to view this application",
    });
  }

  return res.status(200).json({
    application,
  });
};

const getCandidateProfile = async (req, res) => {
  const applicationId = req.params.applicationId;

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({
      message: "Invalid application ID",
    });
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    return res.status(404).json({
      message: "Application not found",
    });
  }

  const job = await Job.findById(application.job);

  if (!job) {
    return res.status(404).json({
      message: "Job associated with this application not found",
    });
  }

  if (job.postedBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to view this candidate profile",
    });
  }

  const profile = await CandidateProfile.findOne({
    user: application.applicant,
  });

  if (!profile) {
    return res.status(404).json({
      message: "Candidate profile not found",
    });
  }

  return res.status(200).json({
    profile,
  });
};

module.exports = {
  applyForJob /*candidate*/,
  getMyApplications /*candidate*/,
  getJobApplicants /*recruiter*/,
  updateApplicationStatus /*recruiter*/,
  getApplicationById /*candidate*/,
  getCandidateProfile /*recruiter*/,
};
