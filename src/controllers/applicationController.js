const Application = require("../models/Application");
const Job = require("../models/job");
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

module.exports = { applyForJob };
