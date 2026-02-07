const express = require("express");
const router = express.Router();
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/EventController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getEvents);
router.get("/:id", getEvents);

// Protected routes (Executive Board only)
router.post("/", protect, authorize("Executive Board"), createEvent);
router.put("/:id", protect, authorize("Executive Board"), updateEvent);
router.delete("/:id", protect, authorize("Executive Board"), deleteEvent);

module.exports = router;