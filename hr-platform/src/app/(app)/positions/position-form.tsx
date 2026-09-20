import {
  EMPLOYMENT_TYPES,
  EMPLOYMENT_TYPE_LABELS,
  JOB_STATUSES,
  JOB_STATUS_LABELS,
} from "@/lib/constants";

type PositionFormValues = {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  description: string;
};

export function PositionForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: Partial<PositionFormValues>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Titolo posizione" htmlFor="title">
          <input
            id="title"
            name="title"
            required
            defaultValue={defaultValues?.title}
            className="form-input"
          />
        </Field>
        <Field label="Dipartimento" htmlFor="department">
          <input
            id="department"
            name="department"
            required
            defaultValue={defaultValues?.department}
            className="form-input"
          />
        </Field>
        <Field label="Sede" htmlFor="location">
          <input
            id="location"
            name="location"
            required
            defaultValue={defaultValues?.location}
            className="form-input"
          />
        </Field>
        <Field label="Tipo di contratto" htmlFor="employmentType">
          <select
            id="employmentType"
            name="employmentType"
            defaultValue={defaultValues?.employmentType ?? "FULL_TIME"}
            className="form-input"
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {EMPLOYMENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Stato" htmlFor="status">
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "OPEN"}
            className="form-input"
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {JOB_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Descrizione e requisiti" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={defaultValues?.description}
          className="form-input"
          placeholder="Responsabilità, requisiti, benefit..."
        />
      </Field>

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
