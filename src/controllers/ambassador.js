// const db = require("../db");
const db = require("../../database.js");

// Ambassador Registration

exports.ambassador_register = async (req, res) => {
  const {
    email,
    first_name,
    last_name,
    phone,
    date_of_birth,
    country,
    nationality,
    description,
    ambassador_type,
  } = req.body;

  try {
    // Check if the email already exists in the "User" table
    const userExists = await db.query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        error: "User with the provided email does not exist.",
      });
    }

    // Check if the email already exists in the "ambassadorRequest" table
    const ambassadorRequestExists = await db.query(
      "SELECT * FROM ambassadorRequest WHERE email = $1",
      [email]
    );

    if (ambassadorRequestExists.rows.length > 0) {
      return res.status(400).json({
        error: "Ambassador request with the provided email already exists.",
      });
    }

    console.log(req.files);

    // Access uploaded files details through req.files
    if (!req.files || !req.files["resume"] || !req.files["self_intro_video"]) {
      return res
        .status(400)
        .send("Please provide both resume and self_intro_video.");
    }

    const resume = req.files["resume"][0].path; // Access the resume file
    const self_intro_video = req.files["self_intro_video"][0].path; // Access the aself_intro_video files
    await db.query(
      `insert into ambassadorRequest (email,  first_name, last_name, phone, dob, country, nationality, description, resume, self_intro_video, ambassador_type) values ($1 , $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        email,
        first_name,
        last_name,
        phone,
        date_of_birth,
        country,
        nationality,
        description,
        resume,
        self_intro_video,
        ambassador_type,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "The Ambassador registration was successfull",
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
