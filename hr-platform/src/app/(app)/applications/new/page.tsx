import { prisma } from "@/lib/db";
import { createApplication } from "../actions";

export default async function NewApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ candidateId?: string; positionId?: string }>;
}) {
  const { candidateId, positionId } = await searchParams;

  const [candidates, positions] = await Promise.all([
    prisma.candidate.findMany({ orderBy: { lastName: "asc" } }),
    prisma.jobPosition.findMany({
      where: { status: "OPEN" },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900">
        Collega candidato a posizione
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Crea una nuova candidatura scegliendo un candidato e una posizione
        aperta.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <form action={createApplication} className="space-y-5">
          <div>
            <label
              htmlFor="candidateId"
              className="block text-sm font-medium text-slate-700"
            >
              Candidato
            </label>
            <select
              id="candidateId"
              name="candidateId"
              required
              defaultValue={candidateId ?? ""}
              className="form-input mt-1"
            >
              <option value="" disabled>
                Seleziona un candidato
              </option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.firstName} {candidate.lastName} (
                  {candidate.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="jobPositionId"
              className="block text-sm font-medium text-slate-700"
            >
              Posizione
            </label>
            <select
              id="jobPositionId"
              name="jobPositionId"
              defaultValue={positionId ?? ""}
              className="form-input mt-1"
            >
              <option value="">Candidatura spontanea (nessuna posizione)</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title} · {position.department}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Crea candidatura
          </button>
        </form>
      </div>
    </div>
  );
}
