import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <HugeiconsIcon
        icon={AlertCircleIcon}
        size={64}
        className="mb-6 text-paper-300"
      />
      <h1 className="text-4xl font-semibold text-paper-900 tracking-tight font-display">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base text-paper-500 font-sans leading-relaxed">
        The page you are looking for does not exist or has been moved. Check the
        URL or head back to a known route.
      </p>
      <div className="mt-8 flex gap-3">
        <Button
          asChild
          className="h-11 rounded-lg bg-ink-700 px-6 text-sm font-semibold text-paper-0 hover:bg-ink-500">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-lg px-6 text-sm font-semibold text-paper-700 hover:bg-paper-50">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    </div>
  );
}
