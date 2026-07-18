"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, authClient } from "@/lib/auth-client";
import { setJwtCookie } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Loading02Icon, User02Icon } from "@hugeicons/core-free-icons";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl") || "/dashboard";
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema as never) as Resolver<LoginForm>,
  });

  async function fetchAndStoreJwt() {
    try {
      await authClient.getSession({
        fetchOptions: {
          onSuccess: (ctx) => {
            const jwt = ctx.response.headers.get("set-auth-jwt");
            if (jwt) setJwtCookie(jwt);
          },
        },
      });
    } catch {}
  }

  async function onSubmit(data: LoginForm) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password");
      } else {
        await fetchAndStoreJwt();
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDemoLogin() {
    setIsDemoLoading(true);
    setError(null);

    try {
      const result = await signIn.email({
        email: "demo@careersaathi.app",
        password: "demo123456",
      });

      if (result.error) {
        setError("Demo account not available. Please seed the database first.");
      } else {
        await fetchAndStoreJwt();
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDemoLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-semibold text-ink-700 tracking-tight">
              Career<span className="text-coral-500">Saathi</span>
            </h1>
          </Link>
          <p className="mt-2 text-sm text-paper-500">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-paper-100 bg-paper-0 p-8 shadow-sm">
          {/* Error message */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-coral-200 bg-coral-50 p-3 text-sm text-coral-700">
              <HugeiconsIcon icon={AlertCircleIcon} size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-paper-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-paper-300 bg-paper-0 px-3 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-sm text-coral-700">
                  <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-paper-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-paper-300 bg-paper-0 px-3 text-base text-paper-900 placeholder:text-paper-500 focus:border-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-500/20"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 flex items-center gap-1 text-sm text-coral-700">
                  <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}>
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <HugeiconsIcon icon={Loading02Icon} size={16} className="animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-paper-100" />
            <span className="text-xs text-paper-500">or</span>
            <div className="h-px flex-1 bg-paper-100" />
          </div>

          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={handleGoogleSignIn}>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Demo Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
            className="mt-3 h-11 w-full rounded-lg border-brass-200 bg-brass-50 text-sm font-medium text-brass-700 hover:bg-brass-200/40 disabled:bg-paper-100 disabled:text-paper-500 gap-2">
            {isDemoLoading ? (
              <span className="inline-flex items-center gap-2">
                <HugeiconsIcon icon={Loading02Icon} size={16} className="animate-spin" />
                Signing in…
              </span>
            ) : (
              <>
                <HugeiconsIcon icon={User02Icon} size={16} />
                Try Demo Account
              </>
            )}
          </Button>
        </div>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-paper-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-ink-700 underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
