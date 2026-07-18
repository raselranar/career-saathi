import { Skeleton } from "@/components/ui/skeleton";

const JobDetailsSkeleton = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <Skeleton className="h-5 w-32 rounded bg-paper-100 mb-8" />
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex-1 rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-xl bg-paper-100" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-7 w-2/3 rounded bg-paper-100" />
              <Skeleton className="h-5 w-1/3 rounded bg-paper-100" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full bg-paper-100" />
            <Skeleton className="h-6 w-24 rounded-full bg-paper-100" />
            <Skeleton className="h-6 w-28 rounded-full bg-paper-100" />
          </div>
          <div className="border-t border-paper-100 pt-8 space-y-4">
            <Skeleton className="h-5 w-40 rounded bg-paper-100" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded bg-paper-100" />
              <Skeleton className="h-4 w-full rounded bg-paper-100" />
              <Skeleton className="h-4 w-5/6 rounded bg-paper-100" />
              <Skeleton className="h-4 w-full rounded bg-paper-100" />
              <Skeleton className="h-4 w-3/4 rounded bg-paper-100" />
            </div>
          </div>
        </div>
        <div className="w-full md:w-80 shrink-0 space-y-4">
          <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm space-y-4">
            <Skeleton className="h-4 w-36 rounded bg-paper-100" />
            <Skeleton className="h-4 w-full rounded bg-paper-100" />
            <Skeleton className="h-11 w-full rounded-lg bg-paper-100" />
            <Skeleton className="h-11 w-full rounded-lg bg-paper-100" />
          </div>
          <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm space-y-3">
            <Skeleton className="h-4 w-full rounded bg-paper-100" />
            <Skeleton className="h-4 w-2/3 rounded bg-paper-100" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default JobDetailsSkeleton;
