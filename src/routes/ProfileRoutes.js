const express = require("express");
const router = express.Router();
const {
    getProfiles,
    getProfileById,
    updateProfile
} = require("../controllers/ProfileController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getProfiles);
router.get("/:id", getProfileById);
router.put("/:id", protect, updateProfile);

module.exports = router;
