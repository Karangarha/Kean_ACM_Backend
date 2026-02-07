const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const Member = require("../models/Profile");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select("-password").populate('memberId');

            if (!req.user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.memberId) {
            return res.status(401).json({ message: "Not authorized, member profile not found" });
        }

        // Check if member's role matches any of the allowed roles
        // Based on Profile.js, the field is 'Member' which contains "Executive Board" or "General Member"
        // The middleware usage in plan said `checkRole(['Executive Board'])`

        if (!roles.includes(req.user.memberId.Member)) {
            return res.status(403).json({ message: `User role ${req.user.memberId.Member} is not authorized to access this route` });
        }
        next();
    };
};

module.exports = { protect, authorize };
