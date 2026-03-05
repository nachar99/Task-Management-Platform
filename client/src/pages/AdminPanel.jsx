import { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [projectIdToDelete, setProjectIdToDelete] = useState("");
  const [taskIdToDelete, setTaskIdToDelete] = useState("");

  async function fetchUsers() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/admin/users");
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleEditChange(e) {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUpdateUser(userId) {
    try {
      const response = await api.patch(`/api/admin/users/${userId}`, editData);

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, ...editData } : u)),
      );

      setEditingUserId(null);
      setEditData({ name: "", email: "", password: "", role: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user");
    }
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user");
    }
  }

  async function handleDeleteProject() {
    if (!projectIdToDelete) return;

    try {
      await api.delete(`/api/admin/projects/${projectIdToDelete}`);
      setProjectIdToDelete("");
      alert("Project deleted");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete project");
    }
  }

  async function handleDeleteTask() {
    if (!taskIdToDelete) return;

    try {
      await api.delete(`/api/admin/tasks/${taskIdToDelete}`);
      setTaskIdToDelete("");
      alert("Task deleted");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete task");
    }
  }

  if (loading) return <LoadingSpinner message="Loading users..." />;

  return (
    <div className="min-h-[80vh] px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">
        Admin Panel
      </h1>

      {error && <p className="mb-6 text-red-500 text-sm">{error}</p>}
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
        Manage Users
      </h2>

      <div className="space-y-6 mb-12">
        {users.map((user) => {
          const isEditing = editingUserId === user._id;

          return (
            <div
              key={user._id}
              className="bg-[var(--card-bg)] border border-[var(--border)] 
              rounded-xl p-6 shadow-sm"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    placeholder="Name"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] 
                    bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  />
                  <input
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    placeholder="Email"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] 
                    bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  />
                  <input
                    name="password"
                    value={editData.password}
                    onChange={handleEditChange}
                    placeholder="New Password"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] 
                    bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  />
                  <select
                    name="role"
                    value={editData.role}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] 
                    bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateUser(user._id)}
                      className="px-4 py-2 rounded-lg 
                      bg-[var(--primary)] text-white 
                      hover:bg-[var(--primary-hover)] transition"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingUserId(null)}
                      className="px-4 py-2 rounded-lg 
                      border border-[var(--border)] 
                      hover:bg-[var(--card-elevated)] transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <p className="text-[var(--text-primary)]">
                    <strong>{user.name}</strong>{" "}
                    <span className="text-[var(--text-secondary)]">
                      ({user.email})
                    </span>{" "}
                    —{" "}
                    <span
                      className={
                        user.role === "admin"
                          ? "text-red-500 font-medium"
                          : "text-green-600"
                      }
                    >
                      {user.role}
                    </span>
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingUserId(user._id);
                        setEditData({
                          name: user.name,
                          email: user.email,
                          password: "",
                          role: user.role,
                        });
                      }}
                      className="px-3 py-1 rounded-lg border border-[var(--border)] 
                      hover:bg-[var(--card-elevated)] transition text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1 rounded-lg 
                      text-red-500 border border-red-300 
                      hover:bg-red-50 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="mb-10 bg-[var(--card-bg)] border border-[var(--border)] 
      rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Delete Project
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={projectIdToDelete}
            onChange={(e) => setProjectIdToDelete(e.target.value)}
            placeholder="Project ID"
            className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] 
            bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
          <button
            onClick={handleDeleteProject}
            className="px-4 py-2 rounded-lg 
            text-red-500 border border-red-300 
            hover:bg-red-50 transition"
          >
            Delete Project
          </button>
        </div>
      </div>

      <div
        className="bg-[var(--card-bg)] border border-[var(--border)] 
      rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Delete Task
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={taskIdToDelete}
            onChange={(e) => setTaskIdToDelete(e.target.value)}
            placeholder="Task ID"
            className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] 
            bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          />
          <button
            onClick={handleDeleteTask}
            className="px-4 py-2 rounded-lg 
            text-red-500 border border-red-300 
            hover:bg-red-50 transition"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
