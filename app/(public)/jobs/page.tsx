"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobCard } from "@/components/job-card";
import { SkeletonCard } from "@/components/skeleton-card";

const CATEGORIES = [
  "All",
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Product",
  "Data Science",
  "DevOps",
  "Finance",
  "Human Resources",
  "Customer Support",
];

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
  postedAt: string;
}

interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Read params
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const location = searchParams.get("location") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  // Local state for inputs
  const [searchInput, setSearchInput] = useState(search);
  const [locationInput, setLocationInput] = useState(location);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category && category !== "All") params.set("category", category);
      if (location) params.set("location", location);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("pageSize", "12");

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data: JobsResponse = await res.json();
      setJobs(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [search, category, location, sort, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "All") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 when filters change
    if (!updates.page) params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ search: searchInput, location: locationInput });
  }

  return (
    <div className="min-h-screen bg-paper-50">
      {/* Header */}
      <div className="border-b border-paper-100 bg-paper-0">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-16">
          <h1 className="text-3xl font-semibold text-paper-900">
            Find Your Next Role
          </h1>
          <p className="mt-2 text-lg text-paper-500">
            Browse {total > 0 ? `${total} open` : ""} positions across top companies
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-paper-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search by title, company, or keyword…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-11 w-full rounded-xl border border-paper-300 bg-paper-0 pl-10 pr-4 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20"
              />
            </div>
            <div className="relative sm:w-56">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-paper-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <input
                type="text"
                placeholder="Location"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="h-11 w-full rounded-xl border border-paper-300 bg-paper-0 pl-10 pr-4 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20"
              />
            </div>
            <button
              type="submit"
              className="h-11 shrink-0 rounded-lg bg-ink-700 px-6 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filters + Sort bar */}
      <div className="border-b border-paper-100 bg-paper-0">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-6 py-3 lg:px-16">
          {/* Category pills */}
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParams({ category: cat })}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-ink-700 text-paper-0"
                    : "bg-paper-50 text-paper-700 hover:bg-paper-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ml-auto shrink-0">
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="h-9 rounded-lg border border-paper-300 bg-paper-0 px-3 text-sm text-paper-700 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20"
            >
              <option value="newest">Newest first</option>
              <option value="salary">Salary (high to low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job grid */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-16">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-24 text-center">
            <svg
              className="mx-auto mb-4 h-12 w-12 text-paper-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <h3 className="text-lg font-semibold text-paper-900">No jobs found</h3>
            <p className="mt-1 text-sm text-paper-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  id={job._id}
                  title={job.title}
                  company={job.company}
                  companyLogoUrl={job.companyLogoUrl}
                  location={job.location}
                  salaryRange={job.salaryRange}
                  employmentType={job.employmentType}
                  category={job.category}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => updateParams({ page: String(page - 1) })}
                  disabled={page <= 1}
                  className="h-9 rounded-lg border border-paper-300 px-3 text-sm font-medium text-paper-700 transition-colors hover:bg-paper-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 font-mono text-sm text-paper-500">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => updateParams({ page: String(page + 1) })}
                  disabled={page >= totalPages}
                  className="h-9 rounded-lg border border-paper-300 px-3 text-sm font-medium text-paper-700 transition-colors hover:bg-paper-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
