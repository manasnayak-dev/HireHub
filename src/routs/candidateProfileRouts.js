const express = require("express");

const {
    createOrUpdateProfile
} = require("../controllers/candidateProfileController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.patch(
    "/",
    authMiddleware,
    authorizeRoles("candidate"),
    createOrUpdateProfile
);

module.exports = router;