import { PositionForm } from "../position-form";
import { createPosition } from "../actions";

export default function NewPositionPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">
        Nuova posizione aperta
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Crea un nuovo annuncio interno da collegare alle candidature.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <PositionForm action={createPosition} submitLabel="Crea posizione" />
      </div>
    </div>
  );
}
