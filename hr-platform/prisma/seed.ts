import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL ?? "admin@example.com"
  ).toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "change-me";
  const adminName = process.env.SEED_ADMIN_NAME ?? "Admin";

  // Wipe demo data so the seed can be re-run safely during development.
  await prisma.note.deleteMany();
  await prisma.application.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.jobPosition.deleteMany();

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      role: "ADMIN",
      passwordHash: await hash(adminPassword, 10),
    },
  });

  const [backend, designer] = await Promise.all([
    prisma.jobPosition.create({
      data: {
        title: "Backend Engineer",
        department: "Ingegneria",
        location: "Milano (ibrido)",
        employmentType: "FULL_TIME",
        status: "OPEN",
        description:
          "Cerchiamo un backend engineer con esperienza in Node.js e database relazionali per rafforzare il team piattaforma.",
      },
    }),
    prisma.jobPosition.create({
      data: {
        title: "Product Designer",
        department: "Design",
        location: "Remoto",
        employmentType: "FULL_TIME",
        status: "OPEN",
        description:
          "Product designer con esperienza in design system e ricerca utente per i prodotti consumer dell'azienda.",
      },
    }),
    prisma.jobPosition.create({
      data: {
        title: "Sales Intern",
        department: "Vendite",
        location: "Roma",
        employmentType: "INTERNSHIP",
        status: "DRAFT",
        description: "Stage semestrale nel team commerciale.",
      },
    }),
  ]);

  const candidates = await Promise.all(
    [
      { firstName: "Giulia", lastName: "Bianchi", email: "giulia.bianchi@example.com", source: "LINKEDIN" },
      { firstName: "Marco", lastName: "Rossi", email: "marco.rossi@example.com", source: "REFERRAL" },
      { firstName: "Elena", lastName: "Conti", email: "elena.conti@example.com", source: "WEBSITE" },
      { firstName: "Luca", lastName: "Ferrari", email: "luca.ferrari@example.com", source: "JOB_BOARD" },
      { firstName: "Sara", lastName: "Greco", email: "sara.greco@example.com", source: "LINKEDIN" },
    ].map((c) =>
      prisma.candidate.create({
        data: { ...c, phone: "+39 333 0000000" },
      })
    )
  );

  const [giulia, marco, elena, luca, sara] = candidates;

  const applications = await Promise.all([
    prisma.application.create({
      data: {
        candidateId: giulia.id,
        jobPositionId: backend.id,
        stage: "INTERVIEW",
        rating: 4,
      },
    }),
    prisma.application.create({
      data: {
        candidateId: marco.id,
        jobPositionId: backend.id,
        stage: "SCREENING",
      },
    }),
    prisma.application.create({
      data: {
        candidateId: elena.id,
        jobPositionId: designer.id,
        stage: "OFFER",
        rating: 5,
      },
    }),
    prisma.application.create({
      data: {
        candidateId: luca.id,
        jobPositionId: designer.id,
        stage: "APPLIED",
      },
    }),
    prisma.application.create({
      data: {
        candidateId: sara.id,
        jobPositionId: backend.id,
        stage: "HIRED",
        rating: 5,
      },
    }),
  ]);

  await prisma.note.create({
    data: {
      applicationId: applications[0].id,
      authorId: admin.id,
      body: "Colloquio tecnico fissato per venerdì con il team backend.",
    },
  });

  await prisma.note.create({
    data: {
      applicationId: applications[2].id,
      authorId: admin.id,
      body: "Ottima prova pratica, offerta inviata via email.",
    },
  });

  await prisma.candidateProfile.create({
    data: {
      applicationId: applications[0].id,
      playsSport: true,
      sportDetails: "Corsa e arrampicata",
      hobbies: "Fotografia, cucina, escursioni in montagna",
      countriesVisited: "Francia, Spagna, Portogallo, Giappone",
      iseoFavorite1: "Il lungolago",
      iseoFavorite2: "La Torre dell'Orologio",
      iseoFavorite3: "Il mercato del venerdì",
      manualSkills: "Piccoli lavori di falegnameria, mi piace molto",
      manualSkillsIsSatisfying: true,
      hasDrivingLicenseAndVehicle: true,
      availableFrom: "Da subito",
      workPreference: "In squadra",
      languages: "Inglese, un po' di francese",
      priorExperience: "3 anni come backend developer in una startup fintech",
      motivation: "Mi piace l'idea di lavorare su un prodotto usato da persone vere, ogni giorno",
    },
  });

  console.log("Seed completato.");
  console.log(`Login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
