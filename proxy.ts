import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const protectedPaths = ["/dashboard", "/generator", "/coach", "/applications"];
const authPaths = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );
  const isAuthPath = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  if (!isProtected && !isAuthPath) {
    return NextResponse.next();
  }

  const session = await getSession(request);

  // Redirect logged-in users away from login/register
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login/:path*",
    "/register/:path*",
    "/dashboard/:path*",
    "/generator/:path*",
    "/coach/:path*",
    "/applications/:path*",
  ],
};
