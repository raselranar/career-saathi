import { jwtVerify, createRemoteJWKSet } from "jose";
import { NextRequest } from "next/server";

const JWKS_URL = new URL(
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/jwks`,
);

const jwks = createRemoteJWKSet(JWKS_URL);

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

function extractJwt(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookie = request.headers.get("cookie");
  const match = cookie?.match(/(?:^|;\s*)jwt=([^;]*)/);
  if (match) return decodeURIComponent(match[1]);

  return null;
}

async function verifyJwt(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: process.env.NEXT_PUBLIC_APP_URL,
      audience: process.env.NEXT_PUBLIC_APP_URL,
    });

    return {
      user: {
        id: payload.sub as string,
        name: (payload.name as string) || "",
        email: (payload.email as string) || "",
        image: payload.image as string | undefined,
      },
    };
  } catch {
    return null;
  }
}

function isBrowserNavigation(request: NextRequest): boolean {
  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/html")) return true;

  const dest = request.headers.get("sec-fetch-dest") || "";
  if (dest === "document") return true;

  return false;
}

export async function getSession(request: NextRequest): Promise<Session | null> {
  const token = extractJwt(request);
  if (!token) return null;
  return verifyJwt(token);
}

export async function requireSession(request: NextRequest): Promise<Session | null> {
  if (isBrowserNavigation(request)) return null;
  return getSession(request);
}
