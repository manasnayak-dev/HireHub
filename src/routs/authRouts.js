const express = require("express");

const { signup, login } = require("../controllers/authControllers");
const authmiddleWare = require("../middleware/authMiddleware");
const authorization = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get(
  "/recruiter-test",
  authmiddleWare,
  authorization("recruiter"),
  (req, res) => {
    res.json({
      message: "Welcome recruiter!",
      user: req.user,
    });
  },
);

module.exports = router;
