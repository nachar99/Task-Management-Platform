import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProjectsPage() {
  const { id } = useParams();
  const { user, authLoading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "todo",
    assignedTo: "",
  });

  function handleDelete(taskId) {
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
  }

  function handleUpdate(updatedTask) {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
    );
  }

  function handleChange(e) {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCreateTask(e) {
    e.preventDefault();

    try {
      const response = await api.post("/api/tasks", {
        ...newTask,
        project: selectedProject._id,
      });

      setTasks((prev) => [response.data.task, ...prev]);

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        status: "todo",
        assignedTo: "",
      });

      setShowCreateForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task");
    }
  }


  async function fetchProjects() {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/projects");
      setProjects(response.data.projects);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTasks(projectId) {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/tasks?projectId=${projectId}`);
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    fetchProjects();
  }, [id]);

  useEffect(() => {
    if (!id || projects.length === 0) return;

    const foundProject = projects.find((project) => project._id === id);

    setSelectedProject(foundProject || null);
  }, [projects, id]);

  useEffect(() => {
    if (!selectedProject) return;
    fetchTasks(selectedProject._id);
  }, [selectedProject]);

  const isOwner =
    selectedProject?.owner?._id?.toString() === user?._id?.toString();

  const filteredTasks = tasks
    .filter((task) => {
      const statusMatch =
        statusFilter === "all" || task.status === statusFilter;

      const priorityMatch =
        priorityFilter === "all" || task.priority === priorityFilter;

      return statusMatch && priorityMatch;
    })
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;

      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const todoTasks = filteredTasks.filter((task) => task.status === "todo");

  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "in-progress",
  );

  const doneTasks = filteredTasks.filter((task) => task.status === "done");

  if (loading) return <LoadingSpinner message="Loading..." />;
  if (error) return <p>{error}</p>;
  if (!selectedProject) return <p>Project not found</p>;
  if (authLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-[80vh] px-6 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
          {selectedProject.title}
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          {selectedProject.description}
        </p>
      </div>

      <div
        className="mb-10 flex flex-col sm:flex-row flex-wrap gap-4 
      bg-[var(--card-bg)] border border-[var(--border)] 
      rounded-xl p-4 shadow-sm"
      >
        <div className="flex flex-col">
          <label className="text-sm text-[var(--text-secondary)] mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--border)] 
            bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[var(--text-secondary)] mb-1">
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--border)] 
            bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-[var(--text-secondary)] mb-1">
            Sort by Due Date
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--border)] 
            bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            <option value="asc">Earliest First</option>
            <option value="desc">Latest First</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="bg-[var(--card-bg)] border border-[var(--border)] 
        rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
            Todo
          </h3>
          {todoTasks.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">No tasks</p>
          )}
          <div className="space-y-4">
            {todoTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                user={user}
                isOwner={isOwner}
                onTaskUpdated={handleUpdate}
                onTaskDeleted={handleDelete}
              />
            ))}
          </div>
        </div>

        <div
          className="bg-[var(--card-bg)] border border-[var(--border)] 
        rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
            In Progress
          </h3>
          {inProgressTasks.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">No tasks</p>
          )}
          <div className="space-y-4">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                user={user}
                isOwner={isOwner}
                onTaskUpdated={handleUpdate}
                onTaskDeleted={handleDelete}
              />
            ))}
          </div>
        </div>

        <div
          className="bg-[var(--card-bg)] border border-[var(--border)] 
        rounded-xl p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
            Done
          </h3>
          {doneTasks.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">No tasks</p>
          )}
          <div className="space-y-4">
            {doneTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                user={user}
                isOwner={isOwner}
                onTaskUpdated={handleUpdate}
                onTaskDeleted={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="mt-12">
          <button
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="px-6 py-2 rounded-lg 
            bg-[var(--primary)] text-white 
            hover:bg-[var(--primary-hover)] transition"
          >
            {showCreateForm ? "Cancel" : "Create Task"}
          </button>

          {showCreateForm && (
            <form
              onSubmit={handleCreateTask}
              className="mt-6 grid gap-4 max-w-2xl"
            >
              <input
                name="title"
                placeholder="Title"
                value={newTask.title}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-lg border border-[var(--border)] 
                bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={newTask.description}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-lg border border-[var(--border)] 
                bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              />

              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-[var(--border)] 
                bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              />

              <select
                name="priority"
                value={newTask.priority}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-[var(--border)] 
                bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                name="status"
                value={newTask.status}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border border-[var(--border)] 
                bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <input
                name="assignedTo"
                placeholder="Assign user email"
                value={newTask.assignedTo}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-lg border border-[var(--border)] 
                bg-[var(--bg-secondary)] text-[var(--text-primary)]"
              />

              <button
                type="submit"
                className="px-5 py-2 rounded-lg 
                bg-[var(--primary)] text-white 
                hover:bg-[var(--primary-hover)] transition"
              >
                Create Task
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
