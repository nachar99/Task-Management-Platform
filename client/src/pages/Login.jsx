import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.error || "login failed");
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
        {error && (
          <h1 className="mb-4 text-sm text-red-500 text-center">{error}</h1>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)]">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm text-[var(--text-secondary)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
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
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
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
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="text-sm text-center text-[var(--text-secondary)] mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[var(--primary)] hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
