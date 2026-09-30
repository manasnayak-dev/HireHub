const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return res.send(400).json({
      message: "All required fields must be provided",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "Email is already registered",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstname,
    lastname,
    email,
    password: hashPassword,
    role,
  });
  await user.save();

  return res.status(200).json({
    message: "User created successfully",
    user: {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Eamil and password is required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const iscorrectpassword = await bcrypt.compare(password, user.password);

  if (!iscorrectpassword) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.jwt_secret,
    {
      expiresIn: "1d",
    },
  );

  // console.log(user);

  return res.status(200).json({
    message: "Login successful",
    token,  
    user: {
      firstname: user.firstname,
      email: user.email,
    },
  });
};
module.exports = { signup, login };
