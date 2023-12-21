const { Router } = require("express");
const {
  createTinkeringLabProject,
  updateTinkeringLabProject,
  getAllTinkeringLabProjects,
  getTinkeringLabProject,
  deleteTinkeringLabProject,
} = require("../controllers/project");

// Authenticate Routes
const { userAuth } = require("../middlewares/auth-middleware");

// Route
const router = Router();

// Tinkering Lab Project Routes
router.post("/projectCreate", createTinkeringLabProject);
router.put("/projectUpdate/:id", updateTinkeringLabProject);
router.get("/allProjects", getAllTinkeringLabProjects);
router.get("/:id", getTinkeringLabProject);
router.delete("/deleteProject/:id", deleteTinkeringLabProject);

module.exports = router;
