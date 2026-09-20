import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionCookieValue,
  verifySessionCookieValue,
  type SessionPayload,
} from "@/lib/session";

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionCookieValue(store.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function setSessionCookie(user: {
  id: string;
  name: string;
  email: string;
  role: string;
}) {
  const store = await cookies();
  const value = createSessionCookieValue({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  store.set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
