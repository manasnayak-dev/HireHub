const express = require("express");

const {
  createOrUpdateProfile,
  getMyProfile,
} = require("../controllers/candidateProfileController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.patch(
  "/",
  authMiddleware,
  authorizeRoles("candidate"),
  createOrUpdateProfile,
);

router.get("/", authMiddleware, authorizeRoles("candidate"), getMyProfile);
module.exports = router;
