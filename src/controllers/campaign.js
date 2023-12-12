// const db = require("../db");
const db = require("../../database.js");

// Create Campaign

exports.createCampaign = async (req, res) => {
  const {
    coordinator_id,
    title,
    short_description,
    long_description,
    department,
    target_fund_dollars,
    target_fund_rupees,
    start_date,
    end_date,
  } = req.body;

  try {
    // Check if the title already exists in the campaigns table
    const titleExists = await db.query(
      "SELECT * FROM campaigns WHERE title = $1",
      [title]
    );

    if (titleExists.rows.length > 0) {
      return res.status(400).json({
        error: "Campaign with the provided title already exist.",
      });
    }

    // Access uploaded files details through req.files
    /*
    if (
      !req.files ||
      !req.files["featured_image"] ||
      !req.files["gallery_images"] ||
      !req.files["video"]
    ) {
      return res
        .status(400)
        .send("Please provide both featured_image and gallery_images.");
    }

      */

    const featured_image =
      req.files["featured_image"] && req.files["featured_image"][0]
        ? req.files["featured_image"][0].path
        : null;
    const gallery_images =
      req.files["gallery_images"] && req.files["gallery_images"].length > 0
        ? req.files["gallery_images"].map((file) => file.path)
        : null;
    const video =
      req.files["video"] && req.files["video"][0]
        ? req.files["video"][0].path
        : null;

    await db.query(
      `INSERT INTO campaigns (coordinator_id, title, short_description, long_description, video, department, featured_image, gallery_images, target_fund_dollars, target_fund_rupees, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        coordinator_id,
        title,
        short_description,
        long_description,
        video,
        department,
        featured_image,
        gallery_images,
        target_fund_dollars,
        target_fund_rupees,
        start_date,
        end_date,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "The Campaign registration was successfull",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update Campaign

exports.updateCampaign = async (req, res) => {
  const campaignId = req.params.id; // Assuming you have a route parameter for the campaign ID

  // Extract the fields you want to update from the request body
  const {
    coordinator_id,
    title,
    short_description,
    long_description,
    department,
    target_fund_dollars,
    target_fund_rupees,
    start_date,
    end_date,
  } = req.body;

  try {
    // Check if the campaign with the given ID exists
    const existingCampaign = await db.query(
      "SELECT * FROM campaigns WHERE campaign_id = $1",
      [campaignId]
    );

    if (existingCampaign.rows.length === 0) {
      return res.status(404).json({
        error: "Campaign not found.",
      });
    }

    // Access uploaded files details through req.files
    /*
    if (
      !req.files ||
      !req.files["featured_image"] ||
      !req.files["gallery_images"] ||
      !req.files["video"]
    ) {
      return res
        .status(400)
        .send("Please provide both featured_image and gallery_images.");
    }

      */

    const featured_image =
      req.files["featured_image"] && req.files["featured_image"][0]
        ? req.files["featured_image"][0].path
        : null;
    const gallery_images =
      req.files["gallery_images"] && req.files["gallery_images"].length > 0
        ? req.files["gallery_images"].map((file) => file.path)
        : null;
    const video =
      req.files["video"] && req.files["video"][0]
        ? req.files["video"][0].path
        : null;

    // Update the campaign in the database
    await db.query(
      `UPDATE campaigns 
       SET coordinator_id = $1,
           title = $2,
           short_description = $3,
           long_description = $4,
           video = $5,
           department = $6,
           featured_image = $7,
           gallery_images = $8,
           target_fund_dollars = $9,
           target_fund_rupees = $10,
           start_date = $11,
           end_date = $12
       WHERE campaign_id = $13`,
      [
        coordinator_id,
        title,
        short_description,
        long_description,
        video,
        department,
        featured_image,
        gallery_images,
        target_fund_dollars,
        target_fund_rupees,
        start_date,
        end_date,
        campaignId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get All Campaign

exports.getallCampaign = async (req, res) => {
  try {
    const { rows } = await db.query("select * from campaigns");

    return res.status(200).json({
      success: true,
      campaigns: rows,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get Campaign by id

exports.getCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const embassador = await db.query(
      "SELECT * FROM campaigns WHERE campaign_id = $1",
      [id]
    );
    res.json(embassador.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
};

// Delete Campaign by id

exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await db.query(
      "DELETE FROM campaigns WHERE campaign_id = $1",
      [id]
    );
    res.json("Deleted Successfully !!");
  } catch (err) {
    console.log(err.message);
  }
};
