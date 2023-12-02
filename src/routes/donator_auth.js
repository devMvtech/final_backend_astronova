const { Router } = require("express");

// Controllers
const {
  getDonators,
  register,
  login,
  logout,
} = require("../controllers/donator_auth");

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

router.get("/get-donators", userAuth, getDonators);
router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", logout);

// All Project routes

module.exports = router;
