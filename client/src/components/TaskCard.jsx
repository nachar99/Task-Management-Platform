import { useState } from "react";
import api from "../api/axios";

export default function TaskCard({
  task,
  isOwner,
  onTaskUpdated,
  onTaskDeleted,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    assignedTo: task.assignedTo?.email || "",
  });
  function handleEditChange(e) {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  }
  async function handleFullUpdate() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/api/tasks/${task._id}`, editData);
      onTaskUpdated(response.data.task);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update task");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus) {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/api/tasks/${task._id}`, {
        status: newStatus,
      });

      onTaskUpdated(response.data.task);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update task");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/api/tasks/${task._id}`);
      onTaskDeleted(task._id);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete task");
    } finally {
      setLoading(false);
    }
  }

  async function handlePriorityChange(newPriority) {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/api/tasks/${task._id}`, {
        priority: newPriority,
      });

      onTaskUpdated(response.data.task);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update task");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      className="bg-[var(--bg-secondary)] 
    border border-[var(--border)] 
    rounded-lg p-4 shadow-sm 
    hover:shadow-md transition space-y-3"
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] 
            bg-[var(--card-bg)] text-[var(--text-primary)] 
            focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          <textarea
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] 
            bg-[var(--card-bg)] text-[var(--text-primary)] 
            focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          <input
            name="assignedTo"
            value={editData.assignedTo}
            onChange={handleEditChange}
            placeholder="Assign user email"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] 
            bg-[var(--card-bg)] text-[var(--text-primary)]"
          />

          <div className="flex gap-3">
            <button
              onClick={handleFullUpdate}
              className="px-4 py-1 rounded-lg bg-[var(--primary)] 
              text-white hover:bg-[var(--primary-hover)] transition"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1 rounded-lg border border-[var(--border)] 
              hover:bg-[var(--card-elevated)] transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">
            {task.title}
          </h4>

          <p className="text-sm text-[var(--text-secondary)]">
            {task.description}
          </p>

          {task.assignedTo && (
            <p className="text-xs text-[var(--text-muted)]">
              <strong>Assigned to:</strong> {task.assignedTo.email}
            </p>
          )}

          <button
            onClick={() => {
              setEditData({
                title: task.title,
                description: task.description,
                assignedTo: task.assignedTo?.email || "",
              });
              setIsEditing(true);
            }}
            className="text-sm px-3 py-1 rounded-lg 
            border border-[var(--border)] 
            hover:bg-[var(--card-elevated)] transition"
          >
            Edit
          </button>
        </>
      )}

      <div className="text-xs space-y-1 text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
        <div>
          <strong>Priority:</strong>{" "}
          <span
            className={
              task.priority === "high"
                ? "text-red-500"
                : task.priority === "medium"
                  ? "text-yellow-500"
                  : "text-green-500"
            }
          >
            {task.priority}
          </span>
        </div>

        {task.dueDate && (
          <div>
            <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}

        {task.assignedTo && (
          <div>
            <strong>Assigned to:</strong> {task.assignedTo.name}
          </div>
        )}
      </div>

      {isOwner && (
        <div className="space-y-3 pt-3 border-t border-[var(--border)]">
          <div>
            <select
              value={task.status}
              disabled={loading}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-1 rounded-lg border border-[var(--border)] 
              bg-[var(--card-bg)] text-[var(--text-primary)]"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] mr-2">
              Priority:
            </label>
            <select
              value={task.priority}
              disabled={loading}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="px-3 py-1 rounded-lg border border-[var(--border)] 
              bg-[var(--card-bg)] text-[var(--text-primary)]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-1 rounded-lg text-red-500 
              border border-red-300 
              hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
