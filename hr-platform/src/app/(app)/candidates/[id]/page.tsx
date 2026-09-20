import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StageBadge } from "@/components/badge";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { CANDIDATE_SOURCE_LABELS, type ApplicationStage, type CandidateSource } from "@/lib/constants";
import { deleteCandidate } from "../actions";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      applications: {
        orderBy: { updatedAt: "desc" },
        include: { jobPosition: true },
      },
    },
  });

  if (!candidate) {
    notFound();
  }

  const deleteWithId = deleteCandidate.bind(null, candidate.id);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {candidate.firstName} {candidate.lastName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{candidate.email}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/applications/new?candidateId=${candidate.id}`}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + Candidatura
          </Link>
          <Link
            href={`/candidates/${candidate.id}/edit`}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Modifica
          </Link>
          <form action={deleteWithId}>
            <ConfirmSubmitButton
              confirmMessage="Eliminare questo candidato e tutte le sue candidature?"
              className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Elimina
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">Contatti</h2>
        <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Telefono</dt>
            <dd className="text-slate-900">{candidate.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">LinkedIn</dt>
            <dd className="text-slate-900">
              {candidate.linkedinUrl ? (
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {candidate.linkedinUrl}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Fonte</dt>
            <dd className="text-slate-900">
              {CANDIDATE_SOURCE_LABELS[candidate.source as CandidateSource] ??
                candidate.source}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Candidature ({candidate.applications.length})
        </h2>
        {candidate.applications.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Questo candidato non è ancora collegato a nessuna posizione.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {candidate.applications.map((application) => (
              <li
                key={application.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <Link
                    href={`/applications/${application.id}`}
                    className="text-sm font-medium text-slate-900 hover:underline"
                  >
                    {application.jobPosition?.title ?? "Candidatura spontanea"}
                  </Link>
                  {application.jobPosition && (
                    <p className="text-xs text-slate-500">
                      {application.jobPosition.department}
                    </p>
                  )}
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
