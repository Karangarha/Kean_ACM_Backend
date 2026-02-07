const express = require("express");
const router = express.Router();
const {
    setupPassword,
    loginUser,
    logoutUser,
    getMe
} = require("../controllers/AuthenticationController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public
router.put("/setup-password", setupPassword);
router.get("/login", loginUser);
router.get("/logout", logoutUser);

// Protected
router.get("/me", protect, getMe);

module.exports = router;