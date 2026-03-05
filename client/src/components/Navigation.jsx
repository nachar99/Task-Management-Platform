import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";
import { GoSun } from "react-icons/go";
import { FaMoon } from "react-icons/fa";

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav
      className="w-full fixed top-0 left-0 z-50 
  flex flex-wrap items-center justify-center sm:justify-between 
  gap-4 px-4 sm:px-8 py-4 
  bg-[var(--bg-secondary)] border-b border-[var(--border)] 
  backdrop-blur-md text-sm md:text-lg"
    >
      <Link to="/">Home</Link>

      {isAuthenticated ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>

          {user?.role === "admin" && <Link to="/admin">Admin Panel</Link>}
          <div className="flex flex-wrap gap-2 text-sm text-[var(--text-secondary)]">
            <p>name: {user.name},</p>
            <p>role: {user.role}</p>
          </div>

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
      <button
        onClick={() => {
          toggleTheme();
        }}
      >
        {theme === "light" ? <FaMoon /> : <GoSun />}
      </button>
    </nav>
  );
}
