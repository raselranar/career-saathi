"use client";

import { useState, useEffect } from "react";
import Link from "next/navigation"; // Wait, Next.js link should be import Link from "next/link"; Let's fix that!
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Menu01Icon,
  Cancel01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/auth-client";

import LinkComponent from "next/link";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isPending, setIsPending] = useState(true);

  // Monitor auth state changes using Better Auth client
  useEffect(() => {
    async function fetchSession() {
      try {
        const { data } = await authClient.useSession();
        setSession(data);
      } catch {
        setSession(null);
      } finally {
        setIsPending(false);
      }
    }
    fetchSession();

    // Subscribe to session updates
    const { data: sub } = authClient.useSession();
    if (sub) {
      setSession(sub);
    }
  }, []);

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const activeCls = "text-ink-700 font-semibold";
  const inactiveCls = "text-paper-600 hover:text-ink-700 font-medium";

  const publicNav = [
    { label: "Home", href: "/" },
    { label: "Find Jobs", href: "/jobs" },
    { label: "Blog", href: "/blog" },
  ];

  const privateNav = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Job Tracker", href: "/applications/manage" },
    { label: "AI Generator", href: "/generator" },
    { label: "AI Coach", href: "/coach" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-paper-100 bg-paper-0/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-8">
            <LinkComponent href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-paper-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-700 text-paper-0">
                <HugeiconsIcon icon={Briefcase01Icon} size={18} />
              </span>
              <span>CareerSaathi</span>
            </LinkComponent>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              {publicNav.map((link) => (
                <LinkComponent
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? activeCls : inactiveCls}
                >
                  {link.label}
                </LinkComponent>
              ))}

              {!isPending && session && (
                <>
                  <span className="h-4 w-px bg-paper-200" />
                  {privateNav.map((link) => (
                    <LinkComponent
                      key={link.href}
                      href={link.href}
                      className={
                        pathname === link.href || pathname.startsWith(link.href + "/")
                          ? activeCls
                          : inactiveCls
                      }
                    >
                      {link.label}
                    </LinkComponent>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Desktop Right Controls (Auth buttons) */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="h-9 w-24 animate-pulse rounded-lg bg-paper-100" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-paper-500 font-mono">
                  {session.user.name || session.user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-paper-300 bg-paper-0 px-4 text-xs font-semibold text-paper-700 transition-colors hover:bg-paper-50"
                >
                  <HugeiconsIcon icon={Logout01Icon} size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <LinkComponent
                  href="/login"
                  className="flex h-9 items-center justify-center px-4 text-xs font-semibold text-paper-700 hover:text-ink-700"
                >
                  Sign In
                </LinkComponent>
                <LinkComponent
                  href="/register"
                  className="flex h-9 items-center justify-center rounded-lg bg-ink-700 px-4 text-xs font-semibold text-paper-0 transition-colors hover:bg-ink-500"
                >
                  Register
                </LinkComponent>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-paper-200 bg-paper-0 text-paper-500 hover:text-ink-700"
            >
              <HugeiconsIcon icon={isOpen ? Cancel01Icon : Menu01Icon} size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-t border-paper-100 bg-paper-0 py-4 px-6 md:hidden shadow-lg space-y-4">
          <div className="flex flex-col gap-3 text-sm">
            {publicNav.map((link) => (
              <LinkComponent
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={pathname === link.href ? activeCls : inactiveCls}
              >
                {link.label}
              </LinkComponent>
            ))}

            {!isPending && session && (
              <>
                <div className="h-px bg-paper-100 my-1" />
                {privateNav.map((link) => (
                  <LinkComponent
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={
                      pathname === link.href || pathname.startsWith(link.href + "/")
                        ? activeCls
                        : inactiveCls
                    }
                  >
                    {link.label}
                  </LinkComponent>
                ))}
              </>
            )}
          </div>

          <div className="border-t border-paper-100 pt-4 flex flex-col gap-2">
            {!isPending && session ? (
              <>
                <div className="text-xs text-paper-500 font-mono mb-1">
                  Logged in: {session.user.name || session.user.email}
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-paper-300 bg-paper-0 text-xs font-semibold text-paper-700"
                >
                  <HugeiconsIcon icon={Logout01Icon} size={14} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <LinkComponent
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-full items-center justify-center rounded-lg border border-paper-300 bg-paper-0 text-xs font-semibold text-paper-700"
                >
                  Sign In
                </LinkComponent>
                <LinkComponent
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-ink-700 text-xs font-semibold text-paper-0"
                >
                  Register
                </LinkComponent>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
