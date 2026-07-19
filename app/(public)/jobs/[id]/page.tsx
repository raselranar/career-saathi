"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { JobCard } from "@/components/job-card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Location01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { TrackButton } from "@/components/track-button";
import JobDetailsSkeleton from "./JobDetailsSkeleton";

interface Job {
  _id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  category: string;
  employmentType: string;
  salaryRange?: string;
  shortDescription: string;
  fullDescription: string;
  postedAt: string;
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    let active = true;

    // Set loading state asynchronously to avoid react-hooks/set-state-in-effect warning
    const timer = setTimeout(() => {
      if (active) setIsLoading(true);
    }, 0);

    fetch(`/api/jobs/${id}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            setError("Job posting not found");
          } else {
            setError("Failed to load job details");
          }
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && active) {
          setJob(data.job);
          setRelatedJobs(data.relatedJobs);
        }
      })
      .catch(() => {
        if (active) setError("An unexpected error occurred");
      })
      .finally(() => {
        if (active) setIsLoading(false);
        clearTimeout(timer);
      });

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [id]);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setIsTracked(data.some((app: { jobId: string }) => app.jobId === id));
        }
      })
      .catch(() => {});
  }, [id]);

  if (isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">
        <h2 className="text-2xl font-bold text-paper-900">
          {error || "Job not found"}
        </h2>
        <p className="mt-2 text-sm text-paper-500">
          The job posting you are looking for might have been closed or removed.
        </p>
        <Button
          asChild
          className="mt-6 h-11 rounded-lg bg-ink-700 px-6 text-sm font-medium text-paper-0 hover:bg-ink-500">
          <Link href="/jobs">Browse All Jobs</Link>
        </Button>
      </div>
    );
  }

  const initial = job.company.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-paper-500 hover:text-ink-700">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to Jobs
        </Link>

        {/* Main Content Layout */}
        <div className="flex flex-col gap-8 md:flex-row items-start">
          {/* Left Column: Job info & description */}
          <div className="flex-1 rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm">
            {/* Header info */}
            <div className="flex items-start gap-4">
              {job.companyLogoUrl ? (
                <Image
                  width={300}
                  height={300}
                  src={job.companyLogoUrl}
                  alt={`${job.company} logo`}
                  className="h-14 w-14 rounded-xl object-contain border border-paper-100"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink-700 text-xl font-semibold text-paper-0">
                  {initial}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-paper-900 leading-tight">
                  {job.title}
                </h1>
                <p className="text-base text-paper-500 mt-1">{job.company}</p>
              </div>
            </div>

            {/* Tags/Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-ink-50 px-3 py-1 font-mono text-xs font-medium text-ink-500">
                {job.employmentType}
              </span>
              <span className="rounded-full bg-brass-50 px-3 py-1 font-mono text-xs font-medium text-brass-700">
                {job.category}
              </span>
              {job.salaryRange && (
                <span className="rounded-full bg-coral-50 px-3 py-1 font-mono text-xs font-medium text-coral-700">
                  {job.salaryRange}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-paper-100 pt-8">
              <h2 className="text-lg font-semibold text-paper-900 mb-4">
                Job Description
              </h2>
              <div className="prose max-w-none text-paper-700 whitespace-pre-wrap font-sans text-base leading-relaxed">
                {job.fullDescription}
              </div>
            </div>
          </div>

          {/* Right Column: CTA Panel */}
          <div className="w-full md:w-80 shrink-0 space-y-4">
            <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-paper-500 uppercase tracking-wider mb-4">
                AI Career Coaching
              </h3>
              <p className="text-sm text-paper-700 mb-6">
                Use CareerSaathi&apos;s agentic tools to customize your
                application and practice for the role.
              </p>

              <div className="space-y-3">
                <TrackButton
                  jobId={job._id}
                  isTracked={isTracked}
                  onTrackChange={(_, tracked) => setIsTracked(tracked)}
                  className="h-11 w-full rounded-lg text-sm font-medium"
                />
                <Button
                  asChild
                  className="h-11 w-full rounded-lg bg-ink-700 text-sm font-medium text-paper-0 hover:bg-ink-500">
                  <Link href={`/generator?jobId=${job._id}`}>
                    Generate Cover Letter
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 w-full rounded-lg text-sm font-medium text-ink-700 border-ink-700 hover:bg-paper-50">
                  <Link href={`/coach/${job._id}`}>
                    Practice Mock Interview
                  </Link>
                </Button>
              </div>
            </div>

            {/* Location / Date info */}
            <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm text-sm text-paper-700 space-y-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={18}
                  className="text-paper-500"
                />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={18}
                  className="text-paper-500"
                />
                <span>
                  Posted on {new Date(job.postedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <div className="mt-16 border-t border-paper-100 pt-12">
            <h2 className="text-xl font-bold text-paper-900 mb-6">
              Related Positions
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedJobs.map((rJob) => (
                <JobCard
                  key={rJob._id}
                  id={rJob._id}
                  title={rJob.title}
                  company={rJob.company}
                  companyLogoUrl={rJob.companyLogoUrl}
                  location={rJob.location}
                  salaryRange={rJob.salaryRange}
                  employmentType={rJob.employmentType}
                  category={rJob.category}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
