// const db = require("../db");
const db = require("../../database.js");

const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants/index.js");
const path = require("path");

// Get All Users
// req : GET /api/donor/get-all-donor?role=donor&page=2&pageSize=20

exports.getAllUser = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, role } = req.query;
    const offset = (page - 1) * pageSize;

    const { rows } = await db.query(
      `SELECT user_id, username, email, phone, address, role
       FROM "User"
       WHERE role = $1
       LIMIT $2 OFFSET $3`,
      [role, pageSize, offset]
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

// Get Single User

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const User = await db.query(
      `SELECT user_id, email, username, phone, address, role FROM "User" WHERE user_id = $1`,
      [id]
    );

    return res.status(200).json({
      success: true,
      user: User.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Donor Registration

exports.registerDonor = async (req, res) => {
  const { email, password, username, phone, address } = req.body;
  const role = "Donor";

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert into the User table and return the generated user_id
    const userResult = await db.query(
      `INSERT INTO "User" (email, password, username, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
      [email, hashedPassword, username, phone, address, role]
    );

    if (!userResult.rows[0]) {
      // Handle the case where no user was inserted
      return res.status(500).json({
        error: "User registration failed",
      });
    }

    const userId = userResult.rows[0].user_id;

    return res.status(201).json({
      success: true,
      message: "The Donor registration was successful",
      user_id: userId, // Include the user_id in the response
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Coordinator Registration

exports.registerCoordinator = async (req, res) => {
  const { email, password, username, phone, address } = req.body;
  const role = "Coordinator";

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert into the User table and return the generated user_id
    const userResult = await db.query(
      `INSERT INTO "User" (email, password, username, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
      [email, hashedPassword, username, phone, address, role]
    );

    if (!userResult.rows[0]) {
      // Handle the case where no user was inserted
      return res.status(500).json({
        error: "User registration failed",
      });
    }

    const userId = userResult.rows[0].user_id;

    return res.status(201).json({
      success: true,
      message: "The Coordinator registration was successful",
      user_id: userId, // Include the user_id in the response
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Admin Registration

exports.registerAdmin = async (req, res) => {
  const { email, password, username, phone, address } = req.body;
  const role = "Admin";

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert into the User table and return the generated user_id
    const userResult = await db.query(
      `INSERT INTO "User" (email, password, username, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
      [email, hashedPassword, username, phone, address, role]
    );

    if (!userResult.rows[0]) {
      // Handle the case where no user was inserted
      return res.status(500).json({
        error: "User registration failed",
      });
    }

    const userId = userResult.rows[0].user_id;

    return res.status(201).json({
      success: true,
      message: "The Admin registration was successful",
      user_id: userId, // Include the user_id in the response
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Ambassador Registration

exports.registerAmbassador = async (req, res) => {
  const { email, password, username, phone, address } = req.body;
  const role = "Ambassador";

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert into the User table and return the generated user_id
    const userResult = await db.query(
      `INSERT INTO "User" (email, password, username, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
      [email, hashedPassword, username, phone, address, role]
    );

    if (!userResult.rows[0]) {
      // Handle the case where no user was inserted
      return res.status(500).json({
        error: "User registration failed",
      });
    }

    const userId = userResult.rows[0].user_id;

    return res.status(201).json({
      success: true,
      message: "The Ambassador registration was successful",
      user_id: userId, // Include the user_id in the response
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

//Login

exports.login = async (req, res) => {
  let user = req.user;
  let payload = {
    id: user.user_id,
    email: user.email,
  };

  try {
    const token = await sign(payload, SECRET);
    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      token: token,
      message: "Logged in Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// User Logout
exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token", { httpOnly: true }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
