const crypto = require("crypto");
const Invite = require("../models/InviteSchema");
const User = require("../models/UserSchema");
const sendEmail = require("../utils/sendEmail");

// @desc    Create a new invite
// @route   POST /api/invites
// @access  Private (Executive Board)
const createInvite = async (req, res) => {
    const { email, name, position, memberType } = req.body;

    if (!email || !name || !position) {
        return res.status(400).json({ message: "Please provide email, name, and position" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User with this email already exists" });
    }

    // Auto-infer memberType if not provided
    // If position is 'Member', type is 'General Member', else 'Executive Board'
    let finalMemberType = memberType;
    if (!finalMemberType) {
        finalMemberType = position === "Member" ? "General Member" : "Executive Board";
    }

    // Generate Token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    try {
        const invite = await Invite.create({
            token,
            email,
            name,
            position,
            memberType: finalMemberType,
            expiresAt
        });

        // Use the origin of the request (frontend) as the base URL if available, otherwise fall back to env or localhost
        const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
        const inviteLink = `${frontendUrl}/register?token=${token}`;

        const message = `You have been invited to join the Kean ACM Executive Board/General Members. Please click the link below to activate your account and set your password:\n\n${inviteLink}\n\nThis link will expire in 24 hours.`;

        try {
            await sendEmail({
                email: invite.email,
                subject: 'Kean ACM Invitation',
                message
            });

            res.status(201).json({
                success: true,
                message: "Invite sent successfully",
                token,
                inviteLink,
                data: invite
            });
        } catch (error) {
            await invite.deleteOne(); // Cleanup if email fails
            console.error(error);
            return res.status(500).json({ message: "Email could not be sent. Invite not created." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

// @desc    Get all invites
// @route   GET /api/invites
// @access  Private (Executive Board)
const getInvites = async (req, res) => {
    try {
        const invites = await Invite.find({});
        res.json(invites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete invite
// @route   DELETE /api/invites/:id
// @access  Private (Executive Board)
const deleteInvite = async (req, res) => {
    try {
        const invite = await Invite.findById(req.params.id);

        if (!invite) {
            return res.status(404).json({ message: "Invite not found" });
        }

        await invite.deleteOne();
        res.json({ message: "Invite removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createInvite,
    getInvites,
    deleteInvite
};
