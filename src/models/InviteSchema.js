const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ["President", "Vice President", "Treasurer", "Secretary", "Public Relations Officer", "Web Developer", "Social Media Manager", "Member"],
        required: true
    },
    memberType: {
        type: String,
        enum: ["General Member", "Executive Board"],
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Invite', InviteSchema);