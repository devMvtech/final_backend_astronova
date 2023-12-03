const { check } = require("express-validator");
// const db = require("../db");
const db = require("../../database.js");

const { compare } = require("bcryptjs");

// password
const password = check("password")
  .isLength({ min: 6, max: 15 })
  .withMessage("Password has to be between 6 and 15 characters. ");

// email
const email = check("email")
  .isEmail()
  .withMessage("Please provide a valid email");

// check if email exists
const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query(`SELECT * from donators WHERE email = $1`, [
    value,
  ]);

  if (rows.length) {
    throw new Error("Email already exists");
  }
});

// login validation
const loginFieldsCheck = check("email").custom(async (value, { req }) => {
  const donator = await db.query("SELECT * from donators WHERE email = $1", [
    value,
  ]);

  if (!donator.rows.length) {
    throw new Error("Email does not exist.");
  }

  const validPassword = await compare(
    req.body.password,
    donator.rows[0].password
  );

  if (!validPassword) {
    throw new Error("Wrong password");
  }

  req.donator = donator.rows[0];
});

module.exports = {
  registerValidation: [email, password, emailExists],
  loginValidation: [loginFieldsCheck],
};
