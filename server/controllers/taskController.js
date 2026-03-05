const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

// - GET /api/tasks?projectId= - Return all tasks for a specific project
async function getTasks(req, res) {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(400).json({
        error: "Project ID is required",
      });
    }
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
    const isOwner = targetProject.owner.toString() === req.user.id;

    const isMember =
      targetProject.members &&
      targetProject.members.some(
        (memberId) => memberId.toString() === req.user.id,
      );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        error: "You are not a member of this project",
      });
    }

    const tasksList = await Task.find({ project: targetProject._id })
      .populate("project", "title")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json({
      message: "tasks :",
      tasks: tasksList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get tasks",
    });
  }
}

// - POST /api/tasks - Create new task
async function createTask(req, res) {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      project,
      assignedTo,
    } = req.body;

    if (!title || !description || !project || !assignedTo) {
      return res.status(400).json({
        error: "Title and Description, projectId, assignedTo are all required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(project)) {
      return res.status(400).json({
        error: "Invalid project ID",
      });
    }

    const targetProject = await Project.findById(project);
    if (!targetProject) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    if (targetProject.owner.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Only the project owner can create tasks",
      });
    }
    const targetUser = await User.findOne({
      email: assignedTo.trim().toLowerCase(),
    });
    if (!targetUser) {
      return res.status(404).json({
        error: "Assigned user not found",
      });
    }

    const userId = targetUser._id.toString();

    const isOwner = targetProject.owner.toString() === userId;

    const isMember = targetProject.members.some(
      (member) => member.toString() === userId,
    );

    if (!isOwner && !isMember) {
      targetProject.members.push(targetUser._id);
      await targetProject.save();
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      status: status ? status.toLowerCase().trim() : undefined,
      project,
      assignedTo: targetUser._id,
      createdBy: req.user.id,
    });
    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create task",
    });
  }
}

// - PUT /api/tasks/:id - Update task
async function updateTask(req, res) {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const { title, description, dueDate, priority, status, assignedTo } =
      req.body;

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

    const targetProject = await Project.findById(targetTask.project);

    if (!targetProject) {
      return res.status(404).json({
        error: "Associated project not found",
      });
    }

    if (targetProject.owner.toString() !== userId) {
      return res.status(403).json({
        error: "Only the project owner can update tasks",
      });
    }

    if (title) targetTask.title = title.trim();
    if (description) targetTask.description = description.trim();
    if (dueDate) targetTask.dueDate = dueDate;
    if (priority) targetTask.priority = priority;
    if (status) targetTask.status = status;

    if (assignedTo) {
      const targetUser = await User.findOne({
        email: assignedTo.trim().toLowerCase(),
      });
      if (!targetUser) {
        return res.status(404).json({
          error: "Assigned user not found",
        });
      }

      targetTask.assignedTo = targetUser._id;
    }

    await targetTask.save();

    res.json({
      message: "Task updated successfully",
      task: targetTask,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update task",
    });
  }
}

// - DELETE /api/tasks/:id
async function deleteTask(req, res) {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

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

    const targetProject = await Project.findById(targetTask.project);

    if (!targetProject) {
      return res.status(404).json({
        error: "Associated project not found",
      });
    }

    if (targetProject.owner.toString() !== userId) {
      return res.status(403).json({
        error: "Only the project owner can delete tasks",
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

module.exports = { getTasks, createTask, updateTask, deleteTask };
