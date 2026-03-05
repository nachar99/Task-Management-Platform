const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [/^\S+@\S+\.\S+$/, "please enter a valid email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
