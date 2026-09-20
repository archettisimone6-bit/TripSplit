import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "hr_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: string;
  name: string;
  email: string;
  role: string;
  exp: number;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return value;
}

function base64url(input: Buffer) {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(data: string) {
  return base64url(createHmac("sha256", secret()).update(data).digest());
}

export function createSessionCookieValue(
  payload: Omit<SessionPayload, "exp">
) {
  const full: SessionPayload = {
    ...payload,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const body = base64url(Buffer.from(JSON.stringify(full)));
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySessionCookieValue(
  value: string | undefined
): SessionPayload | null {
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (
    expectedBuf.length !== actualBuf.length ||
    !timingSafeEqual(expectedBuf, actualBuf)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64").toString("utf-8")
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, SESSION_TTL_MS };
