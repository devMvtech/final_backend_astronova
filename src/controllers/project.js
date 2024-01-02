const db = require("../../database.js");
const fs = require("fs");

// Create Project

// Create a new project with members

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
    member_count,
    membersData,
  } = req.body;

  try {
    // Check if the title already exists in the projects table
    const titleExists = await db.query(
      "SELECT * FROM projects WHERE title = $1",
      [title]
    );

    if (titleExists.rows.length > 0) {
      return res.status(400).json({
        error: "Project with the provided title already exists.",
      });
    }

    // Separate file upload logic from project creation
    const projectResult = await db.query(
      `INSERT INTO projects (cover_img, title, subtitle, short_description, long_description, product_img, status, admin_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        cover_img,
        title,
        subtitle,
        short_description,
        long_description,
        product_img,
        status,
        admin_id,
      ]
    );

    const projectId = projectResult.rows[0].id;

    // Create members and associate them with the project
    const createdMembers = [];
    for (let i = 0; i < member_count; i++) {
      const memberData = membersData[i] || {};
      const memberResult = await db.query(
        "INSERT INTO members (profile_img, name, position) VALUES ($1, $2, $3) RETURNING member_id",
        [memberData.profile_img, memberData.name, memberData.position]
      );

      const memberId = memberResult.rows[0].member_id;

      await db.query(
        "INSERT INTO project_members (project_id, member_id) VALUES ($1, $2)",
        [projectId, memberId]
      );

      createdMembers.push({ member_id: memberId, ...memberData });
    }

    return res.status(201).json({
      project: {
        id: projectId,
        cover_img,
        title,
        subtitle,
        short_description,
        long_description,
        product_img,
        status,
        admin_id,
      },
      members: createdMembers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  const projectId = req.params.id; // Assuming you have a route parameter for the project ID

  // Extract the fields you want to update from the request body
  const { status, admin_id } = req.body;

  try {
    // Check if the project with the given ID exists
    const existingProject = await db.query(
      "SELECT * FROM projects WHERE id = $1",
      [projectId]
    );
    // console.log(existingProject);

    if (existingProject.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found.",
      });
    }

    // Update the project in the database
    await db.query(
      `UPDATE projects 
       SET status = $1,
           admin_id = $2
       WHERE id = $3`,
      [status, admin_id, projectId]
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
      "SELECT projects.id, projects.cover_img, projects.title, projects.subtitle, projects.short_description, projects.long_description, projects.product_img, projects.status, projects.admin_id, members.member_id, members.profile_img AS member_profile_img, members.name AS member_name, members.position AS member_position FROM projects LEFT JOIN project_members ON projects.id = project_members.project_id LEFT JOIN members ON project_members.member_id = members.member_id"
    );

    // Organize the data into a structured format
    const formattedProjects = [];
    let currentProject = null;

    for (const project of projects.rows) {
      if (!currentProject || currentProject.id !== project.id) {
        // New project
        currentProject = {
          id: project.id,
          cover_img: project.cover_img,
          title: project.title,
          subtitle: project.subtitle,
          short_description: project.short_description,
          long_description: project.long_description,
          product_img: project.product_img,
          status: project.status,
          admin_id: project.admin_id,
          members: [],
        };
        formattedProjects.push(currentProject);
      }

      // Add member data to the current project
      if (project.member_id) {
        currentProject.members.push({
          member_id: project.member_id,
          profile_img: project.member_profile_img,
          name: project.member_name,
          position: project.member_position,
        });
      }
    }

    return res.status(200).json({
      success: true,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// Get Project by ID
exports.getProjectById = async (req, res) => {
  const projectId = req.params.id; // Assuming the project ID is passed as a route parameter

  try {
    const projectData = await db.query(
      "SELECT projects.id, projects.cover_img, projects.title, projects.subtitle, projects.short_description, projects.long_description, projects.product_img, projects.status, projects.admin_id, members.member_id, members.profile_img AS member_profile_img, members.name AS member_name, members.position AS member_position FROM projects LEFT JOIN project_members ON projects.id = project_members.project_id LEFT JOIN members ON project_members.member_id = members.member_id WHERE projects.id = $1",
      [projectId]
    );

    if (projectData.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    // Organize the data into a structured format
    const formattedProject = {
      id: projectData.rows[0].id,
      cover_img: projectData.rows[0].cover_img,
      title: projectData.rows[0].title,
      subtitle: projectData.rows[0].subtitle,
      short_description: projectData.rows[0].short_description,
      long_description: projectData.rows[0].long_description,
      product_img: projectData.rows[0].product_img,
      status: projectData.rows[0].status,
      admin_id: projectData.rows[0].admin_id,
      members: [],
    };

    // Add member data to the current project
    projectData.rows.forEach((project) => {
      if (project.member_id) {
        formattedProject.members.push({
          member_id: project.member_id,
          profile_img: project.member_profile_img,
          name: project.member_name,
          position: project.member_position,
        });
      }
    });

    return res.status(200).json({
      success: true,
      project: formattedProject,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: "Internal Server Error",
    });
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
