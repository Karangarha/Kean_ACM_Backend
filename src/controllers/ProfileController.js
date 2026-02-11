const mongoose = require("mongoose");
const Member = require("../models/Profile");

// @desc    Get all profiles
// @route   GET /api/profiles
// @access  Public
const getProfiles = async (req, res) => {
    try {
        const profiles = await Member.find({});
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get profile by ID
// @route   GET /api/profiles/:id
// @access  Public
const getProfileById = async (req, res) => {
    try {


        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Invalid Profile ID format" });
        }

        const profile = await Member.findById(req.params.id);
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: "Profile not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Private (Owner only)
const updateProfile = async (req, res) => {
    try {


        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Invalid Profile ID format" });
        }

        const profile = await Member.findById(req.params.id);

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Check if user is authorized to edit this profile
        // req.user is set by protect middleware
        // Helper: compare object IDs. 
        const isOwner = req.user.memberId._id.toString() === profile._id.toString();
        const isWebDev = req.user.memberId.position === "Web Developer";

        if (!isOwner && !isWebDev) {
            return res.status(401).json({ message: "Not authorized to edit this profile" });
        }

        // Update fields
        const { name, position, memberType, link, about } = req.body;
        // If an image was uploaded, req.file will exist and have a 'path' property from Cloudinary
        let imageUrl = profile.image;
        if (req.file) {
            imageUrl = req.file.path;
        } else if (req.body.image) {
            // Allow manual URL update if provided as string (fallback)
            imageUrl = req.body.image;
        }

        profile.name = name || profile.name;
        profile.position = position || profile.position;
        if (memberType) profile.Member = memberType;
        profile.image = imageUrl;
        profile.link = link || profile.link;
        profile.about = about || profile.about;

        const updatedProfile = await profile.save();
        res.json(updatedProfile);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getProfiles,
    getProfileById,
    updateProfile
};
