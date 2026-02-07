const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        default: null
    },

});

module.exports = mongoose.model("Event", EventSchema);