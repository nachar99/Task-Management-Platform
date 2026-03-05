import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div
        className="w-full max-w-2xl 
      bg-[var(--card-bg)] 
      border border-[var(--border)] 
      rounded-xl 
      shadow-lg 
      p-8 sm:p-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[var(--text-primary)]">
          User Profile
        </h1>

        <div className="mt-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-6">
            <div>
              {user ? (
                <div className="text-lg text-[var(--text-secondary)]">
                  Hi{" "}
                  <span className="font-semibold text-[var(--primary)]">
                    {user.name}
                  </span>
                  !
                </div>
              ) : (
                <div className="text-lg text-[var(--text-secondary)]">Hi!</div>
              )}
            </div>

            <div className="text-right">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {user.name}
              </h2>
              <span
                className="inline-block mt-1 px-3 py-1 text-xs rounded-full 
              bg-[var(--bg-secondary)] 
              border border-[var(--border)] 
              text-[var(--primary)]"
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
              <span className="text-[var(--text-secondary)] text-sm">
                Email
              </span>
              <span className="text-[var(--text-primary)] text-sm font-medium break-all">
                {user.email}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
              <span className="text-[var(--text-secondary)] text-sm">
                User ID
              </span>
              <span className="text-[var(--text-muted)] text-sm">
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)] text-sm">Role</span>
              <span className="text-[var(--primary)] text-sm font-medium">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default Profile;
