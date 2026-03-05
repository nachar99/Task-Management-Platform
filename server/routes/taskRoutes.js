const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, taskController.getTasks);
router.post("/", authenticateToken, taskController.createTask);
router.patch("/:id", authenticateToken, taskController.updateTask);
router.delete("/:id", authenticateToken, taskController.deleteTask);

module.exports = router;
