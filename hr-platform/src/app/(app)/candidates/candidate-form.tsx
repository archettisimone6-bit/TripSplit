import { CANDIDATE_SOURCES, CANDIDATE_SOURCE_LABELS } from "@/lib/constants";

type CandidateFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  source: string;
};

export function CandidateForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: Partial<CandidateFormValues>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome" htmlFor="firstName">
          <input
            id="firstName"
            name="firstName"
            required
            defaultValue={defaultValues?.firstName}
            className="form-input"
          />
        </Field>
        <Field label="Cognome" htmlFor="lastName">
          <input
            id="lastName"
            name="lastName"
            required
            defaultValue={defaultValues?.lastName}
            className="form-input"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={defaultValues?.email}
            className="form-input"
          />
        </Field>
        <Field label="Telefono" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            defaultValue={defaultValues?.phone}
            className="form-input"
          />
        </Field>
        <Field label="Profilo LinkedIn" htmlFor="linkedinUrl">
          <input
            id="linkedinUrl"
            name="linkedinUrl"
            defaultValue={defaultValues?.linkedinUrl}
            className="form-input"
            placeholder="https://linkedin.com/in/..."
          />
        </Field>
        <Field label="Fonte" htmlFor="source">
          <select
            id="source"
            name="source"
            defaultValue={defaultValues?.source ?? "OTHER"}
            className="form-input"
          >
            {CANDIDATE_SOURCES.map((source) => (
              <option key={source} value={source}>
                {CANDIDATE_SOURCE_LABELS[source]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button
        type="submit"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
