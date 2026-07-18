"use client";
import { use } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h2 className="text-xl font-semibold text-paper-900">
          Article Not Found
        </h2>
        <p className="mt-2 text-sm text-paper-500">
          The career advice article you are looking for does not exist.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-ink-700 px-5 text-sm font-medium text-paper-0 transition-colors hover:bg-ink-500">
          Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <article className="mx-auto max-w-3xl px-6">
        {/* Back navigation */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-paper-500 hover:text-ink-700">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to Insights
        </Link>

        {/* Article Container */}
        <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm md:p-12">
          {/* Category Pill */}
          <span className="font-mono text-xs font-semibold text-brass-700 uppercase tracking-wider block mb-4">
            {post.category}
          </span>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-paper-900 leading-tight font-serif sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          {/* Author & Meta */}
          <div className="mt-6 flex flex-wrap gap-4 items-center border-y border-paper-100 py-4 text-sm text-paper-500">
            <div>
              By{" "}
              <span className="font-semibold text-paper-700">
                {post.author}
              </span>
            </div>
            <span className="text-paper-300 hidden sm:inline">&middot;</span>
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={Calendar01Icon} size={16} />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <span className="text-paper-300 hidden sm:inline">&middot;</span>
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={Clock01Icon} size={16} />
              <span>{post.readingTime}</span>
            </div>
          </div>

          {/* Full content */}
          <div className="mt-8 prose prose-paper max-w-none text-paper-700 whitespace-pre-wrap font-sans text-base leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}
