const mongoose = require("mongoose");
const Job = require("../models/job.js");
const Company = require("../models/Company");

const createJob = async (req, res) => {
  const {
    title,
    description,
    skills,
    salary,
    location,
    jobType,
    workMode,
    experience,
    company,
    deadline,
  } = req.body;

  if (
    !title ||
    !description ||
    !skills ||
    !salary ||
    !location ||
    !jobType ||
    !workMode ||
    !experience ||
    !company ||
    !deadline
  ) {
    return res.status(400).json({
      message: "All required fields must be provided",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(company)) {
    return res.status(400).json({
      message: "Invalid company ID",
    });
  }
  const companyData = await Company.findById(company);

  if (!companyData) {
    return res.status(404).json({
      message: "Company not found",
    });
  }

  if (companyData.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to create a job for this company",
    });
  }

  if (salary.min > salary.max) {
    return res.status(400).json({
      message: "Maximum salary cannot be less than minimum salary",
    });
  }

  if (experience.min > experience.max) {
    return res.status(400).json({
      message: "Maximum experience cannot be less than minimum experience",
    });
  }

  const deadlineDate = new Date(deadline);

  if (deadlineDate <= new Date()) {
    return res.status(400).json({
      message: "Job deadline must be a future date",
    });
  }

  const job = new Job({
    title,
    description,
    skills,
    salary,
    location,
    jobType,
    workMode,
    experience,
    company,
    deadline,
    postedBy: req.user.id,
  });

  await job.save();

  return res.status(201).json({
    message: "Job created successfully",
    job,
  });
};

const getJobs = async (req, res) => {
  const {
    search,
    location,
    jobType,
    workMode,
    experience,
    minSalary,
    maxSalary,
  } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const experienceNumber = experience ? Number(experience) : null;

  if (
    experience &&
    (!Number.isFinite(experienceNumber) || experienceNumber < 0)
  ) {
    return res.status(400).json({
      message: "Invalid experience value",
    });
  }

  //Salary

  const minSalaryNumber = minSalary ? Number(minSalary) : null;

  const maxSalaryNumber = maxSalary ? Number(maxSalary) : null;

  if (
    (minSalary && !Number.isFinite(minSalaryNumber)) ||
    (maxSalary && !Number.isFinite(maxSalaryNumber))
  ) {
    return res.status(400).json({
      message: "Invalid salary value",
    });
  }

  if (
    (minSalaryNumber !== null && minSalaryNumber < 0) ||
    (maxSalaryNumber !== null && maxSalaryNumber < 0)
  ) {
    return res.status(400).json({
      message: "Salary cannot be negative",
    });
  }

  const searchCondition = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { skills: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const locationCondition = location
    ? {
        location: {
          $regex: location,
          $options: "i",
        },
      }
    : {};

  const jobCondition = jobType ? { jobType: jobType } : {};
  const workModecondition = workMode
    ? {
        workMode: workMode,
      }
    : {};

  const experienceCondition = experience
    ? {
        "experience.min": { $lte: experienceNumber },
        "experience.max": { $gte: experienceNumber },
      }
    : {};

  const salaryCondition = {};

  if (minSalaryNumber !== null) {
    salaryCondition["salary.max"] = {
      $gte: minSalaryNumber,
    };
  }

  if (maxSalaryNumber !== null) {
    salaryCondition["salary.min"] = {
      $lte: maxSalaryNumber,
    };
  }

  const allowedJobTypes = ["full-time", "part-time", "internship", "contract"];
  const allowedworkModetypes = ["onsite", "remote", "hybrid"];

  if (jobType && !allowedJobTypes.includes(jobType)) {
    return res.status(400).json({
      message: "Invalid job type",
    });
  }

  if (workMode && !allowedworkModetypes.includes(workMode)) {
    return res.status(400).json({
      message: "Invalid work Mode",
    });
  }
  if (page < 1 || limit < 1) {
    return res.status(400).json({
      message: "Page and limit must be positive numbers",
    });
  }

  if (limit > 50) {
    return res.status(400).json({
      message: "Limit cannot be greater than 50",
    });
  }

  const totalJobs = await Job.countDocuments({
    status: "open",
    ...searchCondition,
    ...locationCondition,
    ...jobCondition,
    ...workModecondition,
    ...experienceCondition,
    ...salaryCondition,
  });
  const totalPages = Math.ceil(totalJobs / limit);
  const jobs = await Job.find({
    status: "open",
    ...searchCondition,
    ...locationCondition,
    ...jobCondition,
    ...workModecondition,
    ...experienceCondition,
    ...salaryCondition,
  })
    .populate("company", "name description website location logo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    currrentpage: page,
    limit,
    totalJobs,
    totalPages,
    jobs,
  });
};

const getJobById = async (req, res) => {

    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            message: "Invalid job ID"
        });
    }

    const job = await Job.findById(jobId).populate(
        "company",
        "name description website location logo"
    );

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    return res.status(200).json({
        job
    });
};
module.exports = { createJob, getJobs, getJobById };
