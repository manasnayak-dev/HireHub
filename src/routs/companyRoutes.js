const express = require("express");

const {
  createCompany,
  getCompany,
  updateCompany
} = require("../controllers/companyControllers");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("recruiter"), createCompany);
router.patch("/:id", authMiddleware, authorizeRoles("recruiter"), updateCompany);

router.get("/:id", authMiddleware, getCompany);
module.exports = router;
