export default async function CandidaturaInviataPage({
  searchParams,
}: {
  searchParams: Promise<{ duplicato?: string }>;
}) {
  const { duplicato } = await searchParams;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-emerald-600"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">
        Candidatura inviata!
      </h1>

      <p className="mt-3 text-lg text-slate-600">
        {duplicato
          ? "Avevi già inviato una candidatura per questa posizione. Ti contatteremo appena possibile."
          : "Grazie per il tuo interesse. Abbiamo ricevuto i tuoi dati e ti ricontatteremo appena possibile."}
      </p>

      <p className="mt-8 text-sm text-slate-400">
        Puoi chiudere questa pagina.
      </p>
    </div>
  );
}
