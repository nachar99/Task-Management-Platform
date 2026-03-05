import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const { user } = useAuth();

  const navigate = useNavigate();
  function goBack() {
    navigate(-1);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div
        className="w-full max-w-lg text-center 
      bg-[var(--card-bg)] 
      border border-[var(--border)] 
      rounded-xl 
      shadow-lg 
      p-8 sm:p-10"
      >
        <div className="text-5xl mb-4">🚫</div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Access Denied
        </h1>

        <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)]">
          You don't have permission to access this page.
        </p>

        {user && (
          <div className="mt-6 space-y-2 text-sm sm:text-base text-[var(--text-secondary)]">
            <p>
              Your current role:{" "}
              <span className="font-semibold text-[var(--primary)]">
                {user.role}
              </span>
            </p>
            <p>
              This page requires:{" "}
              <span className="font-semibold text-red-500">admin</span> role
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-5 py-2 rounded-lg 
            bg-[var(--primary)] 
            text-white 
            hover:bg-[var(--primary-hover)] 
            transition duration-200 shadow-md"
          >
            Go Home
          </Link>

          <Link
            to="/dashboard"
            className="px-5 py-2 rounded-lg 
            border border-[var(--border)] 
            text-[var(--text-primary)] 
            hover:bg-[var(--card-elevated)] 
            transition duration-200"
          >
            Go to Dashboard
          </Link>

          <button
            onClick={goBack}
            className="px-5 py-2 rounded-lg 
            border border-[var(--border)] 
            text-[var(--text-primary)] 
            hover:bg-[var(--card-elevated)] 
            transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
