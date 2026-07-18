import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CompassIcon,
  SparklesIcon,
  AiChatIcon,
  TaskDone01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper-50 flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-paper-0 border-b border-paper-100 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-16 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brass-50 px-3 py-1 font-mono text-xs font-semibold text-brass-700 uppercase tracking-wider">
              <HugeiconsIcon icon={CompassIcon} size={14} />
              Your Career Companion
            </span>
            <h1 className="text-4xl font-semibold text-paper-900 tracking-tight font-display sm:text-6xl leading-tight">
              An AI-powered career coach for your job search trail.
            </h1>
            <p className="max-w-xl text-lg text-paper-700 font-sans leading-relaxed">
              Stop sending generic cover letters and walking into interviews
              unprepared. CareerSaathi generates tailored application materials
              and runs live, role-specific mock interviews scoped to your dream
              job.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild className="h-12 rounded-lg bg-ink-700 px-6 text-base font-semibold text-paper-0 hover:bg-ink-500 hover:-translate-y-0.5 shadow-sm gap-2">
                <Link href="/login">
                  Start for Free
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-lg px-6 text-base font-semibold text-paper-700 hover:bg-paper-50">
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>

          {/* Right Hero Image/Animation Container */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-62.5 lg:min-h-87.5">
            {/* Winding Trail Line Background SVG */}
            <svg
              className="absolute w-full h-full text-ink-100 dark:text-ink-900"
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              {/* Topographic grid lines (trail concept) */}
              <path
                d="M 0 50 C 150 100, 250 20, 400 120"
                stroke="rgba(0,0,0,0.03)"
                strokeWidth="1.5"
              />
              <path
                d="M 0 180 C 120 120, 280 260, 400 190"
                stroke="rgba(0,0,0,0.03)"
                strokeWidth="1.5"
              />

              {/* The Signature Winding Trail Line */}
              <path
                d="M 40 220 Q 120 40, 220 180 T 360 80"
                fill="none"
                stroke="#1b2a4a"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="animate-trail"
              />

              {/* Milestone Dots */}
              <g className="animate-[fade-in_400ms_ease-out_400ms_both]">
                <circle cx="40" cy="220" r="7" fill="#1b2a4a" />
                <circle cx="40" cy="220" r="3" fill="#ffffff" />
                <text
                  x="25"
                  y="245"
                  className="font-mono text-[10px] font-semibold fill-paper-500 uppercase tracking-wider">
                  Applied
                </text>
              </g>

              <g className="animate-[fade-in_400ms_ease-out_800ms_both]">
                <circle cx="220" cy="180" r="7" fill="#b08d57" />
                <circle cx="220" cy="180" r="3" fill="#ffffff" />
                <text
                  x="180"
                  y="205"
                  className="font-mono text-[10px] font-semibold fill-brass-700 uppercase tracking-wider">
                  Interviewing
                </text>
              </g>

              <g className="animate-[fade-in_400ms_ease-out_1200ms_both]">
                <circle cx="360" cy="80" r="7" fill="#e4572e" />
                <circle cx="360" cy="80" r="3" fill="#ffffff" />
                <text
                  x="330"
                  y="60"
                  className="font-mono text-[10px] font-semibold fill-coral-700 uppercase tracking-wider">
                  Offer
                </text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="py-20 bg-paper-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-16 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-semibold text-paper-900 tracking-tight font-display sm:text-4xl">
              Navigate the job hunt trail in 4 steps.
            </h2>
            <p className="mt-3 text-base text-paper-500 font-sans">
              A clean workflow designed to prepare you for each milestone of
              your application process.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center text-center p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-100 font-mono text-lg font-bold text-ink-700 mb-4">
                1
              </span>
              <h3 className="font-semibold text-lg text-paper-900 mb-2">
                Explore Jobs
              </h3>
              <p className="text-sm text-paper-500 leading-relaxed font-sans">
                Browse our curated dashboard of roles matching your technical
                background and location preferences.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-100 font-mono text-lg font-bold text-ink-700 mb-4">
                2
              </span>
              <h3 className="font-semibold text-lg text-paper-900 mb-2">
                Tailor Materials
              </h3>
              <p className="text-sm text-paper-500 leading-relaxed font-sans">
                Generate high-impact cover letters and resume bullet points
                optimized for specific job descriptions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-100 font-mono text-lg font-bold text-ink-700 mb-4">
                3
              </span>
              <h3 className="font-semibold text-lg text-paper-900 mb-2">
                Mock Interview
              </h3>
              <p className="text-sm text-paper-500 leading-relaxed font-sans">
                Speak with our interactive coach. It reviews your target job
                posting and asks custom questions based on your answers.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-100 font-mono text-lg font-bold text-ink-700 mb-4">
                4
              </span>
              <h3 className="font-semibold text-lg text-paper-900 mb-2">
                Track & Land
              </h3>
              <p className="text-sm text-paper-500 leading-relaxed font-sans">
                Monitor application milestones in real-time on our clean board
                and convert offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-20 bg-paper-0 border-t border-b border-paper-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-semibold text-paper-900 tracking-tight font-display sm:text-4xl">
              Equipped with agentic capabilities.
            </h2>
            <p className="mt-3 text-base text-paper-500 font-sans">
              Unlike generic chatbot prompts, CareerSaathi works with structured
              data to yield personalized, relevant results.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col h-full justify-between rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-150">
              <div className="space-y-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-50 text-ink-700">
                  <HugeiconsIcon icon={SparklesIcon} size={24} />
                </span>
                <h3 className="text-xl font-bold text-paper-900 font-serif">
                  Tailored Content Generator
                </h3>
                <p className="text-sm text-paper-500 leading-relaxed font-sans">
                  Instantly craft custom cover letters, resume bullet points, or
                  LinkedIn summaries. Our engine matches your real technical
                  skills directly against the target job description.
                </p>
              </div>
              <Link
                href="/generator"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:underline">
                Explore Generator
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col h-full justify-between rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-150">
              <div className="space-y-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <HugeiconsIcon icon={AiChatIcon} size={24} />
                </span>
                <h3 className="text-xl font-bold text-paper-900 font-serif">
                  AI Mock Interview Coach
                </h3>
                <p className="text-sm text-paper-500 leading-relaxed font-sans">
                  Practice talking under pressure. Our streaming interviewer
                  reviews your target job, asks questions, analyzes your
                  responses in real-time, and offers actionable feedback.
                </p>
              </div>
              <Link
                href="/coach"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:underline">
                Meet the Coach
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col h-full justify-between rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-150">
              <div className="space-y-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral-50 text-coral-700">
                  <HugeiconsIcon icon={TaskDone01Icon} size={24} />
                </span>
                <h3 className="text-xl font-bold text-paper-900 font-serif">
                  Milestone Application Tracker
                </h3>
                <p className="text-sm text-paper-500 leading-relaxed font-sans">
                  Visualize your search pipeline cleanly. Our progress
                  indicators map your applications through every waypoint
                  without overwhelming dashboard clutter.
                </p>
              </div>
              <Link
                href="/applications/manage"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:underline">
                View Tracker Board
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section className="py-16 bg-paper-50 border-b border-paper-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div className="space-y-1">
              <div className="text-4xl font-semibold text-paper-900 tracking-tight font-mono">
                1,840+
              </div>
              <div className="text-xs font-semibold text-paper-500 uppercase tracking-widest">
                Mock Interviews Conducted
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-semibold text-paper-900 tracking-tight font-mono">
                94.2%
              </div>
              <div className="text-xs font-semibold text-paper-500 uppercase tracking-widest">
                Candidate Confidence Boost
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-semibold text-paper-900 tracking-tight font-mono">
                4.5x
              </div>
              <div className="text-xs font-semibold text-paper-500 uppercase tracking-widest">
                Faster Application Tailoring
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-20 bg-paper-0">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-semibold text-paper-900 tracking-tight font-display sm:text-4xl">
              Endorsed by candidates.
            </h2>
            <p className="mt-3 text-base text-paper-500 font-sans">
              Read how job seekers have used CareerSaathi to refine their
              applications.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col justify-between h-70">
              <p className="text-sm text-paper-700 font-sans leading-relaxed italic">
                &ldquo;The AI Mock Interview Coach is incredibly smart. It
                remembered my previous answer, pressed me on code performance,
                and helped me secure my senior frontend engineer role.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-700 text-sm font-semibold text-paper-0">
                  AR
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-paper-900">
                    Aris Rahman
                  </h4>
                  <p className="text-xs text-paper-500">
                    Senior Frontend Developer
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col justify-between h-70">
              <p className="text-sm text-paper-700 font-sans leading-relaxed italic">
                &ldquo;Creating tailored cover letters per job description was
                my biggest bottleneck. With the Generator, I saved hours of
                boring work while maintaining my authentic voice.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass-700 text-sm font-semibold text-paper-0">
                  SK
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-paper-900">
                    Sarah K.
                  </h4>
                  <p className="text-xs text-paper-500">Product Designer</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col justify-between h-70">
              <p className="text-sm text-paper-700 font-sans leading-relaxed italic">
                &ldquo;I love the calm, clean layout of the application tracker.
                It doesn&apos;t scream red flags at me for rejected
                applications, making the job search mental load much
                lighter.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral-700 text-sm font-semibold text-paper-0">
                  TD
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-paper-900">
                    Tanvir Chowdhury
                  </h4>
                  <p className="text-xs text-paper-500">DevOps Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Blog Preview Section */}
      <section className="py-20 bg-paper-50 border-t border-b border-paper-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-semibold text-paper-900 tracking-tight font-display sm:text-4xl">
                Insights from our coaching team.
              </h2>
              <p className="mt-2 text-base text-paper-500 font-sans">
                Read actionable tips on matching, writing, and interview
                practice.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-ink-700 hover:underline">
              View All Articles
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm hover:shadow-md transition-shadow duration-150 h-75">
                <div>
                  <span className="font-mono text-[10px] font-semibold text-brass-700 uppercase tracking-wider block mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-paper-900 leading-tight group-hover:text-ink-700 font-display">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-3 text-sm text-paper-500 line-clamp-3 leading-relaxed font-sans">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-6 border-t border-paper-50 pt-4 flex items-center justify-between text-xs text-paper-400 font-mono">
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span>{post.readingTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-20 bg-paper-0">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-paper-900 tracking-tight font-display sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-base text-paper-500 font-sans">
              Have questions about how our AI coaching model operates?
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
              <h4 className="text-base font-bold text-paper-900 font-serif mb-2">
                How does the AI Mock Interview Coach work?
              </h4>
              <p className="text-sm text-paper-700 font-sans leading-relaxed">
                Our coach does not ask list-based static questions. Instead, it
                reads the target job posting you save, assumes the persona of a
                hiring manager, and asks questions. It reads your typed
                responses and dynamically structures its follow-up questions
                based on your background, offering brief feedback along the way.
              </p>
            </div>

            <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
              <h4 className="text-base font-bold text-paper-900 font-serif mb-2">
                Is my resume data kept private?
              </h4>
              <p className="text-sm text-paper-700 font-sans leading-relaxed">
                Yes, absolutely. We store your account profile and application
                notes in a secure, private MongoDB database. All inputs passed
                to the Gemini API are executed under transient contexts and are
                not used to train public machine learning datasets.
              </p>
            </div>

            <div className="rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm">
              <h4 className="text-base font-bold text-paper-900 font-serif mb-2">
                Can I try the platform without registering?
              </h4>
              <p className="text-sm text-paper-700 font-sans leading-relaxed">
                Yes! We have designed a one-click **Try Demo Account** feature
                on the sign-in page. This automatically logs you into a fully
                seeded profile with mock applications, interview transcripts,
                and sample data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <section className="py-20 bg-paper-50 border-t border-paper-100">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-semibold text-paper-900 tracking-tight font-display sm:text-4xl">
            Get career strategies in your inbox.
          </h2>
          <p className="mt-3 text-base text-paper-500 font-sans max-w-md mx-auto">
            Subscribe to our weekly newsletter for job search insights,
            interview prep cheat sheets, and resume optimization tips.
          </p>

          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              required
              className="h-11 flex-1 rounded-lg border border-paper-300 bg-paper-0 px-4 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none"
            />
            <Button type="submit" className="h-11 rounded-lg bg-ink-700 px-6 text-sm font-semibold text-paper-0 hover:bg-ink-500 shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* 9. Final CTA Section */}
      <section className="bg-ink-900 text-paper-0 py-20 text-center relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 relative z-10 space-y-6">
          <h2 className="text-4xl font-semibold tracking-tight font-display sm:text-5xl">
            Conquer your job search trail.
          </h2>
          <p className="max-w-md mx-auto text-lg text-ink-300 leading-relaxed font-sans">
            Start tailoring your applications and acing mock interviews with
            your AI companion.
          </p>
          <div className="pt-4">
            <Button asChild className="h-12 rounded-lg bg-coral-500 hover:bg-coral-700 px-8 text-base font-semibold text-paper-0 hover:-translate-y-0.5 gap-2">
              <Link href="/login">
                Create Your Free Account
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Tiny grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px]" />
      </section>
    </div>
  );
}
