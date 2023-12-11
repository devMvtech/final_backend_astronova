const { Router } = require("express");

// Controllers
const {
  login,
  logout,
  registerDonor,
  registerCoordinator,
  registerAdmin,
  registerAmbassador,
  getAllUser,
  getUser,
} = require("../controllers/user");

// Middlewares
const {
  validationMiddleware,
} = require("../middlewares/validations-middleware");

const { userAuth } = require("../middlewares/auth-middleware");

// Validators
const { registerValidation, loginValidation } = require("../validators/auth");

// ROUTES
const router = Router();

// All Auth routes

router.get("/get-all-user", getAllUser);
router.get("/get-user", getUser);
router.post(
  "/register-donor",
  registerValidation,
  validationMiddleware,
  registerDonor
);
router.post(
  "/register-coordinator",
  registerValidation,
  validationMiddleware,
  registerCoordinator
);
router.post(
  "/register-admin",
  registerValidation,
  validationMiddleware,
  registerAdmin
);
router.post(
  "/register-ambassador",
  registerValidation,
  validationMiddleware,
  registerAmbassador
);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", logout);

// All Project routes

module.exports = router;
