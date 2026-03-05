const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");

const connectDatabase = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));

connectDatabase();

const authLimiter = rateLimit({
  windowMs: 1000 * 60 * 60,
  max: 10,
  message: "too many request from this IP , please try again later",
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Task Management Platform API",

    authentication_endpoints: {
      register: "POST /api/auth/register",
      login: "POST /api/auth/login",
      get_current_user: "GET /api/auth/me",
    },

    project_endpoints: {
      get_my_projects: "GET /api/projects (protected)",
      create_project: "POST /api/projects (protected)",
      update_project: "PUT /api/projects/:id (protected, owner only)",
      delete_project: "DELETE /api/projects/:id (protected, owner only)",
    },

    task_endpoints: {
      get_tasks_by_project: "GET /api/tasks?projectId= (protected)",
      create_task: "POST /api/tasks (protected)",
      update_task: "PUT /api/tasks/:id (protected, owner only)",
      delete_task: "DELETE /api/tasks/:id (protected, owner only)",
    },

    admin_endpoints: {
      get_all_users: "GET /api/admin/users (admin only)",
      edit_user: "PATCH /api/admin/users/:id (admin only)",
      delete_user: "DELETE /api/admin/users/:id (admin only)",
      delete_project: "DELETE /api/admin/projects/:id (admin only)",
      delete_task: "DELETE /api/admin/tasks/:id (admin only)",
    },
    note: "All protected routes require a valid JWT token in the Authorization header.",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "route doesn't exist",
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    error: "internal server error",
  });
});

app.listen(PORT, () => {
  console.log("server running on ", PORT);
});
