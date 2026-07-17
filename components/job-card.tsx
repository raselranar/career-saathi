import Image from "next/image";
import Link from "next/link";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  salaryRange?: string;
  employmentType: string;
  category: string;
}

export function JobCard({
  id,
  title,
  company,
  companyLogoUrl,
  location,
  salaryRange,
  employmentType,
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
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          {location}
        </p>
      </div>

      {/* Bottom section */}
      <div className="flex items-center justify-between pt-4">
        {/* Salary chip */}
        {salaryRange ? (
          <span className="rounded-full bg-brass-50 px-3 py-1 font-mono text-xs font-medium text-brass-700">
            {salaryRange}
          </span>
        ) : (
          <span />
        )}

        {/* View Details */}
        <Link
          href={`/jobs/${id}`}
          className="text-sm font-medium text-ink-700 underline-offset-4 transition-all hover:underline">
          View Details →
        </Link>
      </div>
    </div>
  );
}
