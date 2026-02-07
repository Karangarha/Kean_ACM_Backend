const mongoose = require("mongoose");

const MembersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        enum: ["President", "Vice President", "Treasurer", "Secretary", "Public Relations Officer", "Web Developer", "Social Media Manager", "Member"],
        required: true
    },
    Member: {
        type: String,
        enum: ["Executive Board", "General Member"],
        required: true
    },
    image: {
        type: String,
        default: null
    },
    link: {
        type: {
            github: {
                type: String,
                default: null
            },
            linkedin: {
                type: String,
                default: null
            },
            instagram: {
                type: String,
                default: null
            },
            twitter: {
                type: String,
                default: null
            },
            website: {
                type: String,
                default: null
            }
        },
        default: null
    },
    about: {
        type: {
            year: {
                type: String,
                enum: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"],
                default: null
            },
            major: {
                type: String,
                default: null
            },
            minor: {
                type: String,
                default: null
            },
            personal_goals: {
                type: String,
                default: null
            }
        },
        default: null
    },
});

module.exports = mongoose.model("Profile", MembersSchema);