"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { requireSession } from "@/lib/auth";
import { CANDIDATE_SOURCES, type CandidateSource } from "@/lib/constants";

function isDuplicateEmailError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function readCandidateForm(formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim();
  const sourceRaw = String(formData.get("source") ?? "");

  if (!firstName || !lastName || !email) {
    throw new Error("Nome, cognome ed email sono obbligatori.");
  }

  const source: CandidateSource = CANDIDATE_SOURCES.includes(
    sourceRaw as CandidateSource
  )
    ? (sourceRaw as CandidateSource)
    : "OTHER";

  return { firstName, lastName, email, phone, linkedinUrl, source };
}

export async function createCandidate(formData: FormData) {
  await requireSession();
  const data = readCandidateForm(formData);

  let candidate;
  try {
    candidate = await prisma.candidate.create({ data });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      redirect("/candidates/new?errore=email-duplicata");
    }
    throw error;
  }

  revalidatePath("/candidates");
  redirect(`/candidates/${candidate.id}`);
}

export async function updateCandidate(id: string, formData: FormData) {
  await requireSession();
  const data = readCandidateForm(formData);

  try {
    await prisma.candidate.update({ where: { id }, data });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      redirect(`/candidates/${id}/edit?errore=email-duplicata`);
    }
    throw error;
  }

  revalidatePath("/candidates");
  revalidatePath(`/candidates/${id}`);
  redirect(`/candidates/${id}`);
}

export async function deleteCandidate(id: string) {
  await requireSession();
  await prisma.candidate.delete({ where: { id } });
  revalidatePath("/candidates");
  redirect("/candidates");
}
