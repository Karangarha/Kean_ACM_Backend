const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/UserSchema");
const Member = require("../models/Profile");
const Invite = require("../models/InviteSchema");
const sendEmail = require("../utils/sendEmail");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
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
        secure: process.env.NODE_ENV === 'production', // Enable in production (requires HTTPS)
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Allow cross-site in production
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
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).populate("memberId");

        // Check if user has a password set
        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid credentials or account not active" });
        }

        if (await bcrypt.compare(password, user.password)) {
            sendTokenResponse(user, 200, res);
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error during login" });
    }
};

// @desc    Logout user / Clear cookie
// @route   GET /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({ success: true, data: {} });
};



// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url
        // NOTE: This should point to your FRONTEND URL in a real app
        // e.g. `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
        // For now we assume a standard React running on localhost:5173 or 3000
        // Use environment variable for frontend URL, default to localhost for dev
        const frontendUrl = process.env.FRONTEND_URL;
        if (!frontendUrl) {
            console.warn("WARNING: FRONTEND_URL is not defined in environment variables. Falling back to http://localhost:5173 for password reset link.");
        }
        const resetUrl = `${frontendUrl || 'http://localhost:5173'}/resetpassword/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({ success: true, data: "Email sent" });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ message: "Email could not be sent" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    }).populate('memberId');

    if (!user) {
        return res.status(400).json({ message: "Invalid token" });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
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
    forgotPassword,
    resetPassword
};
