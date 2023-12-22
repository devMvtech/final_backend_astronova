const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const {
  ambassador_register,
  getallEmbassador,
  getEmbassador,
  deleteEmbassador,
} = require("../controllers/ambassador");

// Authenticate Routes
const { userAuth } = require("../middlewares/auth-middleware");

// Multer Configuration for handling file uploads

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "ambassador");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Route
const router = Router();

router.post("/ambassador-registeration_form", ambassador_register);

router.get("/all-ambassadors", getallEmbassador);
router.get("/:id", getEmbassador);
router.delete("/delete-ambassador/:id", deleteEmbassador);

module.exports = router;
