// const db = require("../db");
const db = require("../../database.js");
const fs = require("fs");

// Create Testimonial
exports.createTestimonial = async (req, res) => {
  const {
    coordinator_id,
    name,
    campaign_name,
    image_url,
    description,
  } = req.body;

  try {
    // Check if the name already exists in the Testimonials table
    const nameExists = await db.query(
      "SELECT * FROM Testimonials WHERE name = $1",
      [name]
    );

    if (nameExists.rows.length > 0) {
      return res.status(400).json({
        error: "Testimonial with the provided name already exists.",
      });
    }

    // Separate file upload logic from testimonial creation
    await db.query(
      `INSERT INTO Testimonials (coordinator_id, name, campaign_name, image_url, description) VALUES ($1, $2, $3, $4, $5)`,
      [coordinator_id, name, campaign_name, image_url, description]
    );

    return res.status(201).json({
      success: true,
      message: "The Testimonial registration was successful",
    });
  } catch (error) {
    // Handle errors, log them, and possibly delete the uploaded files
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update Testimonial
exports.updateTestimonial = async (req, res) => {
  const testimonialId = req.params.id; // Assuming you have a route parameter for the testimonial ID

  // Extract the fields you want to update from the request body
  const {
    coordinator_id,
    name,
    campaign_name,
    image_url,
    description,
  } = req.body;

  try {
    // Check if the testimonial with the given ID exists
    const existingTestimonial = await db.query(
      "SELECT * FROM Testimonials WHERE testimonial_id = $1",
      [testimonialId]
    );

    if (existingTestimonial.rows.length === 0) {
      return res.status(404).json({
        error: "Testimonial not found.",
      });
    }

    // Update the testimonial in the database
    await db.query(
      `UPDATE Testimonials 
       SET coordinator_id = $1,
           name = $2,
           campaign_name = $3,
           image_url = $4,
           description = $5
       WHERE testimonial_id = $6`,
      [
        coordinator_id,
        name,
        campaign_name,
        image_url,
        description,
        testimonialId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get All Testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM Testimonials");

    return res.status(200).json({
      success: true,
      testimonials: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get Testimonial by id
exports.getTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await db.query(
      "SELECT * FROM Testimonials WHERE testimonial_id = $1",
      [id]
    );
    res.json(testimonial.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
};

// Delete Testimonial by id
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Testimonials WHERE testimonial_id = $1", [id]);
    res.json("Deleted Successfully !!");
  } catch (err) {
    console.log(err.message);
  }
};
