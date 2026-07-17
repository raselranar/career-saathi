"use client";

import { ApplicationStatus } from "@/lib/types";

interface InkStrokeProgressProps {
  status: ApplicationStatus;
}

const STAGES: { key: ApplicationStatus; label: string }[] = [
  { key: "saved", label: "Saved" },
  { key: "applied", label: "Applied" },
  { key: "interviewing", label: "Interview" },
  { key: "offer", label: "Offer" },
];

export function InkStrokeProgress({ status }: InkStrokeProgressProps) {
  // If the status is rejected, we don't show the standard progression line,
  // or we show it greyed out. Let's handle rejected separately.
  const isRejected = status === "rejected";
  const currentIndex = STAGES.findIndex((stage) => stage.key === status);

  return (
    <div className="relative flex w-full max-w-md items-center justify-between py-2">
      {/* Background/Connecting Line (hand-drawn ink stroke look using SVG) */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-2 z-0">
        <svg
          className="h-2 w-full overflow-visible"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Subtle grey background path */}
          <path
            d="M 2 5 Q 25 3, 50 6 T 98 5"
            stroke="var(--color-paper-300)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Active colored path, only if not rejected and past first step */}
          {!isRejected && currentIndex > 0 && (
            <path
              d="M 2 5 Q 25 3, 50 6 T 98 5"
              stroke="var(--color-ink-700)"
              strokeWidth="2.5"
              strokeLinecap="round"
              // Progress width depends on index (0 to 3)
              strokeDasharray="100"
              strokeDashoffset={100 - (currentIndex / (STAGES.length - 1)) * 100}
              className="transition-all duration-700 ease-in-out"
            />
          )}
        </svg>
      </div>

      {/* Stage Dots */}
      {STAGES.map((stage, idx) => {
        const isCompleted = !isRejected && idx <= currentIndex;
        const isCurrent = !isRejected && idx === currentIndex;

        return (
          <div
            key={stage.key}
            className="relative flex flex-col items-center z-10"
          >
            {/* The Dot */}
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${
                isCurrent
                  ? "border-coral-500 bg-coral-500 text-paper-0 scale-110 shadow-sm"
                  : isCompleted
                  ? "border-ink-700 bg-ink-700 text-paper-0"
                  : "border-paper-300 bg-paper-0 text-paper-500"
              }`}
            >
              {isCompleted && !isCurrent ? (
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <span className="text-[10px] font-mono font-semibold">{idx + 1}</span>
              )}
            </div>

            {/* Label */}
            <span
              className={`absolute top-7 shrink-0 font-mono text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 ${
                isCurrent
                  ? "text-coral-500 font-semibold"
                  : isCompleted
                  ? "text-ink-700"
                  : "text-paper-500"
              }`}
            >
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
