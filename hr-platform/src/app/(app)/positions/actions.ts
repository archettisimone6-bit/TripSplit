"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import {
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  type EmploymentType,
  type JobStatus,
} from "@/lib/constants";

function readPositionForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const employmentTypeRaw = String(formData.get("employmentType") ?? "");
  const statusRaw = String(formData.get("status") ?? "");

  if (!title || !department || !location) {
    throw new Error("Titolo, dipartimento e sede sono obbligatori.");
  }

  const employmentType: EmploymentType = EMPLOYMENT_TYPES.includes(
    employmentTypeRaw as EmploymentType
  )
    ? (employmentTypeRaw as EmploymentType)
    : "FULL_TIME";

  const status: JobStatus = JOB_STATUSES.includes(statusRaw as JobStatus)
    ? (statusRaw as JobStatus)
    : "OPEN";

  return { title, department, location, description, employmentType, status };
}

export async function createPosition(formData: FormData) {
  await requireSession();
  const data = readPositionForm(formData);

  const position = await prisma.jobPosition.create({ data });

  revalidatePath("/positions");
  redirect(`/positions/${position.id}`);
}

export async function updatePosition(id: string, formData: FormData) {
  await requireSession();
  const data = readPositionForm(formData);

  await prisma.jobPosition.update({ where: { id }, data });

  revalidatePath("/positions");
  revalidatePath(`/positions/${id}`);
  redirect(`/positions/${id}`);
}

export async function deletePosition(id: string) {
  await requireSession();
  await prisma.jobPosition.delete({ where: { id } });
  revalidatePath("/positions");
  redirect("/positions");
}
