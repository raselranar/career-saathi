"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Message01Icon,
  AiContentGenerator01Icon,
  ArrowRight01Icon,
  ActivitySparkIcon,
} from "@hugeicons/core-free-icons";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { ApplicationStatus } from "@/lib/types";
import { useSession } from "@/lib/auth-client";

interface Job {
  _id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
}

interface Application {
  _id: string;
  status: ApplicationStatus;
  updatedAt: string;
  job?: Job;
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const userName = useMemo(
    () => session?.user?.name || session?.user?.email?.split("@")[0] || "Professional",
    [session],
  );

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const appRes = await fetch("/api/applications");

        if (appRes.ok) {
          const appData = await appRes.json();
          setApplications(appData);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // Compute stats
  const totalApps = applications.length;
  const countByStatus = (status: ApplicationStatus) =>
    applications.filter((app) => app.status === status).length;

  const savedCount = countByStatus("saved");
  const appliedCount = countByStatus("applied");
  const interviewingCount = countByStatus("interviewing");
  const offerCount = countByStatus("offer");

  // Get 3 most recently updated
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-50 py-12 animate-pulse">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          {/* Welcome Banner Skeleton */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="h-8 w-64 rounded-lg bg-paper-200" />
              <div className="h-4 w-80 rounded bg-paper-100" />
            </div>
            <div className="flex gap-3">
              <div className="h-11 w-28 rounded-lg bg-paper-200" />
              <div className="h-11 w-32 rounded-lg bg-paper-300" />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
                <div className="h-2.5 w-24 rounded bg-paper-100" />
                <div className="mt-3 h-8 w-12 rounded bg-paper-200" />
              </div>
            ))}
          </div>

          {/* Content Layout Skeleton */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Applications Skeleton */}
              <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-5 w-40 rounded bg-paper-200" />
                  <div className="h-3.5 w-20 rounded bg-paper-100" />
                </div>
                <div className="divide-y divide-paper-50">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-paper-200" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-40 rounded bg-paper-200" />
                          <div className="h-3 w-28 rounded bg-paper-100" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-5 w-16 rounded-full bg-paper-100" />
                        <div className="flex gap-2">
                          <div className="h-8 w-8 rounded-lg bg-paper-100" />
                          <div className="h-8 w-8 rounded-lg bg-paper-100" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Skeleton */}
              <div className="grid gap-6 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
                    <div className="mb-4 h-10 w-10 rounded-lg bg-paper-100" />
                    <div className="h-4 w-36 rounded bg-paper-200 mb-2" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full rounded bg-paper-100" />
                      <div className="h-3 w-3/4 rounded bg-paper-100" />
                    </div>
                    <div className="mt-4 h-3 w-24 rounded bg-paper-100" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-6">
              {/* Pipeline Distribution Skeleton */}
              <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
                <div className="h-5 w-36 rounded bg-paper-200 mb-5" />
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-20 rounded bg-paper-100" />
                        <div className="h-3 w-4 rounded bg-paper-200" />
                      </div>
                      <div className="h-2 w-full rounded-full bg-paper-100" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Guide Skeleton */}
              <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="h-5 w-5 rounded bg-paper-100" />
                  <div className="h-4 w-24 rounded bg-paper-200" />
                </div>
                <div className="h-4 w-56 rounded bg-paper-200 mb-2" />
                <div className="space-y-1.5 mb-4">
                  <div className="h-3 w-full rounded bg-paper-100" />
                  <div className="h-3 w-full rounded bg-paper-100" />
                  <div className="h-3 w-2/3 rounded bg-paper-100" />
                </div>
                <div className="h-3 w-24 rounded bg-paper-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        {/* Welcome Banner */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-paper-900 tracking-tight">
              Welcome back, {userName}
            </h1>
            <p className="mt-1 text-sm text-paper-500">
              Here is an overview of your active applications and coaching sessions.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="h-11 rounded-lg px-5 text-sm font-medium text-paper-700 hover:bg-paper-50">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
            <Button asChild className="h-11 rounded-lg bg-ink-700 px-5 text-sm font-medium text-paper-0 hover:bg-ink-500">
              <Link href="/applications/add">Add Application</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
            <p className="font-mono text-[10px] font-semibold text-paper-500 uppercase tracking-wider">
              Total Opportunities
            </p>
            <p className="mt-2 text-3xl font-bold text-paper-900">{totalApps}</p>
          </div>
          <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
            <p className="font-mono text-[10px] font-semibold text-paper-500 uppercase tracking-wider">
              Interviewing
            </p>
            <p className="mt-2 text-3xl font-bold text-coral-500">{interviewingCount}</p>
          </div>
          <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
            <p className="font-mono text-[10px] font-semibold text-paper-500 uppercase tracking-wider">
              Offers Received
            </p>
            <p className="mt-2 text-3xl font-bold text-ink-700">{offerCount}</p>
          </div>
          <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
            <p className="font-mono text-[10px] font-semibold text-paper-500 uppercase tracking-wider">
              Submitted Applications
            </p>
            <p className="mt-2 text-3xl font-bold text-paper-700">{appliedCount + interviewingCount + offerCount}</p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Columns: Recent Applications */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-paper-900">Recent Applications</h2>
                <Link
                  href="/applications/manage"
                  className="text-xs font-semibold text-ink-700 hover:underline flex items-center gap-0.5"
                >
                  Manage All
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              </div>

              {recentApps.length === 0 ? (
                <div className="py-12 text-center text-paper-500 text-sm">
                  No applications tracked yet. Use the buttons above to get started.
                </div>
              ) : (
                <div className="divide-y divide-paper-50">
                  {recentApps.map((app) => {
                    const job = app.job;
                    const initial = job?.company ? job.company.charAt(0).toUpperCase() : "?";

                    return (
                      <div key={app._id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {job?.companyLogoUrl ? (
                            <Image
                              width={300}
                              height={300}
                              src={job.companyLogoUrl}
                              alt={`${job.company} logo`}
                              className="h-10 w-10 rounded-lg object-contain border border-paper-100"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-700 text-sm font-semibold text-paper-0">
                              {initial}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-paper-900 text-sm leading-tight">
                              {job?.title}
                            </h3>
                            <p className="text-xs text-paper-500 mt-0.5">
                              {job?.company} &middot; {job?.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <StatusBadge status={app.status} />
                          <div className="flex gap-2">
                            {job && (
                              <>
                                <Link
                                  href={`/generator?jobId=${job._id}`}
                                  title="AI Content Generator"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-paper-200 bg-paper-0 text-paper-600 hover:text-ink-700"
                                >
                                  <HugeiconsIcon icon={AiContentGenerator01Icon} size={16} />
                                </Link>
                                <Link
                                  href={`/coach/${job._id}`}
                                  title="AI Mock Interview Coach"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-paper-200 bg-paper-0 text-paper-600 hover:text-coral-500"
                                >
                                  <HugeiconsIcon icon={Message01Icon} size={16} />
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-coral-50 text-coral-500">
                  <HugeiconsIcon icon={Message01Icon} size={20} />
                </div>
                <h3 className="font-semibold text-paper-900 text-base">Practice Mock Interviews</h3>
                <p className="mt-1.5 text-xs text-paper-500 leading-relaxed">
                  Practice interactive audio-text chats scoped exactly to your target roles. Get constructive feedback.
                </p>
                <Link
                  href="/coach"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-coral-500 hover:underline"
                >
                  Start Practice
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              </div>

              <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-ink-50 text-ink-700">
                  <HugeiconsIcon icon={AiContentGenerator01Icon} size={20} />
                </div>
                <h3 className="font-semibold text-paper-900 text-base">Generate Job Assets</h3>
                <p className="mt-1.5 text-xs text-paper-500 leading-relaxed">
                  Instantly tailor cover letters, optimize resume bullet points, or polish your LinkedIn bio.
                </p>
                <Link
                  href="/generator"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ink-700 hover:underline"
                >
                  Launch Generator
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Coaching Resources & Insights */}
          <div className="space-y-6">
            <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-paper-900 mb-4">Pipeline Distribution</h2>
              <div className="space-y-3">
                {[
                  { label: "Saved Roles", count: savedCount, color: "bg-paper-300" },
                  { label: "Applied", count: appliedCount, color: "bg-ink-300" },
                  { label: "Interviewing", count: interviewingCount, color: "bg-coral-500" },
                  { label: "Offers", count: offerCount, color: "bg-ink-700" },
                ].map((item) => {
                  const percent = totalApps > 0 ? (item.count / totalApps) * 100 : 0;
                  return (
                    <div key={item.label} className="text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-medium text-paper-700">{item.label}</span>
                        <span className="font-mono font-semibold text-paper-900">{item.count}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-paper-100 overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resources Widget */}
            <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-paper-900 mb-4 flex items-center gap-1.5">
                <HugeiconsIcon icon={ActivitySparkIcon} size={20} className="text-coral-500" />
                Featured Guide
              </h2>
              <h3 className="font-serif font-bold text-sm text-paper-900 leading-snug">
                Cracking the Technical Interview: A Structured Approach
              </h3>
              <p className="mt-2 text-xs text-paper-500 leading-relaxed line-clamp-3">
                Technical interviews can be daunting. But success is less about memorizing 500 LeetCode problems and more about having a structured approach. Learn the framework our coaches recommend.
              </p>
              <Link
                href="/blog/cracking-the-technical-interview"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ink-700 hover:underline"
              >
                Read Article
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
