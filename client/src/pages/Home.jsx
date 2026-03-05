import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-[80vh] px-6 py-12 sm:px-10 lg:px-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)]">
          Task Management Platform
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[var(--text-secondary)]">
          Organize your projects. Track your tasks. Stay productive.
        </p>

        <div className="mt-12 text-left sm:text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
            What You Can Do
          </h2>

          <ul className="mt-6 space-y-3 text-[var(--text-secondary)]">
            <li>• Create and manage multiple projects</li>
            <li>• Add tasks with priority and due dates</li>
            <li>• Track task progress (Todo, In Progress, Done)</li>
            <li>• Assign tasks to team members</li>
            <li>• Filter and sort tasks easily</li>
          </ul>
        </div>

        <div className="mt-14">
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg text-[var(--text-primary)]">
                Welcome back,{" "}
                <span className="font-semibold text-[var(--primary)]">
                  {user?.name}
                </span>
                .
              </p>

              <Link to="/dashboard">
                <button className="mt-4 px-6 py-3 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition duration-200 shadow-md">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-[var(--text-primary)]">
                Get started by creating an account.
              </p>

              <Link to="/register">
                <button className="px-6 py-3 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition duration-200 shadow-md">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
