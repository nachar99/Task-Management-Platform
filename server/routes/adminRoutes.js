const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.get("/users", authenticateToken, requireAdmin, adminController.getUsers);
router.patch(
  "/users/:id",
  authenticateToken,
  requireAdmin,
  adminController.updateUser,
);
router.delete(
  "/users/:id",
  authenticateToken,
  requireAdmin,
  adminController.deleteUser,
);
router.delete(
  "/projects/:id",
  authenticateToken,
  requireAdmin,
  adminController.deleteProject,
);
router.delete(
  "/tasks/:id",
  authenticateToken,
  requireAdmin,
  adminController.deleteTask,
);

module.exports = router;
