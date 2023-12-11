const { Router } = require("express");
const multer = require("multer");
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

// Multer Configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "event");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
    files: 5, // Max number of files
  },
});

// Route
const router = Router();

router.post(
  "/eventCreate",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createEvent
);
router.post(
  "/eventUpdate/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateEvent
);
router.get("/allEvents", getAllEvents);
router.get("/:id", getEvent);
router.delete("/deleteEvents/:id", deleteEvent);

module.exports = router;
