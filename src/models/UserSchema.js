const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }
});

module.exports = mongoose.model("User", UserSchema);
