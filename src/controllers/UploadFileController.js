// @desc    Upload profile image
// @route   POST /api/profiles/upload
// @access  Private
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Return the Cloudinary URL
        res.json({ imageUrl: req.file.path });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Server Error during file upload" });
    }
};

module.exports = {
    uploadImage
};