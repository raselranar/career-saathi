import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { TrackButton } from "@/components/track-button";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  salaryRange?: string;
  employmentType: string;
  category: string;
  isTracked?: boolean;
  onTrackChange?: (jobId: string, tracked: boolean) => void;
}

export function JobCard({
  id,
  title,
  company,
  companyLogoUrl,
  location,
  salaryRange,
  employmentType,
  isTracked = false,
  onTrackChange,
}: JobCardProps) {
  // Generate initial-letter avatar if no logo
  const initial = company.charAt(0).toUpperCase();

  return (
    <div className="group flex h-70 flex-col justify-between rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md">
      {/* Top section */}
      <div>
        {/* Logo + Company */}
        <div className="mb-4 flex items-center gap-3">
          {companyLogoUrl ? (
            <Image
              width={300}
              height={300}
              src={companyLogoUrl}
              alt={`${company} logo`}
              className="h-10 w-10 rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-700 text-sm font-semibold text-paper-0">
              {initial}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-paper-500">{company}</p>
          </div>
          {/* Employment type badge */}
          <span className="shrink-0 rounded-full bg-ink-50 px-2.5 py-0.5 font-mono text-xs font-medium tracking-wide text-ink-500">
            {employmentType}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold leading-snug text-paper-900 line-clamp-2">
          {title}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-sm text-paper-500">
          <HugeiconsIcon icon={Location01Icon} size={16} className="shrink-0" />
          {location}
        </p>
      </div>

      {/* Bottom section */}
      <div className="flex items-center justify-between gap-2 pt-4">
        {/* Salary chip */}
        {salaryRange ? (
          <span className="max-w-[50%] truncate rounded-full bg-brass-50 px-3 py-1 font-mono text-xs font-medium text-brass-700">
            {salaryRange}
          </span>
        ) : null}
        <div className="flex items-center gap-3 shrink-0">
          {onTrackChange && (
            <TrackButton
              jobId={id}
              isTracked={isTracked}
              onTrackChange={onTrackChange}
              variant="outline"
              className="h-8 rounded-lg px-3 text-xs font-semibold"
            />
          )}
          <Link
            href={`/jobs/${id}`}
            className="shrink-0 text-sm font-medium text-ink-700 underline-offset-4 transition-all hover:underline">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
