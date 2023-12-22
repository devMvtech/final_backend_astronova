const db = require("../../database.js");
const fs = require("fs");

// Create Project
exports.createProject = async (req, res) => {
  const {
    cover_img,
    title,
    subtitle,
    short_description,
    long_description,
    product_img,
    status,
    admin_id,
    team_members,
  } = req.body;

  try {
    // Start a transaction
    await db.query("BEGIN");

    // Insert project details
    const projectResult = await db.query(
      "INSERT INTO projects (cover_img, title, subtitle, short_description, long_description, product_img, status, admin_id, team_members) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        cover_img,
        title,
        subtitle,
        short_description,
        long_description,
        product_img,
        status,
        admin_id,
        team_members,
      ]
    );

    const projectId = projectResult.rows[0].id;

    // Insert team members associated with the project into the junction table
    if (team_members && team_members.length > 0) {
      const insertTeamMembersQuery =
        "INSERT INTO project_team_members (project_id, member_id) VALUES ($1, $2)";

      for (const teamMemberId of team_members) {
        await db.query(insertTeamMembersQuery, [projectId, teamMemberId]);
      }
    }

    // Commit the transaction
    await db.query("COMMIT");

    return res
      .status(201)
      .json({ success: true, project: projectResult.rows[0] });
  } catch (error) {
    // Rollback the transaction in case of an error
    await db.query("ROLLBACK");
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  const projectId = req.params.id; // Assuming you have a route parameter for the project ID

  // Extract the fields you want to update from the request body
  const {
    cover_img,
    title,
    subtitle,
    short_description,
    long_description,
    team_members,
    product_img,
    status,
    admin_id,
  } = req.body;

  try {
    // Check if the project with the given ID exists
    const existingProject = await db.query(
      "SELECT * FROM project WHERE id = $1",
      [projectId]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found.",
      });
    }

    // Update the project in the database
    await db.query(
      `UPDATE project 
       SET cover_img = $1,
           title = $2,
           subtitle = $3,
           short_description = $4,
           long_description = $5,
           team_members = $6,
           product_img = $7,
           status = $8,
           admin_id = $9
       WHERE id = $10`,
      [
        cover_img,
        title,
        subtitle,
        short_description,
        long_description,
        JSON.stringify(team_members), // Convert the array of objects to JSON
        product_img,
        status,
        admin_id,
        projectId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// ... (Other functions remain unchanged)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await db.query(
      "SELECT id, title, team_members FROM projects"
    );

    // Parse the JSONB array in each project
    const projectsWithParsedTeamMembers = projects.rows.map((project) => ({
      id: project.id,
      title: project.title,
      team_members: JSON.parse(project.team_members),
    }));

    return res
      .status(200)
      .json({ success: true, projects: projectsWithParsedTeamMembers });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Get Project by ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.query("SELECT * FROM project WHERE id = $1", [id]);
    res.json(project.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
};

// Delete Project by ID
exports.deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM project WHERE id = $1", [id]);
    res.json("Deleted Successfully !!");
  } catch (err) {
    console.log(err.message);
  }
};
