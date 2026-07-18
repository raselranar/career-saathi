export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-700 border-t-transparent" />
        <p className="text-sm font-medium text-paper-500 font-mono">
          Loading…
        </p>
      </div>
    </div>
  );
}
