const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/database");
const PORT = process.env.PORT || 5000;

const authRoutes = require("./routs/authRouts");
const jobRouts = require("./routs/jobRoutes");
const companyRouts = require("./routs/companyRoutes");
const applicationRouts = require("./routs/applicationRouts");
const candidateProfileRoutes = require("./routs/candidateProfileRouts");
const resumeRoutes = require("./routs/resumeRouts");

connectDB();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRouts);
app.use("/api/companies", companyRouts);
app.use("/api/applications", applicationRouts);
app.use("/api/candidate-profile", candidateProfileRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/about", (req, res) => {
  res.send("This is HireHub....");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT no ${PORT}`);
});
