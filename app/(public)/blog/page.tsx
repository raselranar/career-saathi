"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon, Calendar01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { BLOG_POSTS } from "@/lib/blog-data";

const CATEGORIES = ["All", "Interview Prep", "Resume Building", "Career Strategy"];

export default function BlogListPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [, startTransition] = useTransition();

  // Filter posts
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-paper-50 py-12">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-semibold text-paper-900 tracking-tight font-serif">
            Career Insights & Strategy
          </h1>
          <p className="mt-2 text-base text-paper-500">
            Expert advice on navigating the modern tech job market, crafting applications, and acing interviews.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-paper-100 pb-6">
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => startTransition(() => setSelectedCategory(cat))}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? "bg-ink-700 text-paper-0"
                    : "bg-paper-0 border border-paper-200 text-paper-700 hover:bg-paper-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-500">
              <HugeiconsIcon icon={SearchIcon} size={18} />
            </span>
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-paper-300 bg-paper-0 pl-10 pr-4 text-sm text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Blog Post Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-lg font-semibold text-paper-900">No articles found</h3>
            <p className="mt-1 text-sm text-paper-500">
              Try adjusting your search filters or browse other categories.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-xl border border-paper-100 bg-paper-0 p-6 shadow-sm hover:shadow-md transition-shadow duration-150"
              >
                <div>
                  {/* Category Pill */}
                  <span className="font-mono text-[10px] font-semibold text-brass-700 uppercase tracking-wider block mb-3">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-paper-900 leading-tight group-hover:text-ink-700 font-serif">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="mt-3 text-sm text-paper-500 leading-relaxed font-sans line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Metadata Footer */}
                <div className="mt-6 border-t border-paper-50 pt-4 flex items-center justify-between text-xs text-paper-400">
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar01Icon} size={14} />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} size={14} />
                    <span>{post.readingTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
