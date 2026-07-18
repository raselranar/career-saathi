import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CompassIcon,
  SparklesIcon,
  AiChatIcon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper-50 py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-semibold text-paper-900 tracking-tight font-serif sm:text-5xl">
            Meet Your Career Saathi
          </h1>
          <p className="mt-4 text-lg text-paper-500 font-sans leading-relaxed">
            In Hindi and Bengali, <strong className="text-ink-700 font-semibold">Saathi</strong> means companion. 
            We built CareerSaathi to be your steady, trusted companion on the journey from application to offer.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 md:p-12 shadow-sm space-y-8 text-paper-700 font-sans leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold text-paper-900 font-serif mb-4 flex items-center gap-2">
              <span className="text-ink-700">
                <HugeiconsIcon icon={CompassIcon} size={24} />
              </span>
              The Journey is Hard. You Don&apos;t Have to Walk It Alone.
            </h2>
            <p>
              Job searching is inherently stressful. Between writing tailored cover letters, restructuring resume bullet points, tracking deadlines, and walking into nerve-wracking interviews, candidates often feel overwhelmed. Too often, job boards feel like black holes, and preparing for specific roles becomes a full-time job of its own.
            </p>
            <p className="mt-4">
              CareerSaathi was created to solve this problem. We don&apos;t believe in generic templates or copy-pasted AI scripts. Instead, we use structured context and conversational intelligence to build tools that act as high-fidelity partners. We help you highlight your real achievements and practice until you feel completely ready.
            </p>
          </div>

          <div className="border-t border-paper-100 pt-8">
            <h2 className="text-2xl font-semibold text-paper-900 font-serif mb-6">
              Our Core Philosophy
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-50 text-ink-700">
                  <HugeiconsIcon icon={SparklesIcon} size={20} />
                </div>
                <h3 className="font-semibold text-paper-900 text-base">Tailoring Over Spam</h3>
                <p className="text-xs text-paper-500 leading-normal">
                  Sending a hundred generic applications gets ignored. We help you customize your materials for target roles, ensuring your real impact shines through.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <HugeiconsIcon icon={AiChatIcon} size={20} />
                </div>
                <h3 className="font-semibold text-paper-900 text-base">Interactive Coaching</h3>
                <p className="text-xs text-paper-500 leading-normal">
                  Static text is not preparation. Our mock interviewer reacts dynamically to your answers, teaching you to speak confidently under pressure.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral-50 text-coral-700">
                  <HugeiconsIcon icon={TaskDone01Icon} size={20} />
                </div>
                <h3 className="font-semibold text-paper-900 text-base">Calm & Compassionate</h3>
                <p className="text-xs text-paper-500 leading-normal">
                  Rejection is tough. Our tracker deliberately avoids alarm-red indicators. We design interfaces that support your mental health along the trail.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="border-t border-paper-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-paper-900 font-serif">
                Ready to take the next step on your trail?
              </h3>
              <p className="text-sm text-paper-500">
                Explore open jobs or start practicing interviews with a demo account today.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/jobs"
                className="flex h-11 items-center justify-center rounded-lg border border-paper-300 bg-paper-0 px-6 text-sm font-semibold text-paper-700 transition-colors hover:bg-paper-50"
              >
                Find Jobs
              </Link>
              <Link
                href="/login"
                className="flex h-11 items-center justify-center rounded-lg bg-ink-700 px-6 text-sm font-semibold text-paper-0 transition-colors hover:bg-ink-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
