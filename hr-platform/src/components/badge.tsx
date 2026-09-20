import {
  APPLICATION_STAGE_LABELS,
  JOB_STATUS_LABELS,
  type ApplicationStage,
  type JobStatus,
} from "@/lib/constants";

const STAGE_COLORS: Record<ApplicationStage, string> = {
  APPLIED: "bg-slate-100 text-slate-700",
  SCREENING: "bg-sky-100 text-sky-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  OFFER: "bg-purple-100 text-purple-700",
  HIRED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const STATUS_COLORS: Record<JobStatus, string> = {
  OPEN: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-200 text-slate-600",
  DRAFT: "bg-amber-100 text-amber-700",
};

export function StageBadge({ stage }: { stage: ApplicationStage }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_COLORS[stage]}`}
    >
      {APPLICATION_STAGE_LABELS[stage]}
    </span>
  );
}

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}
