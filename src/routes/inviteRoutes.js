const express = require("express");
const router = express.Router();
const { createInvite, getInvites, deleteInvite } = require("../controllers/InviteController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes here are protected and restricted to Executive Board
router.use(protect);
router.use(authorize("Executive Board"));

router.get("/", getInvites);
router.post("/", createInvite);
router.delete("/:id", deleteInvite);

module.exports = router;
