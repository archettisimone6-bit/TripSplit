import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StageBadge, StatusBadge } from "@/components/badge";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { CopyLink } from "@/components/copy-link";
import { getBaseUrl } from "@/lib/site-url";
import {
  EMPLOYMENT_TYPE_LABELS,
  type ApplicationStage,
  type EmploymentType,
  type JobStatus,
} from "@/lib/constants";
import { deletePosition } from "../actions";

export default async function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const position = await prisma.jobPosition.findUnique({
    where: { id },
    include: {
      applications: {
        orderBy: { updatedAt: "desc" },
        include: { candidate: true },
      },
    },
  });

  if (!position) {
    notFound();
  }

  const deleteWithId = deletePosition.bind(null, position.id);
  const baseUrl = await getBaseUrl();
  const applyLink = `${baseUrl}/candidatura?posizione=${position.id}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {position.title}
            </h1>
            <StatusBadge status={position.status as JobStatus} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {position.department} · {position.location} ·{" "}
            {EMPLOYMENT_TYPE_LABELS[position.employmentType as EmploymentType] ??
              position.employmentType}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/applications/new?positionId=${position.id}`}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Candidatura
          </Link>
          <Link
            href={`/positions/${position.id}/edit`}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Modifica
          </Link>
          <form action={deleteWithId}>
            <ConfirmSubmitButton
              confirmMessage="Eliminare questa posizione e tutte le candidature collegate?"
              className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Elimina
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Modulo di candidatura da condividere
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Invia questo link al candidato: potrà inserire i propri dati da
          solo, senza bisogno di accedere alla piattaforma.
        </p>
        <div className="mt-3">
          <CopyLink url={applyLink} />
        </div>
      </div>

      {position.description && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">Descrizione</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
            {position.description}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Candidature ({position.applications.length})
        </h2>
        {position.applications.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Nessuna candidatura ancora collegata a questa posizione.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {position.applications.map((application) => (
              <li
                key={application.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <Link
                    href={`/applications/${application.id}`}
                    className="text-sm font-medium text-slate-900 hover:underline"
                  >
                    {application.candidate.firstName}{" "}
                    {application.candidate.lastName}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {application.candidate.email}
                  </p>
                </div>
                <StageBadge stage={application.stage as ApplicationStage} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
