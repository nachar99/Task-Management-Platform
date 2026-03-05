const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6;
}
function isValidUsername(username) {
  return (
    typeof username === "string" &&
    username.length >= 3 &&
    username.length <= 30
  );
}

// - GET /api/admin/users - Get all users (admin only, validate JWT and role)
async function getUsers(req, res) {
  try {
    const allUsers = await User.find().sort({ createdAt: -1 });
    res.json({
      message: "users:",
      users: allUsers,
    });
  } catch (error) {
    return res.status(500).json({
      error: "failed to get users",
    });
  }
}

// - PATCH /api/admin/users/:id - Edit user (admin only, validate JWT and role)
async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (name && isValidUsername(name)) {
      targetUser.name = name.trim();
    }

    if (email && isValidEmail(email)) {
      targetUser.email = email.trim().toLowerCase();
    }

    if (password && isValidPassword(password)) {
      const SALT_ROUNDS = 10;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      targetUser.password = hashedPassword;
    }

    if (role) {
      targetUser.role = role;
    }

    await targetUser.save();
    res.json({
      message: "User updated successfully",
      user: {
        name: targetUser.name,
        role: targetUser.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error: "failed to update user",
    });
  }
}

// - DELETE /api/admin/users/:id - Delete single user (admin only, validate JWT and role)
async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }
    if (req.user.id === userId) {
      return res.status(400).json({
        error: "Admin cannot delete themselves",
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await Project.deleteMany({ owner: userId });
    await Task.deleteMany({ createdBy: userId });
    await User.findByIdAndDelete(userId);

    res.json({
      message: "User, and any Projects and related tasks deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "failed to delete user",
    });
  }
}

// - DELETE /api/admin/projects/:id - Delete any project (admin only, validate JWT and role)
async function deleteProject(req, res) {
  try {
    const projectId = req.params.id;
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

// - DELETE /api/admin/tasks/:id - Delete any task (admin only, validate JWT and role)
async function deleteTask(req, res) {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        error: "Invalid task ID",
      });
    }

    const targetTask = await Task.findById(taskId);
    if (!targetTask) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    await targetTask.deleteOne();
    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete task",
    });
  }
}

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  deleteProject,
  deleteTask,
};
