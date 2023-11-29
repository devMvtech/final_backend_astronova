const { Router } = require("express");
const multer = require("multer");
const path = require("path");

// Controllers
const { getUsers, register, login, logout } = require("../controllers/auth");

// Middlewares
const {
  validationMiddleware,
} = require("../middlewares/validations-middleware");

const { userAuth } = require("../middlewares/auth-middleware");

// Validators
const { registerValidation, loginValidation } = require("../validators/auth");

// Multer Configuration for handling file uploads

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "profile_images");
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${ext}`);
//   },
// });

const upload = multer({ dest: "profile_images" });

// ROUTES
const router = Router();

// All Auth routes

router.get("/get-users", userAuth, getUsers);
router.post(
  "/register",
  registerValidation,
  validationMiddleware,
  upload.single("profile_img"),
  register
);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", logout);

// All Project routes

module.exports = router;
