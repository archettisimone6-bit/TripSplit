import { CandidateForm } from "../candidate-form";
import { createCandidate } from "../actions";

export default function NewCandidatePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Nuovo candidato</h1>
      <p className="mt-1 text-sm text-slate-500">
        Registra un candidato in anagrafica. Potrai collegarlo a una o più
        posizioni dalla sua scheda.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <CandidateForm action={createCandidate} submitLabel="Crea candidato" />
      </div>
    </div>
  );
}
