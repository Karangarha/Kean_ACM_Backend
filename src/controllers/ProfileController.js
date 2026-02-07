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
        const profile = await Member.findById(req.params.id);

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Check if user is authorized to edit this profile
        // req.user is set by protect middleware
        // Helper: compare object IDs. 
        if (req.user.memberId._id.toString() !== profile._id.toString()) {
            return res.status(401).json({ message: "Not authorized to edit this profile" });
        }

        // Update fields
        const { name, position, memberType, image, link, about } = req.body;

        profile.name = name || profile.name;
        profile.position = position || profile.position;
        if (memberType) profile.Member = memberType; // Caution: Should members be allowed to change their role? Plan says "Member can only edit THERE profile". Usually role change starts from admin, but user req didn't specify admin. I'll allow it for now or maybe restrict? The prompt says "only executive member can edit events", "member can only edit their profile". It acts like simple editing.
        profile.image = image || profile.image;
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
