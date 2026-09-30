const Company = require("../models/Company.js");

const createCompany = async (req, res) => {
  const { name, description, website, location, logo } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Company name is required",
    });
  }

  const company = new Company({
    name,
    description,
    website,
    location,
    logo,
    createdBy: req.user.id,
  });

  await company.save();

  return res.status(201).json({
    message: "Company created successfully",
    company,
  });
};

const getCompany = async (req, res) => {
  const companyId = req.params.id;
  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({
      message: "Company not found",
    });
  }
  return res.status(200).json({
    company,
  });
};

const updateCompany = async (req, res) => {
  const companyId = req.params.id;
  const { name, description, website, location, logo } = req.body;
  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({
      message: "Company not found",
    });
  }

  if (company.createdBy.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to update this company",
    });
  }

  company.name = name ?? company.name;
  company.description = description ?? company.description;
  company.website = website ?? company.website;
  company.location = location ?? company.location;
  company.logo = logo ?? company.logo;

  await company.save();

  return res.status(200).json({
    message: "Company updated successfully",
    company,
  });
};

const deleteCompany = async (req, res) => {

    const companyId = req.params.id;

    const company = await Company.findById(companyId);

    if (!company) {
        return res.status(404).json({
            message: "Company not found"
        });
    }

    if (company.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You are not authorized to delete this company"
        });
    }

    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({
        message: "Company deleted successfully"
    });
};
module.exports = { createCompany, getCompany, updateCompany, deleteCompany };
