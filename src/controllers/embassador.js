// const db = require("../db");
const db = require("../../database.js");

// Embassador Registration

exports.embassador_register = async (req, res) => {
  const {
    email,
    full_name,
    phone,
    date_of_birth,
    country,
    nationality,
    description,
    embassador_type,
  } = req.body;

  try {
    // Access uploaded files details through req.files
    if (!req.files || !req.files["resume"] || !req.files["self_intro_video"]) {
      return res
        .status(400)
        .send("Please provide both resume and self_intro_video.");
    }

    const resume = req.files["resume"][0].path; // Access the resume file
    const self_intro_video = req.files["self_intro_video"][0].path; // Access the aself_intro_video files
    await db.query(
      `insert into embassadors(email,  full_name, phone, date_of_birth, country, nationality, description, resume, self_intro_video, embassador_type) values ($1 , $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        email,
        full_name,
        phone,
        date_of_birth,
        country,
        nationality,
        description,
        resume,
        self_intro_video,
        embassador_type,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "The embassador registration was successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get All Embassador

exports.getallEmbassador = async (req, res) => {
  try {
    const { rows } = await db.query(
      "select embassador_id, full_name, email, phone, date_of_birth, country, nationality, description, resume, resume, self_intro_video, embassador_type from embassadors"
    );

    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get Embassador by id

exports.getEmbassador = async (req, res) => {
  try {
    const { id } = req.params;
    const embassador = await db.query(
      "SELECT * FROM embassadors WHERE embassador_id = $1",
      [id]
    );
    res.json(embassador.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
};

// Delete Embassador by id

exports.deleteEmbassador = async (req, res) => {
  try {
    const { id } = req.params;
    const embassador = await db.query(
      "DELETE FROM embassadors WHERE embassador_id = $1",
      [id]
    );
    res.json("Deleted Successfully !!");
  } catch (err) {
    console.log(err.message);
  }
};
