"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { JobCard } from "@/components/job-card";

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
  const router = useRouter();
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Job posting not found");
        } else {
          setError("Failed to load job details");
        }
        return;
      }
      const data = await res.json();
      setJob(data.job);
      setRelatedJobs(data.relatedJobs);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12 animate-pulse lg:px-8">
        <div className="h-8 w-32 rounded bg-paper-100 mb-8" />
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1 space-y-4">
            <div className="h-10 w-2/3 rounded bg-paper-100" />
            <div className="h-6 w-1/3 rounded bg-paper-100" />
            <div className="h-40 rounded bg-paper-100" />
          </div>
          <div className="w-full md:w-80 h-64 rounded-xl bg-paper-100" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">
        <h2 className="text-2xl font-bold text-paper-900">{error || "Job not found"}</h2>
        <p className="mt-2 text-sm text-paper-500">
          The job posting you are looking for might have been closed or removed.
        </p>
        <Link
          href="/jobs"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-ink-700 px-6 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500"
        >
          Browse All Jobs
        </Link>
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
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-paper-500 hover:text-ink-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
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
              <h2 className="text-lg font-semibold text-paper-900 mb-4">Job Description</h2>
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
                Use CareerSaathi&apos;s agentic tools to customize your application and practice for the role.
              </p>

              <div className="space-y-3">
                <Link
                  href={`/generator?jobId=${job._id}`}
                  className="flex h-11 w-full items-center justify-center rounded-lg bg-ink-700 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500"
                >
                  Generate Cover Letter
                </Link>
                <Link
                  href={`/coach/${job._id}`}
                  className="flex h-11 w-full items-center justify-center rounded-lg border border-ink-700 bg-paper-0 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50"
                >
                  Practice Mock Interview
                </Link>
              </div>
            </div>

            {/* Location / Date info */}
            <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm text-sm text-paper-700 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="h-4.5 w-4.5 text-paper-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4.5 w-4.5 text-paper-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span>Posted on {new Date(job.postedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <div className="mt-16 border-t border-paper-100 pt-12">
            <h2 className="text-xl font-bold text-paper-900 mb-6">Related Positions</h2>
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
