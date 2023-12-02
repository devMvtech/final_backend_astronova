const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");
const path = require("path");

// Get All Donators

exports.getDonators = async (req, res) => {
  try {
    const { rows } = await db.query(
      "select donator_id, name, email, phone, address from donators"
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

// Donator Registration

exports.register = async (req, res) => {
  const { email, password, name, phone, address } = req.body;

  try {
    const hashedPassword = await hash(password, 10);

    await db.query(
      `insert into donators(email, password, name, phone, address) values ($1 , $2, $3, $4, $5)`,
      [email, hashedPassword, name, phone, address]
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
  let donator = req.donator;
  let payload = {
    id: donator.donator_id,
    email: donator.email,
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
