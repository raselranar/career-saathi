import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const JWT_MAX_AGE = 7 * 24 * 60 * 60;

export function setJwtCookie(token: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `jwt=${token}; path=/; SameSite=Lax; max-age=${JWT_MAX_AGE}${secure}`;
}

export function clearJwtCookie() {
  document.cookie = "jwt=; path=/; max-age=0";
}
