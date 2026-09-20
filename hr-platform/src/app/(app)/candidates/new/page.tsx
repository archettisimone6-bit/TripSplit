import { CandidateForm } from "../candidate-form";
import { createCandidate } from "../actions";

export default async function NewCandidatePage({
  searchParams,
}: {
  searchParams: Promise<{ errore?: string }>;
}) {
  const { errore } = await searchParams;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Nuovo candidato</h1>
      <p className="mt-1 text-sm text-slate-500">
        Registra un candidato in anagrafica. Potrai collegarlo a una o più
        posizioni dalla sua scheda.
      </p>

      {errore === "email-duplicata" && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Esiste già un candidato con questa email.
        </p>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <CandidateForm action={createCandidate} submitLabel="Crea candidato" />
      </div>
    </div>
  );
}
