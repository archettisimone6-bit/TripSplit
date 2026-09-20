import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { submitQuestionnaire } from "./actions";

function yesNoDefault(value: boolean | null | undefined) {
  if (value === true) return "yes";
  if (value === false) return "no";
  return "";
}

export default async function QuestionarioPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { candidate: true, profile: true },
  });

  if (!application) {
    notFound();
  }

  const profile = application.profile;
  const submitWithId = submitQuestionnaire.bind(null, applicationId);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Facci conoscere meglio {application.candidate.firstName}!
      </h1>
      <p className="mt-3 text-base text-slate-600 sm:text-lg">
        Qualche domanda in più per conoscerti meglio. Rispondi solo a quello
        che vuoi: nessun campo è obbligatorio.
      </p>

      <form action={submitWithId} className="mt-8 space-y-8">
        <Section title="Interessi e tempo libero">
          <YesNoField
            label="Fai sport?"
            name="playsSport"
            defaultValue={yesNoDefault(profile?.playsSport)}
          />
          <Field label="Se sì, quale?" htmlFor="sportDetails">
            <input
              id="sportDetails"
              name="sportDetails"
              defaultValue={profile?.sportDetails}
              className="big-input"
            />
          </Field>
          <Field label="Quali sono i tuoi hobby?" htmlFor="hobbies">
            <textarea
              id="hobbies"
              name="hobbies"
              rows={3}
              defaultValue={profile?.hobbies}
              className="big-input"
            />
          </Field>
          <Field
            label="Quali paesi hai visitato?"
            htmlFor="countriesVisited"
            hint="Anche solo un elenco veloce va benissimo."
          >
            <input
              id="countriesVisited"
              name="countriesVisited"
              placeholder="Es. Francia, Spagna, Grecia..."
              defaultValue={profile?.countriesVisited}
              className="big-input"
            />
          </Field>
        </Section>

        <Section
          title="Iseo"
          hint="Cosa ti piace di più? Indica le 3 cose che preferisci."
        >
          <Field label="1." htmlFor="iseoFavorite1">
            <input
              id="iseoFavorite1"
              name="iseoFavorite1"
              defaultValue={profile?.iseoFavorite1}
              className="big-input"
            />
          </Field>
          <Field label="2." htmlFor="iseoFavorite2">
            <input
              id="iseoFavorite2"
              name="iseoFavorite2"
              defaultValue={profile?.iseoFavorite2}
              className="big-input"
            />
          </Field>
          <Field label="3." htmlFor="iseoFavorite3">
            <input
              id="iseoFavorite3"
              name="iseoFavorite3"
              defaultValue={profile?.iseoFavorite3}
              className="big-input"
            />
          </Field>
        </Section>

        <Section title="Manualità">
          <Field
            label="Cosa sai fare manualmente? Qual è quello che ti piace di più?"
            htmlFor="manualSkills"
          >
            <textarea
              id="manualSkills"
              name="manualSkills"
              rows={3}
              defaultValue={profile?.manualSkills}
              className="big-input"
            />
          </Field>
          <YesNoField
            label="Questo tipo di attività ti dà soddisfazione?"
            name="manualSkillsIsSatisfying"
            defaultValue={yesNoDefault(profile?.manualSkillsIsSatisfying)}
          />
        </Section>

        <Section title="Altre informazioni utili">
          <YesNoField
            label="Hai la patente di guida e un mezzo proprio per raggiungere il lavoro?"
            name="hasDrivingLicenseAndVehicle"
            defaultValue={yesNoDefault(profile?.hasDrivingLicenseAndVehicle)}
          />
          <Field
            label="Da quando saresti disponibile a iniziare?"
            htmlFor="availableFrom"
          >
            <input
              id="availableFrom"
              name="availableFrom"
              placeholder="Es. da subito, tra 2 settimane..."
              defaultValue={profile?.availableFrom}
              className="big-input"
            />
          </Field>
          <Field
            label="Preferisci lavorare in squadra, da solo/a, o ti è indifferente?"
            htmlFor="workPreference"
          >
            <input
              id="workPreference"
              name="workPreference"
              defaultValue={profile?.workPreference}
              className="big-input"
            />
          </Field>
          <Field
            label="Che lingue parli, oltre all'italiano?"
            htmlFor="languages"
          >
            <input
              id="languages"
              name="languages"
              defaultValue={profile?.languages}
              className="big-input"
            />
          </Field>
          <Field
            label="Hai già lavorato in ambiti simili? Raccontaci brevemente."
            htmlFor="priorExperience"
          >
            <textarea
              id="priorExperience"
              name="priorExperience"
              rows={3}
              defaultValue={profile?.priorExperience}
              className="big-input"
            />
          </Field>
          <Field
            label="Perché ti piacerebbe lavorare con noi?"
            htmlFor="motivation"
          >
            <textarea
              id="motivation"
              name="motivation"
              rows={3}
              defaultValue={profile?.motivation}
              className="big-input"
            />
          </Field>
        </Section>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          Invia le mie risposte
        </button>
      </form>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5 border-t border-slate-100 pt-6 first:border-t-0 first:pt-0">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-slate-500">{hint}</p>}
      </div>
      {children}
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

function YesNoField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <div>
      <p className="block text-base font-semibold text-slate-800">{label}</p>
      <select name={name} defaultValue={defaultValue} className="big-input mt-2">
        <option value="">Preferisco non rispondere</option>
        <option value="yes">Sì</option>
        <option value="no">No</option>
      </select>
    </div>
  );
}
