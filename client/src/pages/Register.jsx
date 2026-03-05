import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("passwords do not match");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("password too short , password must have minimum 6 characters");
      setLoading(false);
      return;
    }

    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div
        className="w-full max-w-md 
      bg-[var(--card-bg)] 
      border border-[var(--border)] 
      rounded-xl 
      shadow-lg 
      p-8 sm:p-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)]">
          Register
        </h1>

        {error && (
          <h2 className="mt-4 text-sm text-red-500 text-center">{error}</h2>
        )}

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="mb-1 text-sm text-[var(--text-secondary)]"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="name"
                className="px-4 py-2 rounded-lg 
                border border-[var(--border)] 
                bg-[var(--bg-secondary)] 
                text-[var(--text-primary)] 
                focus:outline-none 
                focus:ring-2 
                focus:ring-[var(--primary)] 
                transition"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1 text-sm text-[var(--text-secondary)]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="email"
                className="px-4 py-2 rounded-lg 
                border border-[var(--border)] 
                bg-[var(--bg-secondary)] 
                text-[var(--text-primary)] 
                focus:outline-none 
                focus:ring-2 
                focus:ring-[var(--primary)] 
                transition"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 text-sm text-[var(--text-secondary)]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="new-password"
                className="px-4 py-2 rounded-lg 
                border border-[var(--border)] 
                bg-[var(--bg-secondary)] 
                text-[var(--text-primary)] 
                focus:outline-none 
                focus:ring-2 
                focus:ring-[var(--primary)] 
                transition"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="confirmPassword"
                className="mb-1 text-sm text-[var(--text-secondary)]"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="px-4 py-2 rounded-lg 
                border border-[var(--border)] 
                bg-[var(--bg-secondary)] 
                text-[var(--text-primary)] 
                focus:outline-none 
                focus:ring-2 
                focus:ring-[var(--primary)] 
                transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-4 py-3 rounded-lg 
              bg-[var(--primary)] 
              text-white 
              font-medium 
              hover:bg-[var(--primary-hover)] 
              transition duration-200 
              shadow-md 
              disabled:opacity-60 
              disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-sm text-center text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--primary)] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
