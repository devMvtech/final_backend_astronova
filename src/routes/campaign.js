const { Router } = require("express");

const { config } = require("dotenv");
config();
const path = require("path");
// Authenticate Routes
const { userAuth } = require("../middlewares/auth-middleware");
const {
  createCampaign,
  getallCampaign,
  getCampaign,
  deleteCampaign,
  updateCampaign,
} = require("../controllers/campaign");

// Route
const router = Router();

///      test code end
router.post("/campaignCreate", createCampaign);
router.put("/campaignUpdate/:id", updateCampaign);
router.get("/allCampaign", getallCampaign);
router.get("/:id", getCampaign);
router.delete("/deleteCampaign/:id", deleteCampaign);

module.exports = router;
