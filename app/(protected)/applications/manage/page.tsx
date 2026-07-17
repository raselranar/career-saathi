"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "@/components/status-badge";
import { InkStrokeProgress } from "@/components/ink-stroke-progress";
import { ApplicationStatus } from "@/lib/types";

interface Job {
  _id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  category: string;
  employmentType: string;
  salaryRange?: string;
}

interface Application {
  _id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  job?: Job;
}

export default function ManageApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setApplications(data);
    } catch {
      setError("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  async function handleStatusChange(id: string, newStatus: ApplicationStatus) {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();

      // Optimistically update status
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app)),
      );
    } catch {
      alert("Failed to update status");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this application?")) return;

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch {
      alert("Failed to delete application");
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 animate-pulse lg:px-16">
        <div className="h-8 w-48 rounded bg-paper-100 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-paper-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-paper-900">Job Tracker</h1>
            <p className="mt-1 text-sm text-paper-500">
              Manage your active applications, edit statuses, and launch AI tools.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/jobs"
              className="flex h-11 items-center justify-center rounded-lg border border-paper-300 bg-paper-0 px-5 text-sm font-medium text-paper-700 transition-colors hover:bg-paper-50"
            >
              Browse Jobs
            </Link>
            <Link
              href="/applications/add"
              className="flex h-11 items-center justify-center rounded-lg bg-ink-700 px-5 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500"
            >
              Track Custom Job
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-coral-200 bg-coral-50 p-4 text-sm text-coral-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-paper-300 bg-paper-0 py-24 text-center">
            <svg
              className="mx-auto mb-4 h-12 w-12 text-paper-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-paper-900">No applications tracked yet</h3>
            <p className="mt-1 text-sm text-paper-500 max-w-sm mx-auto">
              Browse seeded jobs and click &quot;Generate Cover Letter&quot; or track a completely custom opportunity manually.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/jobs"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-ink-700 px-5 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500"
              >
                Browse Seeded Jobs
              </Link>
            </div>
          </div>
        ) : (
          /* Application Grid */
          <div className="space-y-6">
            {applications.map((app) => {
              const job = app.job;
              const initial = job?.company ? job.company.charAt(0).toUpperCase() : "?";

              return (
                <div
                  key={app._id}
                  className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Job Details */}
                    <div className="flex items-start gap-4 min-w-0 max-w-md">
                      {job?.companyLogoUrl ? (
                        <Image
                          width={300}
                          height={300}
                          src={job.companyLogoUrl}
                          alt={`${job.company} logo`}
                          className="h-12 w-12 rounded-xl object-contain border border-paper-100"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-700 text-lg font-semibold text-paper-0">
                          {initial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-paper-900 text-lg leading-tight truncate">
                          {job?.title || "Unknown Title"}
                        </h3>
                        <p className="text-sm text-paper-500 mt-1">
                          {job?.company || "Unknown Company"} &middot; {job?.location}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <StatusBadge status={app.status} />
                          {/* Quick status selector */}
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleStatusChange(app._id, e.target.value as ApplicationStatus)
                            }
                            className="h-7 rounded border border-paper-300 bg-paper-0 px-2 text-xs text-paper-700 focus:border-ink-500 focus:outline-none"
                          >
                            <option value="saved">Saved</option>
                            <option value="applied">Applied</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="offer">Offer</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex flex-1 items-center justify-center lg:px-8">
                      <InkStrokeProgress status={app.status} />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {job && (
                        <>
                          <Link
                            href={`/generator?jobId=${job._id}`}
                            className="flex h-9 items-center justify-center rounded-lg bg-ink-700 px-4 text-xs font-semibold text-paper-0 transition-colors hover:bg-ink-500"
                          >
                            AI Gen
                          </Link>
                          <Link
                            href={`/coach/${job._id}`}
                            className="flex h-9 items-center justify-center rounded-lg border border-ink-700 bg-paper-0 px-4 text-xs font-semibold text-ink-700 transition-colors hover:bg-paper-50"
                          >
                            AI Coach
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="flex h-9 items-center justify-center rounded-lg border border-coral-700 bg-paper-0 px-4 text-xs font-semibold text-coral-700 transition-colors hover:bg-coral-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
