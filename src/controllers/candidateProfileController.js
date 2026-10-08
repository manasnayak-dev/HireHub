const CandidateProfile = require("../models/CandidateProfile");

const createOrUpdateProfile = async (req, res) => {

    const {
        phone,
        location,
        bio,
        skills
    } = req.body;

    const profile = await CandidateProfile.findOne({
        user: req.user.id
    });

    if (!profile) {

        const newProfile = new CandidateProfile({
            user: req.user.id,
            phone,
            location,
            bio,
            skills
        });

        await newProfile.save();

        return res.status(201).json({
            message: "Candidate profile created successfully",
            profile: newProfile
        });
    }

    profile.phone = phone ?? profile.phone;
    profile.location = location ?? profile.location;
    profile.bio = bio ?? profile.bio;
    profile.skills = skills ?? profile.skills;

    await profile.save();

    return res.status(200).json({
        message: "Candidate profile updated successfully",
        profile
    });
};

module.exports = {
    createOrUpdateProfile
};