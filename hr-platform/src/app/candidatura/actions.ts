"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";

export async function submitPublicApplication(formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const jobPositionId = String(formData.get("jobPositionId") ?? "") || null;
  const message = String(formData.get("message") ?? "").trim();

  const backTo = jobPositionId ? `?posizione=${jobPositionId}` : "";

  if (!firstName || !lastName || !email) {
    redirect(`/candidatura${backTo}${backTo ? "&" : "?"}errore=campi`);
  }

  const candidate = await prisma.candidate.upsert({
    where: { email },
    update: {
      firstName,
      lastName,
      phone: phone || undefined,
    },
    create: {
      firstName,
      lastName,
      email,
      phone,
      source: "PUBLIC_FORM",
    },
  });

  if (jobPositionId) {
    const existing = await prisma.application.findUnique({
      where: {
        candidateId_jobPositionId: { candidateId: candidate.id, jobPositionId },
      },
    });

    if (existing) {
      redirect("/candidatura/grazie?duplicato=1");
    }
  }

  const application = await prisma.application.create({
    data: { candidateId: candidate.id, jobPositionId },
  });

  await logActivity({
    applicationId: application.id,
    body: "Candidatura ricevuta tramite modulo pubblico.",
  });

  if (message) {
    await prisma.note.create({
      data: {
        applicationId: application.id,
        kind: "NOTE",
        body: message,
      },
    });
  }

  redirect("/candidatura/grazie");
}
