import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
import { setJwtCookie } from "@/lib/utils";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [jwtClient()],
  fetchOptions: {
    onSuccess: (ctx) => {
      const jwt = ctx.response.headers.get("set-auth-jwt");
      if (jwt) setJwtCookie(jwt);
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
