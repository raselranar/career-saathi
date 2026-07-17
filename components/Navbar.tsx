import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NavbarClient } from "./NavbarClient";
import { Session } from "@/lib/types";

export async function Navbar() {
  const sessionData: Session = await auth.api.getSession({
    headers: await headers(),
  });

  return <NavbarClient initialSessionData={sessionData} />;
}
