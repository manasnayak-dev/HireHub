const Resume = require("../models/Resume");
const cloudinary = require("../config/cloudinary");

const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Resume file is required",
    });
  }

  const existingResume = await Resume.findOne({
    user: req.user.id,
  });

  if (existingResume) {
    return res.status(409).json({
      message: "Resume already exists. Please update your existing resume.",
    });
  }

  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "hirehub/resumes",
        resource_type: "raw",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(req.file.buffer);
  });

  console.log("Cloudinary upload result:", uploadResult);

  const resume = new Resume({
    user: req.user.id,
    fileName: req.file.originalname,
    fileUrl: uploadResult.secure_url,
    fileType: req.file.mimetype,
  });

  await resume.save();

  return res.status(201).json({
    message: "Resume uploaded successfully",
    resume,
  });
};

const getMyResume = async (req, res) => {
  const resume = await Resume.findOne({
    user: req.user.id,
  });

  if (!resume) {
    return res.status(404).json({
      message: "Resume not found",
    });
  }

  return res.status(200).json({
    resume,
  });
};

module.exports = {
  uploadResume,
  getMyResume,
};
