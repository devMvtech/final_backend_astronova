const { Router } = require("express");
const {
  createTestimonial,
  updateTestimonial,
  getAllTestimonials,
  getTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial");

// Authenticate Routes
const { userAuth } = require("../middlewares/auth-middleware");

// Route
const router = Router();

// Testimonial Routes
router.post("/testimonialCreate", createTestimonial);
router.put("/testimonialUpdate/:id", updateTestimonial);
router.get("/allTestimonials", getAllTestimonials);
router.get("/:id", getTestimonial);
router.delete("/deleteTestimonial/:id", deleteTestimonial);

module.exports = router;
