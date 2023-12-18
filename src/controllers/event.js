// const db = require("../db");
const db = require("../../database.js");
const fs = require("fs");

// Create Event
exports.createEvent = async (req, res) => {
  const {
    coordinator_id,
    title,
    description,
    image,
    video,
    google_form_link,
  } = req.body;

  try {
    // Check if the title already exists in the Events table
    const titleExists = await db.query(
      "SELECT * FROM Events WHERE title = $1",
      [title]
    );

    if (titleExists.rows.length > 0) {
      return res.status(400).json({
        error: "Event with the provided title already exists.",
      });
    }

    // Separate file upload logic from event creation
    await db.query(
      `INSERT INTO Events (coordinator_id, title, description, image, video, google_form_link) VALUES ($1, $2, $3, $4, $5, $6)`,
      [coordinator_id, title, description, image, video, google_form_link]
    );

    return res.status(201).json({
      success: true,
      message: "The Event registration was successful",
    });
  } catch (error) {
    // Handle errors, log them, and possibly delete the uploaded files
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  const eventId = req.params.id; // Assuming you have a route parameter for the event ID

  // Extract the fields you want to update from the request body
  const {
    coordinator_id,
    title,
    description,
    google_form_link,
    image,
    video,
  } = req.body;

  try {
    // Check if the event with the given ID exists
    const existingEvent = await db.query(
      "SELECT * FROM Events WHERE event_id = $1",
      [eventId]
    );

    if (existingEvent.rows.length === 0) {
      return res.status(404).json({
        error: "Event not found.",
      });
    }

    // Update the event in the database
    await db.query(
      `UPDATE Events 
       SET coordinator_id = $1,
           title = $2,
           description = $3,
           image = $4,
           video = $5,
           google_form_link = $6
       WHERE event_id = $7`,
      [
        coordinator_id,
        title,
        description,
        image,
        video,
        google_form_link,
        eventId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM Events");

    return res.status(200).json({
      success: true,
      events: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get Event by id
exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db.query("SELECT * FROM Events WHERE event_id = $1", [
      id,
    ]);
    res.json(event.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
};

// Delete Event by id
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Events WHERE event_id = $1", [id]);
    res.json("Deleted Successfully !!");
  } catch (err) {
    console.log(err.message);
  }
};
