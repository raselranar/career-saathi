import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Shield01Icon, TaskDone01Icon } from "@hugeicons/core-free-icons";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper-50 py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-semibold text-paper-900 tracking-tight font-serif sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-paper-500 font-sans">
            How we protect your personal information, resumes, and interview records.
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 md:p-12 shadow-sm space-y-8 text-paper-700 font-sans leading-relaxed">
          <div className="flex items-start gap-4">
            <span className="text-ink-700 mt-1">
              <HugeiconsIcon icon={Shield01Icon} size={28} />
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-paper-900 font-serif mb-2">
                Your Data is Yours
              </h2>
              <p>
                At CareerSaathi, we respect the confidentiality of your career search. We only collect the information necessary to provide you with tailored AI content generation, mock interview coaching, and application tracking features.
              </p>
            </div>
          </div>

          <div className="border-t border-paper-100 pt-8 space-y-4">
            <h3 className="text-xl font-semibold text-paper-900 font-serif">1. What Information We Collect</h3>
            <p>
              * **Account Profile**: When you register or sign in with Google OAuth, we retrieve your name, email address, and profile picture url.
              * **Tracked Applications**: Information regarding job applications you manually track, including company name, title, status updates, and notes.
              * **AI Prompts & Inputs**: Resumes, key skills, or job descriptions you feed into the AI Content Generator.
              * **Coach Transcripts**: History and text records of your AI Mock Interview Coach conversations.
            </p>
          </div>

          <div className="border-t border-paper-100 pt-8 space-y-4">
            <h3 className="text-xl font-semibold text-paper-900 font-serif">2. How We Process Data with Google Gemini</h3>
            <p>
              CareerSaathi uses the Google Generative AI SDK (specifically model `gemini-2.0-flash`) to power features like cover letter creation and mock interviews. 
              * Only relevant fields (job descriptions, user-provided skills, conversation histories) are forwarded to the AI API.
              * Your personal credentials, exact passwords, or raw session tokens are never shared with AI providers.
              * AI generation inputs are not stored permanently by the provider to train public base models.
            </p>
          </div>

          <div className="border-t border-paper-100 pt-8 space-y-4">
            <h3 className="text-xl font-semibold text-paper-900 font-serif">3. Cookies and Session Tokens</h3>
            <p>
              We utilize Better Auth for secure user sessions. This system uses HTTP cookies to safely verify requests to protected dashboard routes (`/dashboard`, `/coach`, `/generator`, `/applications`). No third-party tracking scripts are injected.
            </p>
          </div>

          <div className="border-t border-paper-100 pt-8 space-y-4">
            <h3 className="text-xl font-semibold text-paper-900 font-serif">4. Data Deletion</h3>
            <p>
              You maintain complete control over your application history. If you delete an entry from your Job Tracker, it is permanently removed from our MongoDB instance. If you wish to delete your account entirely, you can reach out to our team at any time.
            </p>
          </div>

          {/* Footer Back link */}
          <div className="border-t border-paper-100 pt-8 flex items-center justify-between">
            <span className="text-xs text-paper-400">Last updated: July 2026</span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-semibold text-ink-700 hover:underline"
            >
              <HugeiconsIcon icon={TaskDone01Icon} size={16} />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
