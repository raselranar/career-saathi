// use shadcn skeleton component for skeleton loading of cards.

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex h-70 animate-pulse flex-col justify-between rounded-xl border border-paper-100 bg-paper-0 p-6">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg bg-paper-100" />
          <Skeleton className="h-4 w-24 rounded bg-paper-100" />
        </div>
        <Skeleton className="mb-2 h-6 w-3/4 rounded bg-paper-100" />
        <Skeleton className="mb-3 h-5 w-1/2 rounded bg-paper-100" />
        <Skeleton className="h-4 w-1/3 rounded bg-paper-100" />
      </div>
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-6 w-28 rounded-full bg-paper-100" />
        <Skeleton className="h-4 w-20 rounded bg-paper-100" />
      </div>
    </div>
  );
}
