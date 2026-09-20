import "server-only";
import { headers } from "next/headers";

// Builds an absolute URL for the current request so links to the public
// application form can be copied and shared outside the app (email, chat),
// without needing a hardcoded production domain.
export async function getBaseUrl() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const proto =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
