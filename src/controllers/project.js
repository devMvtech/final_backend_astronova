// const db = require("../db");
const db = require("../../database.js");
const fs = require("fs");

// Create Tinkering Lab Project
exports.createTinkeringLabProject = async (req, res) => {
  const {
    admin_id,
    name,
    description,
    short_description,
    team_members,
    images,
    featured_image_url,
    mentor,
    priority,
    status,
  } = req.body;

  try {
    // Check if the project name already exists
    const nameExists = await db.query(
      "SELECT * FROM TinkeringLabProjects WHERE name = $1",
      [name]
    );

    if (nameExists.rows.length > 0) {
      return res.status(400).json({
        error: "Project with the provided name already exists.",
      });
    }

    // Separate file upload logic from project creation
    await db.query(
      `INSERT INTO TinkeringLabProjects (admin_id, name, description, short_description, team_members, images, featured_image_url, mentor, priority, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        admin_id,
        name,
        description,
        short_description,
        team_members,
        images,
        featured_image_url,
        mentor,
        priority,
        status,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "The Tinkering Lab Project registration was successful",
    });
  } catch (error) {
    // Handle errors, log them, and possibly delete the uploaded files
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update Tinkering Lab Project
exports.updateTinkeringLabProject = async (req, res) => {
  const projectId = req.params.id; // Assuming you have a route parameter for the project ID

  // Extract the fields you want to update from the request body
  const {
    admin_id,
    name,
    description,
    short_description,
    team_members,
    images,
    featured_image_url,
    mentor,
    priority,
    status,
  } = req.body;

  try {
    // Check if the project with the given ID exists
    const existingProject = await db.query(
      "SELECT * FROM TinkeringLabProjects WHERE project_id = $1",
      [projectId]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found.",
      });
    }

    // Update the project in the database
    await db.query(
      `UPDATE TinkeringLabProjects 
       SET admin_id = $1,
           name = $2,
           description = $3,
           short_description = $4,
           team_members = $5,
           images = $6,
           featured_image_url = $7,
           mentor = $8,
           priority = $9,
           status = $10
       WHERE project_id = $11`,
      [
        admin_id,
        name,
        description,
        short_description,
        team_members,
        images,
        featured_image_url,
        mentor,
        priority,
        status,
        projectId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Tinkering Lab Project updated successfully.",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get All Tinkering Lab Projects
exports.getAllTinkeringLabProjects = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM TinkeringLabProjects");

    return res.status(200).json({
      success: true,
      tinkeringLabProjects: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get Tinkering Lab Project by id
exports.getTinkeringLabProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.query(
      "SELECT * FROM TinkeringLabProjects WHERE project_id = $1",
      [id]
    );
    res.json(project.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
};

// Delete Tinkering Lab Project by id
exports.deleteTinkeringLabProject = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM TinkeringLabProjects WHERE project_id = $1", [
      id,
    ]);
    res.json("Deleted Successfully !!");
  } catch (err) {
    console.log(err.message);
  }
};
