"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";

function readYesNo(formData: FormData, name: string): boolean | null {
  const value = String(formData.get(name) ?? "");
  if (value === "yes") return true;
  if (value === "no") return false;
  return null;
}

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function submitQuestionnaire(
  applicationId: string,
  formData: FormData
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    redirect("/questionario/grazie");
  }

  const data = {
    playsSport: readYesNo(formData, "playsSport"),
    sportDetails: readText(formData, "sportDetails"),
    hobbies: readText(formData, "hobbies"),
    countriesVisited: readText(formData, "countriesVisited"),
    iseoFavorite1: readText(formData, "iseoFavorite1"),
    iseoFavorite2: readText(formData, "iseoFavorite2"),
    iseoFavorite3: readText(formData, "iseoFavorite3"),
    manualSkills: readText(formData, "manualSkills"),
    manualSkillsIsSatisfying: readYesNo(formData, "manualSkillsIsSatisfying"),
    hasDrivingLicenseAndVehicle: readYesNo(
      formData,
      "hasDrivingLicenseAndVehicle"
    ),
    availableFrom: readText(formData, "availableFrom"),
    workPreference: readText(formData, "workPreference"),
    motivation: readText(formData, "motivation"),
    languages: readText(formData, "languages"),
    priorExperience: readText(formData, "priorExperience"),
  };

  const alreadyFilled = await prisma.candidateProfile.findUnique({
    where: { applicationId },
  });

  await prisma.candidateProfile.upsert({
    where: { applicationId },
    update: data,
    create: { applicationId, ...data },
  });

  if (!alreadyFilled) {
    await logActivity({
      applicationId,
      body: "Questionario conoscitivo compilato dal candidato.",
    });
  }

  redirect("/questionario/grazie");
}
