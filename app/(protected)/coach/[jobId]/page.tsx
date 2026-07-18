"use client";

import { useState, useEffect, useRef, use, Suspense } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ChatBotIcon,
  UserIcon,
  ActivitySparkIcon,
  Message01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

interface Job {
  _id: string;
  title: string;
  company: string;
  category: string;
  location: string;
}

function CoachChatContent({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);

  const [job, setJob] = useState<Job | null>(null);
  const [conversationId, setConversationId] = useState<string>("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/ai/coach",
    body: {
      jobId,
      conversationId,
    },
    onResponse: () => {
      setError(null);
    },
    onError: (err) => {
      console.error("Chat streaming error:", err);
      setError("Failed to get response. Please verify your Gemini API key in .env.local.");
    },
  });

  // Fetch job details and initialize/create a new conversation
  useEffect(() => {
    async function init() {
      try {
        setIsLoadingDetails(true);
        // Fetch job
        const jobRes = await fetch(`/api/jobs/${jobId}`);
        if (!jobRes.ok) throw new Error("Job not found");
        const jobData = await jobRes.json();
        setJob(jobData.job);

        // Initialize a new conversation ID in database
        const convRes = await fetch(`/api/ai/coach/new?jobId=${jobId}`);
        if (!convRes.ok) throw new Error("Failed to initialize conversation");
        const convData = await convRes.json();
        setConversationId(convData._id);

        if (convData.messages && convData.messages.length > 0) {
          setMessages(convData.messages);
          setHasStarted(true);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load interview details");
      } finally {
        setIsLoadingDetails(false);
      }
    }
    init();
  }, [jobId, setMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start the interview session
  function startInterview() {
    setHasStarted(true);
    append({
      role: "user",
      content: "Hello, I am ready to start the mock interview.",
    });
  }

  // Handle Suggested Chip Click
  function handleChipClick(text: string) {
    append({
      role: "user",
      content: text,
    });
  }

  if (isLoadingDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-700 border-t-transparent" />
          <p className="font-mono text-sm text-paper-500">Initializing Coach Persona…</p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <HugeiconsIcon icon={AlertCircleIcon} size={48} className="mx-auto text-coral-500 mb-4" />
        <h2 className="text-xl font-semibold text-paper-900">Initialization Failed</h2>
        <p className="mt-2 text-sm text-paper-500">{error}</p>
        <Link
          href="/coach"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-ink-700 px-6 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500"
        >
          Back to Selector
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-paper-50">
      {/* Top Bar / Header */}
      <div className="border-b border-paper-100 bg-paper-0 px-6 py-4 shadow-sm shrink-0">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/coach"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-paper-200 bg-paper-0 text-paper-500 hover:text-ink-700"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Link>
            <div className="min-w-0">
              <h1 className="font-semibold text-paper-900 text-base leading-tight truncate">
                Mock Interview: {job?.title}
              </h1>
              <p className="text-xs text-paper-500 mt-0.5 truncate">{job?.company}</p>
            </div>
          </div>
          <span className="rounded-full bg-coral-50 px-3 py-1 font-mono text-[10px] font-semibold text-coral-700 uppercase tracking-wider">
            Live Session
          </span>
        </div>
      </div>

      {/* Main Conversation Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-4xl h-full flex flex-col">
          {!hasStarted ? (
            /* Onboarding Start Screen */
            <div className="flex flex-col items-center justify-center my-auto text-center max-w-md mx-auto">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-700">
                <HugeiconsIcon icon={ChatBotIcon} size={32} />
              </div>
              <h2 className="text-xl font-bold text-paper-900">Ready to begin?</h2>
              <p className="mt-2 text-sm text-paper-500 leading-relaxed">
                You will practice mock interview questions mapped precisely to the responsibilities and skills in the <strong className="text-paper-700">{job?.title}</strong> job posting.
              </p>
              <button
                onClick={startInterview}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-ink-700 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500"
              >
                Start Interview
              </button>
            </div>
          ) : (
            /* Message Logs */
            <div className="space-y-6">
              {messages
                // Skip the initial trigger message to keep client log clean
                .filter((m) => m.content !== "Hello, I am ready to start the mock interview.")
                .map((m) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-4 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm ${
                          isUser
                            ? "border-coral-100 bg-coral-50 text-coral-700"
                            : "border-ink-100 bg-ink-50 text-ink-700"
                        }`}
                      >
                        <HugeiconsIcon icon={isUser ? UserIcon : ChatBotIcon} size={18} />
                      </div>

                      {/* Content Bubble */}
                      <div
                        className={`rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed ${
                          isUser
                            ? "bg-coral-500 text-paper-0"
                            : "bg-paper-0 border border-paper-100 text-paper-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap font-sans">{m.content}</p>
                      </div>
                    </div>
                  );
                })}

              {/* Loader/Thinking Indicator */}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-4 max-w-3xl">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-ink-100 bg-ink-50 text-ink-700">
                    <HugeiconsIcon icon={ChatBotIcon} size={18} />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-paper-0 border border-paper-100 px-5 py-3.5 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-paper-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-paper-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-paper-400" />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex gap-2 rounded-lg border border-coral-200 bg-coral-50 p-3 text-xs text-coral-700 max-w-md mx-auto items-center">
                  <HugeiconsIcon icon={AlertCircleIcon} size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Suggested Prompt Chips + Form Input */}
      {hasStarted && (
        <div className="border-t border-paper-100 bg-paper-0 p-4 shrink-0 shadow-lg">
          <div className="mx-auto max-w-4xl">
            {/* Suggested Chips */}
            {!isLoading && (
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleChipClick("Ask a harder question based on my last answer")}
                  className="rounded-full border border-paper-200 bg-paper-50 px-3 py-1.5 text-xs font-semibold text-paper-700 transition-colors hover:bg-paper-100 flex items-center gap-1.5"
                >
                  <HugeiconsIcon icon={ActivitySparkIcon} size={12} className="text-coral-500" />
                  Ask harder question
                </button>
                <button
                  onClick={() => handleChipClick("Give me detailed constructive feedback on my last response")}
                  className="rounded-full border border-paper-200 bg-paper-50 px-3 py-1.5 text-xs font-semibold text-paper-700 transition-colors hover:bg-paper-100 flex items-center gap-1.5"
                >
                  <HugeiconsIcon icon={Message01Icon} size={12} className="text-ink-700" />
                  Request feedback
                </button>
                <button
                  onClick={() => handleChipClick("Let's switch to behavioral/cultural questions")}
                  className="rounded-full border border-paper-200 bg-paper-50 px-3 py-1.5 text-xs font-semibold text-paper-700 transition-colors hover:bg-paper-100 flex items-center gap-1.5"
                >
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} className="text-brass-700" />
                  Switch to behavioral
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Type your response here…"
                className="h-11 flex-1 rounded-xl border border-paper-300 bg-paper-0 px-4 text-sm text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-11 shrink-0 rounded-lg bg-ink-700 px-6 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoachChatPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-paper-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-700 border-t-transparent" />
      </div>
    }>
      <CoachChatContent params={params} />
    </Suspense>
  );
}
