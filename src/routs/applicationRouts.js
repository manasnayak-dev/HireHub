const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getApplicationById,
  getCandidateProfile,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/:jobId",
  authMiddleware,
  authorizeRoles("candidate"),
  applyForJob,
);

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("candidate"),
  getMyApplications,
);

router.get(
  "/job/:jobId",
  authMiddleware,
  authorizeRoles("recruiter"),
  getJobApplicants,
);

router.patch(
  "/:applicationId/status",
  authMiddleware,
  authorizeRoles("recruiter"),
  updateApplicationStatus,
);

router.get(
  "/:applicationId/candidate-profile",
  authMiddleware,
  authorizeRoles("recruiter"),
  getCandidateProfile,
);

router.get(
  "/:applicationId",
  authMiddleware,
  authorizeRoles("candidate"),
  getApplicationById,
);

module.exports = router;
