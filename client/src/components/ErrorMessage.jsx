export default function ErrorMessage({ error, onRetry = null }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div
        className="w-full max-w-md text-center 
      bg-[var(--card-bg)] 
      border border-[var(--border)] 
      rounded-xl 
      shadow-lg 
      p-8"
      >
        <div className="text-4xl mb-4 text-red-500">⚠</div>

        <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
          Something went wrong
        </h3>

        <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] break-words">
          {error}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 px-5 py-2 rounded-lg 
            bg-[var(--primary)] 
            text-white 
            hover:bg-[var(--primary-hover)] 
            transition duration-200 
            shadow-md"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
