const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

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

const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    // validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    // validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long and be a string",
      });
    }
    // validate username is between 3 & 30 characters
    if (!isValidUsername(name)) {
      return res.status(400).json({
        error: "name has to be between 3 & 30 characters in length",
      });
    }

    const correctEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: correctEmail });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      name,
      email: correctEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
      message: "Registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Registration failed",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "email or password are missing",
      });
    }
    // validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const correctEmail = email.trim().toLowerCase();

    const targetUser = await User.findOne({ email: correctEmail }).select(
      "+password",
    );
    if (!targetUser) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const validatePassword = await bcrypt.compare(
      password,
      targetUser.password,
    );
    if (!validatePassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: targetUser._id,
        role: targetUser.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
      token,
      message: `Hi ${targetUser.name}! login successful`,
    });
  } catch (error) {
    res.status(500).json({
      error: "login failed",
    });
  }
}

async function getUser(req, res) {
  try {
    const userId = req.user.id;
    const targetedUser = await User.findById(userId);
    if (!targetedUser) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    res.json({
      message: "this is your info",
      user: {
        _id: targetedUser._id,
        name: targetedUser.name,
        email: targetedUser.email,
        role: targetedUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "failed to get user",
    });
  }
}

module.exports = { register, login, getUser };
