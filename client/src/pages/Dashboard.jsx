import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, authLoading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    members: [],
  });

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
  });

  function handleEditChange(e) {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "members") {
      setNewProject({
        ...newProject,
        members: value.split(",").map((id) => id.trim()),
      });
    } else {
      setNewProject({
        ...newProject,
        [name]: value,
      });
    }
  }

  async function handleUpdateProject(projectId) {
    setError(null);

    try {
      const response = await api.patch(`/api/projects/${projectId}`, editData);

      const updatedProject = response.data.project;

      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? updatedProject : p)),
      );

      setEditingProjectId(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update project");
    }
  }

  async function fetchList() {
    setFetchError(null);
    setLoading(true);

    try {
      const response = await api.get("/api/projects");
      setProjects(response?.data?.projects);
    } catch (error) {
      setFetchError(error.response?.data?.error || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function handleCreateProject(e) {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/api/projects", newProject);

      setNewProject({
        title: "",
        description: "",
        members: [],
      });

      setProjects((prev) => [response.data.project, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project");
    }
  }

  async function handleDeleteProject(projectId) {
    setError(null);

    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/api/projects/${projectId}`);

      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete project");
    }
  }

  if (loading) {
    return <LoadingSpinner message="loading..." />;
  }
  if (authLoading) {
    return <p>Loading...</p>;
  }

  if (fetchError) {
    return <ErrorMessage error={fetchError} onRetry={fetchList} />;
  }

  return (
    <div className="min-h-[80vh] px-6 py-12 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Projects Dashboard
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Welcome,{" "}
          <span className="text-[var(--primary)] font-semibold">
            {user?.name}
          </span>
          !
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {projects.length === 0 && (
        <div
          className="mb-8 p-6 text-center 
        bg-[var(--card-bg)] 
        border border-[var(--border)] 
        rounded-xl shadow-sm"
        >
          <p className="text-[var(--text-secondary)]">
            No projects available yet. Check back later!
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const ownerId = project.owner?._id || project.owner;
          const isOwner = ownerId?.toString() === user?._id?.toString();
          const isEditing = editingProjectId === project._id;

          return (
            <div
              key={project._id}
              className="bg-[var(--card-bg)] 
              border border-[var(--border)] 
              rounded-xl p-6 
              shadow-sm 
              hover:shadow-md 
              transition"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 rounded-lg 
                    border border-[var(--border)] 
                    bg-[var(--bg-secondary)] 
                    text-[var(--text-primary)] 
                    focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />

                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 rounded-lg 
                    border border-[var(--border)] 
                    bg-[var(--bg-secondary)] 
                    text-[var(--text-primary)] 
                    focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateProject(project._id)}
                      className="px-4 py-2 rounded-lg 
                      bg-[var(--primary)] 
                      text-white 
                      hover:bg-[var(--primary-hover)] transition"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingProjectId(null)}
                      className="px-4 py-2 rounded-lg 
                      border border-[var(--border)] 
                      hover:bg-[var(--card-elevated)] transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {project.title}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
                    {project.description}
                  </p>

                  <p className="text-xs text-[var(--text-muted)]">
                    <strong>Created by:</strong> {project.owner?.name}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2 justify-center px-2">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-sm px-3 py-1 rounded-lg 
                      bg-[var(--primary)] 
                      text-white 
                      hover:bg-[var(--primary-hover)] transition"
                    >
                      Open
                    </Link>

                    {isOwner && (
                      <>
                        <button
                          onClick={() => {
                            setEditingProjectId(project._id);
                            setEditData({
                              title: project.title,
                              description: project.description,
                            });
                          }}
                          className="text-sm px-3 py-1 rounded-lg 
                          border border-[var(--border)] 
                          hover:bg-[var(--card-elevated)] transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="text-sm px-3 py-1 rounded-lg 
                          text-red-500 border border-red-300 
                          hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-14">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">
          Create a new project
        </h3>

        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="mt-4 px-5 py-2 rounded-lg 
          bg-[var(--primary)] 
          text-white 
          hover:bg-[var(--primary-hover)] transition"
        >
          {showCreateForm ? "Cancel" : "Create Project"}
        </button>

        {showCreateForm && (
          <form
            onSubmit={handleCreateProject}
            className="mt-6 space-y-4 max-w-xl"
          >
            <input
              name="title"
              placeholder="Title"
              value={newProject.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg 
              border border-[var(--border)] 
              bg-[var(--bg-secondary)] 
              text-[var(--text-primary)] 
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={newProject.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg 
              border border-[var(--border)] 
              bg-[var(--bg-secondary)] 
              text-[var(--text-primary)] 
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />

            <input
              name="members"
              placeholder="Assign members ID (comma separated)"
              value={newProject.members.join(", ")}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg 
              border border-[var(--border)] 
              bg-[var(--bg-secondary)] 
              text-[var(--text-primary)] 
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />

            <button
              type="submit"
              className="px-5 py-2 rounded-lg 
              bg-[var(--primary)] 
              text-white 
              hover:bg-[var(--primary-hover)] transition"
            >
              Create Project
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
