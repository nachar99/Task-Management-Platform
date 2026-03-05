const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");

//   - GET /api/projects (get user’s projects)
async function getProjects(req, res) {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate("owner", "_id name email")
      .populate("members", "_id name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "Projects:",
      projects: projects,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get projects",
    });
  }
}

//   - POST /api/projects (create project)
async function createProject(req, res) {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    if (!description || !title) {
      return res.status(400).json({
        error: "Title and Description are required",
      });
    }

    const newProject = await Project.create({
      title: title.trim(),
      description: description.trim(),
      owner: userId,
      members: [userId],
    });
    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create project",
    });
  }
}

//   - PATCH /api/projects/:id (update project)
async function updateProject(req, res) {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const { title, description, members } = req.body;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        error: "Invalid project ID",
      });
    }
    const targetProject = await Project.findById(projectId);
    if (!targetProject) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    if (targetProject.owner.toString() !== userId) {
      return res.status(403).json({
        error: "Only the project owner can update this project",
      });
    }

    if (title) {
      targetProject.title = title.trim();
    }

    // Update description if provided
    if (description) {
      targetProject.description = description.trim();
    }

    // Update members if provided
    if (members && Array.isArray(members)) {
      const validMemberIds = members.filter((memberId) =>
        mongoose.Types.ObjectId.isValid(memberId),
      );

      const existingUsers = await User.find({
        _id: { $in: validMemberIds },
      }).select("_id");

      const existingUserIds = existingUsers.map((user) => user._id.toString());

      // Always include owner
      targetProject.members = Array.from(new Set([...existingUserIds, userId]));
    }

    await targetProject.save();

    res.json({
      message: "Project updated successfully",
      project: targetProject,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update project",
    });
  }
}

//   - DELETE /api/projects/:id (delete project)
async function deleteProject(req, res) {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        error: "Invalid project ID",
      });
    }

    const targetProject = await Project.findOne({ _id: projectId });
    if (!targetProject) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    if (targetProject.owner.toString() !== userId) {
      return res.status(403).json({
        error: "Only the project owner can delete this project",
      });
    }

    await Task.deleteMany({ project: projectId });
    await targetProject.deleteOne();
    res.json({
      message: "Project and related tasks deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete project",
    });
  }
}
module.exports = { getProjects, createProject, updateProject, deleteProject };
