const express = require("express");
const router = express.Router();
const {
    setupPassword,
    loginUser,
    logoutUser,
    getMe,
    forgotPassword,
    resetPassword
} = require("../controllers/AuthenticationController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public
router.put("/setup-password", setupPassword);
router.post("/login", loginUser); // Fixed to POST
router.get("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

// Protected
router.get("/me", protect, getMe);

module.exports = router;