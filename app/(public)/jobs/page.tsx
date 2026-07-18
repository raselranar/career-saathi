"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobCard } from "@/components/job-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Search01Icon,
  InboxIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    let active = true;

    // Set loading state asynchronously to avoid react-hooks/set-state-in-effect warning
    const timer = setTimeout(() => {
      if (active) setIsLoading(true);
    }, 0);

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("category", category);
    if (location) params.set("location", location);
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("pageSize", "12");

    fetch(`/api/jobs?${params.toString()}`)
      .then((res) => res.json())
      .then((data: JobsResponse) => {
        if (active) {
          setJobs(data.data);
          setTotalPages(data.totalPages);
          setTotal(data.total);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch jobs:", error);
        if (active) setIsLoading(false);
      })
      .finally(() => {
        clearTimeout(timer);
      });

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, category, location, sort, page]);

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
            Browse {total > 0 ? `${total} open` : ""} positions across top
            companies
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-paper-500"
              />
              <input
                type="text"
                placeholder="Search by title, company, or keyword…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-11 w-full rounded-xl border border-paper-300 bg-paper-0 pl-10 pr-4 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20"
              />
            </div>
            <div className="relative sm:w-56">
              <HugeiconsIcon
                icon={Location01Icon}
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-paper-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="h-11 w-full rounded-xl border border-paper-300 bg-paper-0 pl-10 pr-4 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20"
              />
            </div>
            <Button
              type="submit"
              className="h-11 shrink-0 rounded-lg bg-ink-700 px-6 text-sm font-medium text-paper-0 hover:bg-ink-500">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Filters + Sort bar */}
      <div className="border-b mx-auto max-w-7xl outline border-paper-100 bg-paper-0">
        <div className="flex items-center gap-3 px-6 py-3 lg:px-16">
          {/* Category pills */}
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "ghost"}
                onClick={() => updateParams({ category: cat })}
                className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium">
                {cat}
              </Button>
            ))}
          </div>

          <div className="ml-auto shrink-0">
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="h-9 rounded-lg border border-paper-300 bg-paper-0 px-3 text-sm text-paper-700 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20">
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
            <HugeiconsIcon
              icon={InboxIcon}
              size={48}
              className="mx-auto mb-4 text-paper-300"
            />
            <h3 className="text-lg font-semibold text-paper-900">
              No jobs found
            </h3>
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
                <Button
                  variant="outline"
                  onClick={() => updateParams({ page: String(page - 1) })}
                  disabled={page <= 1}
                  className="h-9 rounded-lg px-3 text-sm font-medium text-paper-700 hover:bg-paper-50">
                  Previous
                </Button>
                <span className="px-3 font-mono text-sm text-paper-500">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => updateParams({ page: String(page + 1) })}
                  disabled={page >= totalPages}
                  className="h-9 rounded-lg px-3 text-sm font-medium text-paper-700 hover:bg-paper-50">
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
