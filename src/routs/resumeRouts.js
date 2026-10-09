const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadResume } = require("../controllers/resumeController");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorizeRoles("candidate"),
    upload.single("resume"),
    uploadResume
);

module.exports = router;
