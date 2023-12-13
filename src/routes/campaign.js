const { Router } = require("express");
const multer = require("multer");
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

// Multer Configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "campaign");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
    files: 5, // Max number of files
  },
});

// Route
const router = Router();

router.post(
  "/campaignCreate",
  // upload.fields([
  //   { name: "featured_image", maxCount: 1 },
  //   { name: "gallery_images", maxCount: 5 },
  //   { name: "video", maxCount: 5 },
  // ]),
  createCampaign
);
router.put(
  "/campaignUpdate/:id",
  // upload.fields([
  //   { name: "featured_image", maxCount: 1 },
  //   { name: "gallery_images", maxCount: 5 },
  //   { name: "video", maxCount: 5 },
  // ]),
  updateCampaign
);
router.get("/allCampaign", getallCampaign);
router.get("/:id", getCampaign);
router.delete("/deleteCampaign/:id", deleteCampaign);

module.exports = router;
