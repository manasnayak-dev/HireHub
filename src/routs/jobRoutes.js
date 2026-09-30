const express = require("express");
const { createJob, getJobs, getJobById } = require("../controllers/jobController.js");

const authMiddleware = require("../middleware/authMiddleware.js");
const authorizeRoles = require("../middleware/roleMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("recruiter"), createJob);
router.get("/", authMiddleware, getJobs);
router.get("/:id", authMiddleware, getJobById);

module.exports = router;
