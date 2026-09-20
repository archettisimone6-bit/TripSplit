import { prisma } from "@/lib/db";
import { submitPublicApplication } from "./actions";

export default async function CandidaturaPubblicaPage({
  searchParams,
}: {
  searchParams: Promise<{ posizione?: string; errore?: string }>;
}) {
  const { posizione, errore } = await searchParams;

  const positions = await prisma.jobPosition.findMany({
    where: { status: "OPEN" },
    orderBy: { title: "asc" },
  });

  const selectedPosition = positions.find((p) => p.id === posizione);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Vuoi lavorare con noi?
      </h1>
      <p className="mt-3 text-base text-slate-600 sm:text-lg">
        {selectedPosition
          ? `Compila il modulo per candidarti alla posizione "${selectedPosition.title}". Ci vuole un minuto.`
          : "Inserisci i tuoi dati qui sotto. Ci vuole un minuto: ti contatteremo noi appena possibile."}
      </p>

      {errore === "campi" && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-base text-red-700">
          Manca qualche informazione: controlla nome, cognome ed email e
          riprova.
        </p>
      )}

      <form
        action={submitPublicApplication}
        className="mt-8 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Nome" htmlFor="firstName">
            <input
              id="firstName"
              name="firstName"
              required
              autoComplete="given-name"
              placeholder="Es. Maria"
              className="big-input"
            />
          </Field>
          <Field label="Cognome" htmlFor="lastName">
            <input
              id="lastName"
              name="lastName"
              required
              autoComplete="family-name"
              placeholder="Es. Rossi"
              className="big-input"
            />
          </Field>
        </div>

        <Field label="Email" htmlFor="email" hint="Ci serve per ricontattarti.">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="nome@email.com"
            className="big-input"
          />
        </Field>

        <Field
          label="Numero di telefono"
          htmlFor="phone"
          hint="Facoltativo, ma ci aiuta a raggiungerti più in fretta."
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Es. 333 1234567"
            className="big-input"
          />
        </Field>

        <Field label="Per quale posizione ti candidi?" htmlFor="jobPositionId">
          <select
            id="jobPositionId"
            name="jobPositionId"
            defaultValue={selectedPosition?.id ?? ""}
            className="big-input"
          >
            <option value="">Candidatura generica (nessuna posizione specifica)</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.title}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Vuoi aggiungere qualcosa?"
          htmlFor="message"
          hint="Facoltativo."
        >
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Scrivi qui eventuali informazioni utili..."
            className="big-input"
          />
        </Field>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          Invia la mia candidatura
        </button>

        <p className="text-center text-sm text-slate-400">
          I tuoi dati verranno usati solo per la selezione del personale.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-base font-semibold text-slate-800"
      >
        {label}
      </label>
      {hint && <p className="mt-0.5 text-sm text-slate-500">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
