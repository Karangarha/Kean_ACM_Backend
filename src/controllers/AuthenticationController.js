const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");
const Member = require("../models/Profile");
const Invite = require("../models/InviteSchema");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Helper: Set Cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(
            Date.now() + 1 * 24 * 60 * 60 * 1000 // 1 day
        ),
        httpOnly: true,
        // secure: true // Enable in production (requires HTTPS)
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            _id: user.id,
            email: user.email,
            memberId: user.memberId,
            token // Optional: keep sending token in body for client flexibility
        });
};

// @desc    Setup Password / Activate Account via Token
// @route   POST /api/auth/setup-password
// @access  Public
const setupPassword = async (req, res) => {
    const password = req.body.password;
    const token = req.query.token;

    if (!token || !password) {
        return res.status(400).json({ message: "Please provide token and new password" });
    }

    try {
        // Find Invite
        const invite = await Invite.findOne({ token });

        if (!invite) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        if (invite.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Token has expired" });
        }

        if (invite.isUsed) {
            return res.status(400).json({ message: "Token already used" });
        }

        // Create Member Profile
        const member = await Member.create({
            name: invite.name,
            position: invite.position,
            Member: invite.memberType,
            image: null,
            link: null,
            about: null
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const user = await User.create({
            email: invite.email,
            password: hashedPassword,
            memberId: member._id
        });

        // Mark Invite as used
        invite.isUsed = true;
        await invite.save();

        res.json({ message: "Account verified and password set. You can now login." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    // Check if user has a password set
    if (!user || !user.password) {
        return res.status(400).json({ message: "Invalid credentials or account not active" });
    }

    if (await bcrypt.compare(password, user.password)) {
        sendTokenResponse(user, 200, res);
    } else {
        res.status(400).json({ message: "Invalid credentials" });
    }
};

// @desc    Logout user / Clear cookie
// @route   GET /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, data: {} });
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = {
    setupPassword,
    loginUser,
    logoutUser,
    getMe,
};
