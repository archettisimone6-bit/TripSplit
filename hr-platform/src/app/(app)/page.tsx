import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  APPLICATION_STAGE_LABELS,
  PIPELINE_COLUMNS,
  type ApplicationStage,
} from "@/lib/constants";
import { StageBadge } from "@/components/badge";
import { CopyLink } from "@/components/copy-link";
import { getBaseUrl } from "@/lib/site-url";

export default async function DashboardPage() {
  const [openPositions, totalCandidates, stageCounts, recentApplications] =
    await Promise.all([
      prisma.jobPosition.count({ where: { status: "OPEN" } }),
      prisma.candidate.count(),
      prisma.application.groupBy({
        by: ["stage"],
        _count: { _all: true },
      }),
      prisma.application.findMany({
        orderBy: { updatedAt: "desc" },
        take: 8,
        include: { candidate: true, jobPosition: true },
      }),
    ]);

  const countByStage = Object.fromEntries(
    stageCounts.map((row) => [row.stage, row._count._all])
  ) as Record<ApplicationStage, number>;
  const totalApplications = stageCounts.reduce(
    (sum, row) => sum + row._count._all,
    0
  );
  const hiredCount = countByStage.HIRED ?? 0;
  const baseUrl = await getBaseUrl();
  const publicApplyLink = `${baseUrl}/candidatura`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Panoramica delle posizioni aperte e del processo di selezione.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Modulo di candidatura pubblico
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Condividi questo link con chi vuole candidarsi: potrà inserire i
          propri dati da solo, senza account. Per una posizione specifica,
          usa il link dedicato nella sua pagina.
        </p>
        <div className="mt-3">
          <CopyLink url={publicApplyLink} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Posizioni aperte" value={openPositions} href="/positions" />
        <StatCard label="Candidati totali" value={totalCandidates} href="/candidates" />
        <StatCard
          label="Candidature attive"
          value={totalApplications - hiredCount - (countByStage.REJECTED ?? 0)}
          href="/pipeline"
        />
        <StatCard label="Assunzioni" value={hiredCount} href="/pipeline" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Candidature per fase
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PIPELINE_COLUMNS.map((stage) => (
            <div key={stage} className="rounded-lg bg-slate-50 p-3">
              <p className="text-2xl font-semibold text-slate-900">
                {countByStage[stage] ?? 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {APPLICATION_STAGE_LABELS[stage]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Candidature recenti
          </h2>
          <Link
            href="/pipeline"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Vedi la pipeline →
          </Link>
        </div>
        {recentApplications.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Nessuna candidatura registrata finora.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {recentApplications.map((application) => (
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
                    {application.jobPosition?.title ?? "Candidatura spontanea"}
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

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
    >
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </Link>
  );
}
