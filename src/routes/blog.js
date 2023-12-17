const { Router } = require("express");

const { config } = require("dotenv");
config();

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

// Route
const router = Router();
router.post("/blogCreate", createBlog);
router.put("/blogUpdate/:id", updateBlog);

router.get("/allBlog", getAllBlogs);
router.get("/:id", getBlog);
router.delete("/deleteBlog/:id", deleteBlog);

module.exports = router;
