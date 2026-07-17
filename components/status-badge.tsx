import { ApplicationStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Styles based on status color mapping from SKILL.md §2
  const styles: Record<ApplicationStatus, { bg: string; text: string; label: string }> = {
    saved: {
      bg: "bg-paper-300/15",
      text: "text-paper-500",
      label: "Saved",
    },
    applied: {
      bg: "bg-ink-300/15",
      text: "text-ink-500",
      label: "Applied",
    },
    interviewing: {
      bg: "bg-coral-500/15",
      text: "text-coral-500",
      label: "Interviewing",
    },
    offer: {
      bg: "bg-ink-700/15",
      text: "text-ink-700",
      label: "Offer",
    },
    rejected: {
      bg: "bg-paper-500/15",
      text: "text-paper-500", // Deliberately neutral, not red per SKILL.md §2
      label: "Rejected",
    },
  };

  const { bg, text, label } = styles[status] || styles.saved;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider ${bg} ${text}`}
    >
      {label}
    </span>
  );
}
