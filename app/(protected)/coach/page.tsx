"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface Job {
  _id: string;
  title: string;
  company: string;
  category: string;
  location: string;
}

interface Application {
  _id: string;
  job?: Job;
}

export default function CoachSelectorPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [seededJobs, setSeededJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appRes, jobsRes] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/jobs?pageSize=6"),
        ]);

        if (appRes.ok) {
          const appData = await appRes.json();
          setApplications(appData);
        }

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setSeededJobs(jobsData.data);
        }
      } catch (err) {
        console.error("Failed to load coaching roles", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-paper-900 tracking-tight">
            AI Interview Coach
          </h1>
          <p className="mt-2 text-base text-paper-500 max-w-md mx-auto">
            Select one of your applications or a featured job to start a live,
            interactive mock interview tailored to the role.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-6 w-48 rounded bg-paper-100" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-paper-100" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Tracked Applications */}
            {applications.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-paper-900 mb-4 flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Briefcase01Icon}
                    size={20}
                    className="text-ink-700"
                  />
                  Your Tracked Applications
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {applications.map((app) => {
                    const job = app.job;
                    if (!job) return null;
                    return (
                      <Link
                        key={app._id}
                        href={`/coach/${job._id}`}
                        className="group flex flex-col justify-between rounded-xl border border-paper-100 bg-paper-0 p-5 shadow-sm hover:shadow-md transition-all duration-150">
                        <div>
                          <h3 className="font-semibold text-paper-900 leading-tight group-hover:text-ink-700">
                            {job.title}
                          </h3>
                          <p className="text-sm text-paper-500 mt-1">
                            {job.company}
                          </p>
                          <p className="text-xs text-paper-400 mt-0.5">
                            {job.location}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-paper-50 pt-3">
                          <span className="rounded-full bg-coral-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-coral-700 uppercase">
                            Practice
                          </span>
                          <span className="text-xs font-semibold text-ink-700 flex items-center gap-1">
                            Start
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              size={14}
                              className="transition-transform group-hover:translate-x-0.5"
                            />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Featured / Seeded Jobs */}
            <div>
              <h2 className="text-lg font-semibold text-paper-900 mb-4 flex items-center gap-2">
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  size={20}
                  className="text-ink-700"
                />
                Featured Roles
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {seededJobs.map((job) => (
                  <Link
                    key={job._id}
                    href={`/coach/${job._id}`}
                    className="group flex flex-col justify-between rounded-xl border border-paper-100 bg-paper-0 p-5 shadow-sm hover:shadow-md transition-all duration-150">
                    <div>
                      <h3 className="font-semibold text-paper-900 leading-tight group-hover:text-ink-700">
                        {job.title}
                      </h3>
                      <p className="text-sm text-paper-500 mt-1">
                        {job.company}
                      </p>
                      <p className="text-xs text-paper-400 mt-0.5">
                        {job.location}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-paper-50 pt-3">
                      <span className="rounded-full bg-brass-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-brass-700 uppercase">
                        {job.category}
                      </span>
                      <span className="text-xs font-semibold text-ink-700 flex items-center gap-1">
                        Start
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* No applications fallback warning */}
            {applications.length === 0 && (
              <div className="rounded-xl bg-ink-50 p-6 text-center">
                <p className="text-sm text-ink-700">
                  Track custom jobs or browse the catalog to add applications.
                  Tracked jobs automatically unlock tailored interview coaches.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link
                    href="/applications/add"
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-ink-700 px-4 text-xs font-semibold text-paper-0 transition-colors hover:bg-ink-500">
                    Track Custom Job
                  </Link>
                  <Link
                    href="/jobs"
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-ink-700 bg-paper-0 px-4 text-xs font-semibold text-ink-700 transition-colors hover:bg-paper-50">
                    Browse Catalog
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
