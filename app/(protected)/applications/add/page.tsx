"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";

const addAppSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().optional(),
  category: z.string().optional(),
  employmentType: z
    .enum(["full-time", "part-time", "internship", "remote"])
    .optional(),
  fullDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters"),
  companyLogoUrl: z.string().optional().or(z.literal("")),
  status: z
    .enum(["saved", "applied", "interviewing", "offer", "rejected"])
    .optional(),
});

type AddAppForm = z.infer<typeof addAppSchema>;

export default function AddApplicationPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddAppForm>({
    resolver: zodResolver(addAppSchema),
    defaultValues: {
      location: "Remote",
      category: "Engineering",
      employmentType: "full-time",
      status: "saved",
    },
  });

  async function onSubmit(data: AddAppForm) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to add application");
        toast.error(result.error || "Failed to add application");
      } else {
        toast.success("Application added successfully!");
        router.push("/applications/manage");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const inputCls =
    "h-11 w-full rounded-xl border border-paper-300 bg-paper-0 px-3 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20";
  const textareaCls =
    "w-full rounded-xl border border-paper-300 bg-paper-0 p-3 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20 min-h-[150px]";
  const selectCls =
    "h-11 w-full rounded-xl border border-paper-300 bg-paper-0 px-3 text-base text-paper-900 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20";

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="mx-auto max-w-2xl px-6">
        <Link
          href="/applications/manage"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-paper-500 hover:text-ink-700">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to Applications
        </Link>

        <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-paper-900 mb-2">
            Track New Application
          </h1>
          <p className="text-sm text-paper-500 mb-6">
            Enter the details of the job opportunity to start tracking and using
            AI tools.
          </p>

          {error && (
            <div className="mb-6 flex items-start gap-2 rounded-lg border border-coral-200 bg-coral-50 p-3 text-sm text-coral-700">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                size={16}
                className="mt-0.5 shrink-0"
              />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-paper-700">
                  Job Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Engineer"
                  className={inputCls}
                  {...register("title")}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-coral-700">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-paper-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className={inputCls}
                  {...register("company")}
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-coral-700">
                    {errors.company.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-paper-700">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Remote / New York"
                  className={inputCls}
                  {...register("location")}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-paper-700">
                  Category
                </label>
                <select className={selectCls} {...register("category")}>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Product">Product</option>
                  <option value="Data Science">Data Science</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-paper-700">
                  Type
                </label>
                <select className={selectCls} {...register("employmentType")}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-paper-700">
                Company Logo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                className={inputCls}
                {...register("companyLogoUrl")}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-paper-700">
                Current Application Status
              </label>
              <select className={selectCls} {...register("status")}>
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-paper-700">
                Job Description *
              </label>
              <textarea
                placeholder="Paste the full job description here. This feeds the AI generator and coach with context."
                className={textareaCls}
                {...register("fullDescription")}
              />
              {errors.fullDescription && (
                <p className="mt-1 text-sm text-coral-700">
                  {errors.fullDescription.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-paper-100">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-lg px-6 text-sm font-medium text-paper-700 hover:bg-paper-50">
                <Link href="/applications/manage">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 rounded-lg bg-ink-700 px-6 text-sm font-medium text-paper-0 hover:bg-ink-500">
                {isLoading ? "Saving..." : "Save Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
