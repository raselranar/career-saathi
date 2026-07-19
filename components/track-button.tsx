"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookmarkAdd01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

interface TrackButtonProps {
  jobId: string;
  isTracked: boolean;
  onTrackChange: (jobId: string, tracked: boolean) => void;
  variant?: "default" | "outline";
  className?: string;
}

export function TrackButton({
  jobId,
  isTracked,
  onTrackChange,
  variant = "outline",
  className,
}: TrackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  async function handleTrack() {
    if (isTracked) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      if (res.status === 400) {
        const data = await res.json();
        if (data.error?.includes("already tracking")) {
          onTrackChange(jobId, true);
          toast.success("Job is already tracked");
          return;
        }
        toast.error(data.error || "Failed to track job");
        return;
      }

      if (!res.ok) {
        toast.error("Failed to track job");
        return;
      }

      onTrackChange(jobId, true);
      toast.success("Job tracked!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant={isTracked ? "default" : variant}
      disabled={isLoading || isTracked}
      onClick={handleTrack}
      className={className}>
      {isLoading ? (
        <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin" />
      ) : (
        <HugeiconsIcon icon={BookmarkAdd01Icon} size={16} />
      )}
      {isTracked ? "Tracked" : "Track"}
    </Button>
  );
}
