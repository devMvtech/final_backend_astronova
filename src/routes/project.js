const { Router } = require("express");
const {
  createProject,
  updateProject,
  getAllProjects,
  getProjectById,
  deleteProjectById,
} = require("../controllers/project");

// Authenticate Routes
const { userAuth } = require("../middlewares/auth-middleware");

// Route
const router = Router();

// Tinkering Lab Project Routes
router.post("/projectCreate", createProject);
router.put("/projectUpdate/:id", updateProject);
router.get("/allProjects", getAllProjects);
router.get("/:id", getProjectById);
router.delete("/deleteProject/:id", deleteProjectById);

module.exports = router;
