import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "CareerSaathi — Your AI Career Companion",
    template: "%s | CareerSaathi",
  },
  description:
    "An AI-powered career coach that reviews job postings, generates tailored cover letters and resume bullets, and runs live mock interviews scoped to your target role.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        newsreader.variable,
      )}>
      <body className="min-h-full flex flex-col font-sans bg-paper-50">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        {/* Footer Section */}
        <footer className="bg-paper-0 border-t border-paper-100 py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-paper-500">
            <div className="flex items-center gap-2 text-paper-900 font-bold font-serif text-lg">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink-700 text-paper-0">
                C
              </span>
              CareerSaathi
            </div>

            <div className="flex flex-wrap gap-8 justify-center">
              <Link href="/jobs" className="hover:text-ink-700 font-medium">
                Find Jobs
              </Link>
              <Link href="/blog" className="hover:text-ink-700 font-medium">
                Blog
              </Link>
              <Link href="/about" className="hover:text-ink-700 font-medium">
                About
              </Link>
              <Link href="/privacy" className="hover:text-ink-700 font-medium">
                Privacy Policy
              </Link>
            </div>

            <div className="font-mono text-xs text-paper-400">
              &copy; {new Date().getFullYear()} CareerSaathi. All rights
              reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
