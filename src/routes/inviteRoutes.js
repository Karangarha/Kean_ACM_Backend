const express = require("express");
const router = express.Router();
const { createInvite } = require("../controllers/InviteController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes here are protected and restricted to Executive Board
router.use(protect);
router.use(authorize("Executive Board"));

router.post("/", createInvite);

module.exports = router;
