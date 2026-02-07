const mongoose = require("mongoose");
const Event = require("../models/EventSchema");


const getEvents = async (req, res) => {
    try {
        const id = req.params.id || req.query.id;
        if (id) {
            const event = await Event.findById(id);
            if (!event) return res.status(404).json({ message: "Event not found" });
            return res.status(200).json(event);
        }
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateEvent = async (req, res) => {
    try {
        const id = req.params.id || req.query.id;
        const event = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id || req.query.id;
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    updateEvent,
    deleteEvent,
    createEvent
};