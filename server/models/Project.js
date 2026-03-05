const mongoose = require("mongoose");

//   title: String,
//   description: String,
//   owner: ObjectId, // reference to User
//   members: [ObjectId], // references to Users
//   createdAt: Date
const ProjectSchema = new mongoose.Schema(
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
      maxlength: 60,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
