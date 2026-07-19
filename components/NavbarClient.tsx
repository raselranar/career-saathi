"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Menu01Icon,
  Cancel01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { authClient, useSession } from "@/lib/auth-client";
import { clearJwtCookie } from "@/lib/utils";
import { toast } from "sonner";
import LinkComponent from "next/link";
import { Button } from "@/components/ui/button";

export function NavbarClient() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const user = session?.user;

  async function handleLogout() {
    try {
      await authClient.signOut();
      clearJwtCookie();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
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
          <div className="flex items-center gap-8 min-w-0 shrink">
            <LinkComponent
              href="/"
              className="flex items-center gap-2 font-serif text-xl font-bold text-paper-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-700 text-paper-0">
                <HugeiconsIcon icon={Briefcase01Icon} size={18} />
              </span>
              <span>CareerSaathi</span>
            </LinkComponent>

            {/* Desktop Navigation Links */}
            <div className="hidden min-[950px]:flex items-center gap-4 text-sm whitespace-nowrap shrink">
              {publicNav.map((link) => (
                <LinkComponent
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? activeCls : inactiveCls}>
                  {link.label}
                </LinkComponent>
              ))}

              {user && (
                <>
                  <span className="h-4 w-px bg-paper-200" />
                  {privateNav.map((link) => (
                    <LinkComponent
                      key={link.href}
                      href={link.href}
                      className={
                        pathname === link.href ||
                        pathname.startsWith(link.href + "/")
                          ? activeCls
                          : inactiveCls
                      }>
                      {link.label}
                    </LinkComponent>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Desktop Right Controls (Auth buttons) */}
          <div className="hidden min-[950px]:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-paper-500 font-mono">
                  {user.name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5">
                  <HugeiconsIcon icon={Logout01Icon} size={14} />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="h-9 px-4 text-xs font-semibold text-paper-700 hover:text-ink-700">
                  <LinkComponent href="/login">Sign In</LinkComponent>
                </Button>
                <Button
                  asChild
                  className="h-9 rounded-lg bg-ink-700 px-4 text-xs font-semibold text-paper-0 hover:bg-ink-500">
                  <LinkComponent href="/register">Register</LinkComponent>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex min-[950px]:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}>
              <HugeiconsIcon
                icon={isOpen ? Cancel01Icon : Menu01Icon}
                size={18}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-t border-paper-100 bg-paper-0 py-4 px-6 min-[950px]:hidden shadow-lg space-y-4">
          <div className="flex flex-col gap-3 text-sm">
            {publicNav.map((link) => (
              <LinkComponent
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={pathname === link.href ? activeCls : inactiveCls}>
                {link.label}
              </LinkComponent>
            ))}

            {user && (
              <>
                <div className="h-px bg-paper-100 my-1" />
                {privateNav.map((link) => (
                  <LinkComponent
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={
                      pathname === link.href ||
                      pathname.startsWith(link.href + "/")
                        ? activeCls
                        : inactiveCls
                    }>
                    {link.label}
                  </LinkComponent>
                ))}
              </>
            )}
          </div>

          <div className="border-t border-paper-100 pt-4 flex flex-col gap-2">
            {user ? (
              <>
                <div className="text-xs text-paper-500 font-mono mb-1">
                  Logged in: {user.name || user.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center gap-1.5"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}>
                  <HugeiconsIcon icon={Logout01Icon} size={14} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 w-full rounded-lg text-xs font-semibold text-paper-700">
                  <LinkComponent href="/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </LinkComponent>
                </Button>
                <Button
                  asChild
                  className="h-10 w-full rounded-lg bg-ink-700 text-xs font-semibold text-paper-0">
                  <LinkComponent
                    href="/register"
                    onClick={() => setIsOpen(false)}>
                    Register
                  </LinkComponent>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
