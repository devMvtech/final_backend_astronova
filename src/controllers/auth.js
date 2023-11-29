const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");
const path = require("path");

// Get All Users

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query(
      "select user_id, email, profile_img from users"
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

// User Registration

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const profile_img = req.file.path;

  try {
    const hashedPassword = await hash(password, 10);

    await db.query(
      `insert into users(email, password, profile_img) values ($1 , $2, $3)`,
      [email, hashedPassword, profile_img]
    );

    return res.status(201).json({
      success: true,
      message: "The registration was successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// User Login

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
