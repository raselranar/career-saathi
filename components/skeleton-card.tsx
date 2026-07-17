export function SkeletonCard() {
  return (
    <div className="flex h-[280px] animate-pulse flex-col justify-between rounded-xl border border-paper-100 bg-paper-0 p-6">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-paper-100" />
          <div className="h-4 w-24 rounded bg-paper-100" />
        </div>
        <div className="mb-2 h-6 w-3/4 rounded bg-paper-100" />
        <div className="mb-3 h-5 w-1/2 rounded bg-paper-100" />
        <div className="h-4 w-1/3 rounded bg-paper-100" />
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="h-6 w-28 rounded-full bg-paper-100" />
        <div className="h-4 w-20 rounded bg-paper-100" />
      </div>
    </div>
  );
}
