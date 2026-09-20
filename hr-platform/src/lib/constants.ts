export const APPLICATION_STAGES = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
] as const;

export type ApplicationStage = (typeof APPLICATION_STAGES)[number];

export const APPLICATION_STAGE_LABELS: Record<ApplicationStage, string> = {
  APPLIED: "Candidatura ricevuta",
  SCREENING: "Screening CV",
  INTERVIEW: "Colloquio",
  OFFER: "Offerta inviata",
  HIRED: "Assunto",
  REJECTED: "Rifiutato",
};

// Stages shown left-to-right on the pipeline board. HIRED and REJECTED are
// terminal outcomes and are rendered together at the end.
export const PIPELINE_COLUMNS: ApplicationStage[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

export function nextStage(stage: ApplicationStage): ApplicationStage | null {
  const order: ApplicationStage[] = [
    "APPLIED",
    "SCREENING",
    "INTERVIEW",
    "OFFER",
    "HIRED",
  ];
  const idx = order.indexOf(stage);
  if (idx === -1 || idx === order.length - 1) return null;
  return order[idx + 1];
}

export const JOB_STATUSES = ["OPEN", "CLOSED", "DRAFT"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  OPEN: "Aperta",
  CLOSED: "Chiusa",
  DRAFT: "Bozza",
};

export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Tempo pieno",
  PART_TIME: "Part-time",
  CONTRACT: "Contratto a termine",
  INTERNSHIP: "Stage/Tirocinio",
};

export const CANDIDATE_SOURCES = [
  "WEBSITE",
  "REFERRAL",
  "LINKEDIN",
  "JOB_BOARD",
  "OTHER",
] as const;
export type CandidateSource = (typeof CANDIDATE_SOURCES)[number];

export const CANDIDATE_SOURCE_LABELS: Record<CandidateSource, string> = {
  WEBSITE: "Sito aziendale",
  REFERRAL: "Segnalazione",
  LINKEDIN: "LinkedIn",
  JOB_BOARD: "Portale annunci",
  OTHER: "Altro",
};
