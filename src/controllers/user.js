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
      `SELECT user_id,  email,
      first_name,
      last_name,
      phone,
      address,
      google_id,
      google_token,
      insta_url,
      postal_code,
      state,
      country,
      twitter_url, role
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
      `SELECT user_id,
      email,
      password,
      first_name,
      last_name,
      phone,
      address,
      google_id,
      google_token,
      insta_url,
      postal_code,
      state,
      country,
      twitter_url,
       role FROM "User" WHERE user_id = $1`,
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
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    address,
    google_id,
    google_token,
    insta_url,
    postal_code,
    state,
    country,
    twitter_url,
  } = req.body;
  const role = "Donor";

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    const userResult = await db.query(
      `INSERT INTO "User" (
        email, password, first_name, last_name, phone, address, role, 
        google_id, google_token, insta_url, postal_code, 
        state, country, twitter_url
      ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING user_id`,
      [
        email,
        hashedPassword,
        first_name,
        last_name,
        phone,
        address,
        role,
        google_id,
        google_token,
        insta_url,
        postal_code,
        state,
        country,
        twitter_url,
      ]
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

// Donor Update

exports.updateDonor = async (req, res) => {
  const { userId } = req.params; // Assuming userId is part of the route parameters
  const {
    first_name,
    last_name,
    phone,
    address,
    insta_url,
    postal_code,
    state,
    country,
    twitter_url,
  } = req.body;

  try {
    // Check if the user exists
    const userCheck = await db.query(
      `SELECT * FROM "User" WHERE user_id = $1`,
      [userId]
    );
    console.log(userId);

    if (!userCheck.rows[0]) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Update user information
    const updateResult = await db.query(
      `UPDATE "User" 
       SET first_name = $1, last_name = $2, 
       phone = $3, address = $4, 
       insta_url = $5, 
       postal_code = $6, state = $7, country = $8, twitter_url = $9 
       WHERE user_id = $10 
       RETURNING user_id`,
      [
        first_name,
        last_name,
        phone,
        address,
        insta_url,
        postal_code,
        state,
        country,
        twitter_url,
        userId,
      ]
    );
    if (!updateResult.rows[0]) {
      return res.status(500).json({
        error: "User update failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "The Donor information was successfully updated",
      user_id: userId,
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
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    address,
    google_id,
    google_token,
    insta_url,
    postal_code,
    state,
    country,
    twitter_url,
  } = req.body;
  const role = "Coordinator";

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert into the User table and return the generated user_id
    const userResult = await db.query(
      `INSERT INTO "User" (
        email, password, first_name, last_name, phone, address, role, 
        google_id, google_token, insta_url, postal_code, 
        state, country, twitter_url
      ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING user_id`,
      [
        email,
        hashedPassword,
        first_name,
        last_name,
        phone,
        address,
        role,
        google_id,
        google_token,
        insta_url,
        postal_code,
        state,
        country,
        twitter_url,
      ]
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
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    address,
    google_id,
    google_token,
    insta_url,
    postal_code,
    state,
    country,
    twitter_url,
  } = req.body;
  const role = "Admin";

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert into the User table and return the generated user_id
    const userResult = await db.query(
      `INSERT INTO "User" (
        email, password, first_name, last_name, phone, address, role, 
        google_id, google_token, insta_url, postal_code, 
        state, country, twitter_url
      ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING user_id`,
      [
        email,
        hashedPassword,
        first_name,
        last_name,
        phone,
        address,
        role,
        google_id,
        google_token,
        insta_url,
        postal_code,
        state,
        country,
        twitter_url,
      ]
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
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    address,
    google_id,
    google_token,
    insta_url,
    postal_code,
    state,
    country,
    twitter_url,
  } = req.body;
  const role = "Ambassador";

  try {
    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert into the User table and return the generated user_id
    // Insert into the User table and return the generated user_id
    const userResult = await db.query(
      `INSERT INTO "User" (
            email, password, first_name, last_name, phone, address, role, 
            google_id, google_token, insta_url, postal_code, 
            state, country, twitter_url
          ) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
           RETURNING user_id`,
      [
        email,
        hashedPassword,
        first_name,
        last_name,
        phone,
        address,
        role,
        google_id,
        google_token,
        insta_url,
        postal_code,
        state,
        country,
        twitter_url,
      ]
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
