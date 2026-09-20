import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CandidateForm } from "../../candidate-form";
import { updateCandidate } from "../../actions";

export default async function EditCandidatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ errore?: string }>;
}) {
  const { id } = await params;
  const { errore } = await searchParams;
  const candidate = await prisma.candidate.findUnique({ where: { id } });

  if (!candidate) {
    notFound();
  }

  const updateWithId = updateCandidate.bind(null, candidate.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">
        Modifica candidato
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {candidate.firstName} {candidate.lastName}
      </p>

      {errore === "email-duplicata" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Esiste già un altro candidato con questa email.
        </p>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <CandidateForm
          action={updateWithId}
          defaultValues={candidate}
          submitLabel="Salva modifiche"
        />
      </div>
    </div>
  );
}
