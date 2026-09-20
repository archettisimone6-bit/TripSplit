import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/badge";
import {
  EMPLOYMENT_TYPE_LABELS,
  JOB_STATUSES,
  type EmploymentType,
  type JobStatus,
} from "@/lib/constants";

export default async function PositionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter =
    status && JOB_STATUSES.includes(status as JobStatus)
      ? (status as JobStatus)
      : undefined;

  const positions = await prisma.jobPosition.findMany({
    where: filter ? { status: filter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Posizioni aperte
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestisci gli annunci di lavoro e collega le candidature ricevute.
          </p>
        </div>
        <Link
          href="/positions/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Nuova posizione
        </Link>
      </div>

      <div className="flex gap-2">
        <FilterLink label="Tutte" href="/positions" active={!filter} />
        {JOB_STATUSES.map((s) => (
          <FilterLink
            key={s}
            label={s === "OPEN" ? "Aperte" : s === "CLOSED" ? "Chiuse" : "Bozze"}
            href={`/positions?status=${s}`}
            active={filter === s}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {positions.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Nessuna posizione trovata.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Titolo</th>
                <th className="px-6 py-3 font-medium">Dipartimento</th>
                <th className="px-6 py-3 font-medium">Sede</th>
                <th className="px-6 py-3 font-medium">Contratto</th>
                <th className="px-6 py-3 font-medium">Candidature</th>
                <th className="px-6 py-3 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {positions.map((position) => (
                <tr key={position.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/positions/${position.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {position.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {position.department}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {position.location}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {EMPLOYMENT_TYPE_LABELS[
                      position.employmentType as EmploymentType
                    ] ?? position.employmentType}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {position._count.applications}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={position.status as JobStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FilterLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
        active
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}
