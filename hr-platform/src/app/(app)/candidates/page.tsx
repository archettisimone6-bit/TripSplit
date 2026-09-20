import Link from "next/link";
import { prisma } from "@/lib/db";
import { CANDIDATE_SOURCE_LABELS, type CandidateSource } from "@/lib/constants";

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  const candidates = await prisma.candidate.findMany({
    where: query
      ? {
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Candidati</h1>
          <p className="mt-1 text-sm text-slate-500">
            Anagrafica di tutti i candidati registrati.
          </p>
        </div>
        <Link
          href="/candidates/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Nuovo candidato
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Cerca per nome o email..."
          className="form-input max-w-sm"
        />
        <button
          type="submit"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cerca
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {candidates.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Nessun candidato trovato.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Fonte</th>
                <th className="px-6 py-3 font-medium">Candidature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/candidates/${candidate.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {candidate.firstName} {candidate.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {candidate.email}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {CANDIDATE_SOURCE_LABELS[
                      candidate.source as CandidateSource
                    ] ?? candidate.source}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {candidate._count.applications}
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
