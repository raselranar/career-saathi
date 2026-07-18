"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-coral-50">
        <HugeiconsIcon
          icon={AlertCircleIcon}
          size={32}
          className="text-coral-500"
        />
      </div>
      <h1 className="text-2xl font-semibold text-paper-900 tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-paper-500 font-sans leading-relaxed">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-paper-400">
          Error ID: {error.digest}
        </p>
      )}
      <Button
        onClick={reset}
        className="mt-8 h-11 rounded-lg bg-ink-700 px-6 text-sm font-semibold text-paper-0 hover:bg-ink-500">
        Try Again
      </Button>
    </div>
  );
}
