// const db = require("../db");
const db = require("../../database.js");
const fs = require("fs");

// Create Invoice

exports.createInvoice = async (req, res) => {
  const {
    title,
    email,
    mode_of_payment,
    address,
    description,
    quantity,
    rate,
    amount,
    tax_id,
    invoice_date,
    due_date,
    coordinator_id,
  } = req.body;

  try {
    // Check if the title already exists in the Invoices table
    const titleExists = await db.query(
      "SELECT * FROM Invoices WHERE title = $1",
      [title]
    );

    if (titleExists.rows.length > 0) {
      return res.status(400).json({
        error: "Invoice with the provided title already exists.",
      });
    }

    // Separate file upload logic from invoice creation
    await db.query(
      `INSERT INTO Invoices (title, email, mode_of_payment, address, description, quantity, rate, amount, tax_id, invoice_date, due_date ,coordinator_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        title,
        email,
        mode_of_payment,
        address,
        description,
        quantity,
        rate,
        amount,
        tax_id,
        invoice_date,
        due_date,
        coordinator_id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "The Invoice registration was successful",
    });
  } catch (error) {
    // Handle errors, log them, and possibly delete the uploaded files
    console.log(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update Invoice

exports.updateInvoice = async (req, res) => {
  const invoiceId = req.params.id; // Assuming you have a route parameter for the invoice ID

  // Extract the fields you want to update from the request body
  const {
    title,
    email,
    mode_of_payment,
    address,
    description,
    quantity,
    rate,
    amount,
    tax_id,
    invoice_date,
    due_date,
    coordinator_id,
  } = req.body;

  try {
    // Check if the invoice with the given ID exists
    const existingInvoice = await db.query(
      "SELECT * FROM Invoices WHERE invoice_id = $1",
      [invoiceId]
    );

    if (existingInvoice.rows.length === 0) {
      return res.status(404).json({
        error: "Invoice not found.",
      });
    }

    // Update the invoice in the database
    await db.query(
      `UPDATE Invoices 
       SET title = $1,
           email = $2,
           mode_of_payment = $3,
           address = $4,
           description = $5,
           quantity = $6,
           rate = $7,
           amount = $8,
           tax_id = $9,
           invoice_date = $10,
           due_date = $11,
           coordinator_id = $12
       WHERE invoice_id = $13`,
      [
        title,
        email,
        mode_of_payment,
        address,
        description,
        quantity,
        rate,
        amount,
        tax_id,
        invoice_date,
        due_date,
        coordinator_id,
        invoiceId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully.",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get All Invoices

exports.getAllInvoices = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM Invoices");

    return res.status(200).json({
      success: true,
      invoices: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get Invoice by id

exports.getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await db.query(
      "SELECT * FROM Invoices WHERE invoice_id = $1",
      [id]
    );
    res.json(invoice.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
};

// Delete Invoice by id

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Invoices WHERE invoice_id = $1", [id]);
    res.json("Deleted Successfully !!");
  } catch (err) {
    console.log(err.message);
  }
};
