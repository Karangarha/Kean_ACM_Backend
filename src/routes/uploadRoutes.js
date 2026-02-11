const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/UploadFileController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../config/cloudinary");

// Route:  POST /api/upload
router.post("/", protect, upload.single("image"), uploadImage);

module.exports = router;