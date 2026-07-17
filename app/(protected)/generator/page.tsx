"use client";

import { useState, useEffect, Suspense, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { readDataStream } from "ai";

const generatorSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  company: z.string().optional().or(z.literal("")),
  skills: z.string().min(10, "Please enter some key skills or experiences"),
  tone: z.enum(["formal", "friendly", "confident"]).default("confident"),
  outputType: z.enum(["Cover Letter", "Resume Bullets", "LinkedIn Summary"]).default("Cover Letter"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  fullDescription: z.string().min(10, "Job description is required to tailor the content"),
});

type GeneratorForm = z.infer<typeof generatorSchema>;

interface Application {
  _id: string;
  job?: {
    _id: string;
    title: string;
    company: string;
    fullDescription: string;
  };
}

function GeneratorFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("jobId");

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GeneratorForm>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      tone: "confident",
      outputType: "Cover Letter",
      length: "medium",
    },
  });

  const watchTitle = watch("title");
  const watchCompany = watch("company");

  // Fetch user's applications to populate the selector
  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data);

          // If a jobId param is present, select and auto-fill it
          if (jobIdParam) {
            const foundApp = data.find((app: Application) => app.job?._id === jobIdParam);
            if (foundApp) {
              setSelectedAppId(foundApp._id);
              setValue("title", foundApp.job.title);
              setValue("company", foundApp.job.company);
              setValue("fullDescription", foundApp.job.fullDescription);
            } else {
              // Fetch job directly if not in tracked applications
              const jobRes = await fetch(`/api/jobs/${jobIdParam}`);
              if (jobRes.ok) {
                const jobData = await jobRes.json();
                setValue("title", jobData.job.title);
                setValue("company", jobData.job.company);
                setValue("fullDescription", jobData.job.fullDescription);
              }
            }
          }
        }
      } catch {
        console.error("Failed to load applications");
      }
    }
    fetchApps();
  }, [jobIdParam, setValue]);

  // Handle application dropdown selection change
  function handleAppSelect(appId: string) {
    setSelectedAppId(appId);
    if (!appId) return;

    const selectedApp = applications.find((app) => app._id === appId);
    if (selectedApp?.job) {
      setValue("title", selectedApp.job.title);
      setValue("company", selectedApp.job.company);
      setValue("fullDescription", selectedApp.job.fullDescription);
    }
  }

  // Submit and stream from API route
  async function onSubmit(data: GeneratorForm) {
    setIsGenerating(true);
    setGeneratedText("");
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Stream the reader chunks
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: !done });
        
        // Parse vercel AI SDK data stream protocol
        // Protocol format: 0:"text part"
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Extract content from JSON string
            try {
              const textVal = JSON.parse(line.substring(2));
              setGeneratedText((prev) => prev + textVal);
            } catch {
              // Fallback if parsing fails
              const rawVal = line.substring(3, line.length - 1);
              setGeneratedText((prev) => prev + rawVal);
            }
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please check your API keys and try again.";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  // Save the generated cover letter to the database
  async function saveToApplication() {
    if (!selectedAppId) {
      setError("Please select a tracked application from the dropdown above to save this letter.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/applications/${selectedAppId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          generatedCoverLetter: generatedText,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save cover letter");
      }

      alert("Content saved successfully to your application tracker!");
    } catch {
      setError("Failed to save the content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const inputCls =
    "h-11 w-full rounded-xl border border-paper-300 bg-paper-0 px-3 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20";
  const textareaCls =
    "w-full rounded-xl border border-paper-300 bg-paper-0 p-3 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20 min-h-[120px]";
  const selectCls =
    "h-11 w-full rounded-xl border border-paper-300 bg-paper-0 px-3 text-base text-paper-900 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20";

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-3xl font-semibold text-paper-900 mb-2">AI Content Generator</h1>
        <p className="text-sm text-paper-500 mb-8">
          Generate highly tailored cover letters, resume bullet points, or LinkedIn summaries.
        </p>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Left panel: Form */}
          <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-paper-700">
                Link to Tracked Job Application (Optional)
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => handleAppSelect(e.target.value)}
                className={selectCls}
              >
                <option value="">-- Choose an application to auto-fill --</option>
                {applications.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.job?.company} — {app.job?.title}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-paper-700">Job Title *</label>
                  <input type="text" className={inputCls} placeholder="e.g. Senior React Developer" {...register("title")} />
                  {errors.title && <p className="mt-1 text-sm text-coral-700">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-paper-700">Company Name</label>
                  <input type="text" className={inputCls} placeholder="e.g. Stripe" {...register("company")} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-paper-700">Your Skills & Experiences *</label>
                <textarea
                  className={textareaCls}
                  placeholder="Paste details from your resume, key technical skills, or specific stories you want to highlight for this role."
                  {...register("skills")}
                />
                {errors.skills && <p className="mt-1 text-sm text-coral-700">{errors.skills.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-paper-700">Format</label>
                  <select className={selectCls} {...register("outputType")}>
                    <option value="Cover Letter">Cover Letter</option>
                    <option value="Resume Bullets">Resume Bullets</option>
                    <option value="LinkedIn Summary">LinkedIn Summary</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-paper-700">Tone</label>
                  <select className={selectCls} {...register("tone")}>
                    <option value="confident">Confident</option>
                    <option value="formal">Formal</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-paper-700">Length</label>
                  <select className={selectCls} {...register("length")}>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-paper-700">Full Job Description *</label>
                <textarea
                  className={textareaCls}
                  placeholder="Paste the full job posting details here to allow AI to tailor the outputs."
                  {...register("fullDescription")}
                />
                {errors.fullDescription && <p className="mt-1 text-sm text-coral-700">{errors.fullDescription.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="h-11 w-full rounded-lg bg-ink-700 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500 disabled:opacity-50"
              >
                {isGenerating ? "Generating Stream..." : "Generate tailored content"}
              </button>
            </form>
          </div>

          {/* Right panel: Output */}
          <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm flex flex-col h-full min-h-[500px] justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-paper-100 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-paper-900">Generated Output</h2>
                {selectedAppId && (
                  <span className="rounded-full bg-ink-50 px-2.5 py-0.5 font-mono text-[10px] font-medium text-ink-500">
                    Linked to app tracker
                  </span>
                )}
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-coral-200 bg-coral-50 p-3 text-sm text-coral-700">
                  {error}
                </div>
              )}

              {generatedText ? (
                <textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  className="w-full min-h-[350px] border-0 focus:outline-none focus:ring-0 text-paper-900 bg-transparent font-sans text-base leading-relaxed resize-y whitespace-pre-wrap"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center text-paper-500">
                  <svg className="h-10 w-10 text-paper-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p className="text-sm">Tailored response will display here after you hit generate.</p>
                </div>
              )}
            </div>

            {generatedText && (
              <div className="mt-8 border-t border-paper-100 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isGenerating}
                  className="flex h-11 flex-1 items-center justify-center rounded-lg border border-paper-300 bg-paper-0 text-sm font-medium text-paper-700 transition-colors hover:bg-paper-50"
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={saveToApplication}
                  disabled={isSaving || !selectedAppId}
                  className="flex h-11 flex-1 items-center justify-center rounded-lg bg-ink-700 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : selectedAppId ? "Save to Tracker" : "Select App to Save"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-paper-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-700 border-t-transparent" />
      </div>
    }>
      <GeneratorFormContent />
    </Suspense>
  );
}
