const express = require("express");

const {
    applyForJob
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/:jobId",
    authMiddleware,
    authorizeRoles("candidate"),
    applyForJob
);

module.exports = router;