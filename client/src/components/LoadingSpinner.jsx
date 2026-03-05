export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-12 h-12 border-4 border-[var(--border)] 
      border-t-[var(--primary)] 
      rounded-full 
      animate-spin"
      ></div>

      <h1 className="mt-6 text-lg sm:text-xl font-medium text-[var(--text-primary)]">
        {message}
      </h1>
    </div>
  );
}
