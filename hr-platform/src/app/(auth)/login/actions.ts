"use server";

import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=1");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/login?error=1");
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    redirect("/login?error=1");
  }

  await setSessionCookie(user);
  redirect("/");
}
