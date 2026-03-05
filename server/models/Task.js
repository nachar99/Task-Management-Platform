const mongoose = require("mongoose");

//   title: String,
//   description: String,
//   dueDate: Date,
//   priority: String, // low | medium | high
//   status: String,   // todo | in-progress | done
//   project: ObjectId, // reference to Project
//   assignedTo: ObjectId, // reference to User
//   createdBy: ObjectId,
//   createdAt: Date

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minlength: 1,
      maxlength: 250,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
