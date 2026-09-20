import { prisma } from "@/lib/db";

// Logs an automatic timeline entry ("ACTIVITY") on an application, as
// opposed to a manual note written by staff ("NOTE", the default kind).
// authorId is left null for system/candidate-triggered events (e.g. a
// submission through the public application form).
export async function logActivity({
  applicationId,
  authorId,
  body,
}: {
  applicationId: string;
  authorId?: string | null;
  body: string;
}) {
  await prisma.note.create({
    data: {
      applicationId,
      authorId: authorId ?? null,
      kind: "ACTIVITY",
      body,
    },
  });
}
