// const db = require("../db");
const db = require("../../database.js");
const fs = require("fs");
// Create Blog

exports.createBlog = async (req, res) => {
  const { coordinator_id, title, subtitle, description, tags } = req.body;

  try {
    // Check if the title already exists in the Blogs table
    const titleExists = await db.query("SELECT * FROM Blogs WHERE title = $1", [
      title,
    ]);

    if (titleExists.rows.length > 0) {
      return res.status(400).json({
        error: "Blog with the provided title already exists.",
      });
    }

    // Access uploaded files details through req.files
    // if (!req.files || !req.files["image"] || !req.files["video"]) {
    //   return res.status(400).send("Please provide both image and video files.");
    // }
    await Promise.all([
      new Promise((resolve) =>
        req.files["image"] ? resolve() : setTimeout(resolve, 100)
      ),
      new Promise((resolve) =>
        req.files["video"] ? resolve() : setTimeout(resolve, 100)
      ),
    ]);

    const image =
      req.files["image"] && req.files["image"][0]
        ? req.files["image"][0].path
        : null;

    const video =
      req.files["video"] && req.files["video"][0]
        ? req.files["video"][0].path
        : null;

    // Separate file upload logic from blog creation
    await db.query(
      `INSERT INTO Blogs (coordinator_id, title, subtitle, description, tags, image, video) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [coordinator_id, title, subtitle, description, tags, image, video]
    );

    return res.status(201).json({
      success: true,
      message: "The Blog registration was successful",
    });
  } catch (error) {
    // Handle errors, log them, and possibly delete the uploaded files
    console.log(error.message);
    // const image = req.files["image"][0].path;
    // const video = req.files["video"][0].path;

    // if (image) {
    //   fs.unlinkSync(image);
    // }
    // if (video) {
    //   fs.unlinkSync(video);
    // }

    return res.status(500).json({
      error: error.message,
    });
  }
};
// Update Blog

exports.updateBlog = async (req, res) => {
  const blogId = req.params.id; // Assuming you have a route parameter for the blog ID

  // Extract the fields you want to update from the request body
  const { coordinator_id, title, subtitle, description, tags } = req.body;

  try {
    // Check if the blog with the given ID exists
    const existingBlog = await db.query(
      "SELECT * FROM Blogs WHERE blog_id = $1",
      [blogId]
    );

    if (existingBlog.rows.length === 0) {
      return res.status(404).json({
        error: "Blog not found.",
      });
    }

    // Access uploaded files details through req.files
    // if (!req.files || !req.files["image"] || !req.files["video"]) {
    //   return res.status(400).send("Please provide both image and video files.");
    // }
    await Promise.all([
      new Promise((resolve) =>
        req.files["image"] ? resolve() : setTimeout(resolve, 100)
      ),
      new Promise((resolve) =>
        req.files["video"] ? resolve() : setTimeout(resolve, 100)
      ),
    ]);

    const image =
      req.files["image"] && req.files["image"][0]
        ? req.files["image"][0].path
        : null;

    const video =
      req.files["video"] && req.files["video"][0]
        ? req.files["video"][0].path
        : null;

    // Update the blog in the database
    await db.query(
      `UPDATE Blogs 
       SET coordinator_id = $1,
           title = $2,
           subtitle = $3,
           description = $4,
           tags = $5,
           image = $6,
           video = $7
       WHERE blog_id = $8`,
      [coordinator_id, title, subtitle, description, tags, image, video, blogId]
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
    });
  } catch (error) {
    console.log(error.message);
    // const image = req.files["image"][0].path;
    // const video = req.files["video"][0].path;

    // if (image) {
    //   fs.unlinkSync(image);
    // }
    // if (video) {
    //   fs.unlinkSync(video);
    // }
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get All Blogs

exports.getAllBlogs = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM Blogs");

    return res.status(200).json({
      success: true,
      blogs: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get Blog by id

exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db.query("SELECT * FROM Blogs WHERE blog_id = $1", [id]);
    res.json(blog.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
};

// Delete Blog by id

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Blogs WHERE blog_id = $1", [id]);
    res.json("Deleted Successfully !!");
  } catch (err) {
    console.log(err.message);
  }
};
