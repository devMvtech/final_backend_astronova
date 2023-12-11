const { Router } = require("express");
const multer = require("multer");
const path = require("path");

// Authenticate Routes
const { userAuth } = require("../middlewares/auth-middleware");
const {
  getAllBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  createBlog,
} = require("../controllers/blog");

// Multer Configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "blog");
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
  "/blogCreate",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createBlog
);
router.post(
  "/blogUpdate/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateBlog
);
router.get("/allBlog", getAllBlogs);
router.get("/:id", getBlog);
router.delete("/deleteBlog/:id", deleteBlog);

module.exports = router;
