const { Router } = require("express");

const path = require("path");

// Authenticate Routes
const { userAuth } = require("../middlewares/auth-middleware");
const {
  getAllEvents,
  getEvent,
  deleteEvent,
  updateEvent,
  createEvent,
} = require("../controllers/event");

// Route
const router = Router();

router.post("/eventCreate", createEvent);
router.put("/eventUpdate/:id", updateEvent);
router.get("/allEvents", getAllEvents);
router.get("/:id", getEvent);
router.delete("/deleteEvent/:id", deleteEvent);

module.exports = router;
