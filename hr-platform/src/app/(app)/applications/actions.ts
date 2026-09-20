"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { APPLICATION_STAGES, type ApplicationStage } from "@/lib/constants";

export async function createApplication(formData: FormData) {
  await requireSession();

  const candidateId = String(formData.get("candidateId") ?? "");
  const jobPositionId = String(formData.get("jobPositionId") ?? "");

  if (!candidateId || !jobPositionId) {
    throw new Error("Seleziona un candidato e una posizione.");
  }

  const existing = await prisma.application.findUnique({
    where: {
      candidateId_jobPositionId: { candidateId, jobPositionId },
    },
  });

  if (existing) {
    redirect(`/applications/${existing.id}`);
  }

  const application = await prisma.application.create({
    data: { candidateId, jobPositionId },
  });

  revalidatePath("/pipeline");
  revalidatePath(`/positions/${jobPositionId}`);
  revalidatePath(`/candidates/${candidateId}`);
  redirect(`/applications/${application.id}`);
}

export async function updateApplicationStage(
  id: string,
  stage: ApplicationStage
) {
  await requireSession();

  if (!APPLICATION_STAGES.includes(stage)) {
    throw new Error("Fase non valida.");
  }

  const application = await prisma.application.update({
    where: { id },
    data: { stage },
  });

  revalidatePath("/pipeline");
  revalidatePath(`/applications/${id}`);
  revalidatePath(`/positions/${application.jobPositionId}`);
  revalidatePath(`/candidates/${application.candidateId}`);
  revalidatePath("/");
}

export async function updateApplicationRating(id: string, formData: FormData) {
  await requireSession();

  const raw = String(formData.get("rating") ?? "");
  const rating = raw === "" ? null : Math.min(5, Math.max(1, Number(raw)));

  await prisma.application.update({
    where: { id },
    data: { rating },
  });

  revalidatePath(`/applications/${id}`);
}

export async function addApplicationNote(id: string, formData: FormData) {
  const session = await requireSession();

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await prisma.note.create({
    data: {
      applicationId: id,
      authorId: session.userId,
      body,
    },
  });

  revalidatePath(`/applications/${id}`);
}

export async function deleteApplication(id: string) {
  await requireSession();
  const application = await prisma.application.delete({ where: { id } });

  revalidatePath("/pipeline");
  revalidatePath(`/positions/${application.jobPositionId}`);
  revalidatePath(`/candidates/${application.candidateId}`);
  redirect(`/positions/${application.jobPositionId}`);
}
