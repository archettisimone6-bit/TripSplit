import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StageBadge } from "@/components/badge";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { CopyLink } from "@/components/copy-link";
import { getBaseUrl } from "@/lib/site-url";
import {
  APPLICATION_STAGES,
  APPLICATION_STAGE_LABELS,
  type ApplicationStage,
} from "@/lib/constants";
import {
  addApplicationNote,
  deleteApplication,
  updateApplicationRating,
  updateApplicationStage,
} from "../actions";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      candidate: true,
      jobPosition: true,
      notes: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
      profile: true,
    },
  });

  if (!application) {
    notFound();
  }

  const stage = application.stage as ApplicationStage;
  const deleteWithId = deleteApplication.bind(null, application.id);
  const addNoteWithId = addApplicationNote.bind(null, application.id);
  const rateWithId = updateApplicationRating.bind(null, application.id);
  const baseUrl = await getBaseUrl();
  const questionnaireLink = `${baseUrl}/questionario/${application.id}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            <Link
              href={`/candidates/${application.candidate.id}`}
              className="hover:underline"
            >
              {application.candidate.firstName} {application.candidate.lastName}
            </Link>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {application.jobPosition ? (
              <>
                Candidatura per{" "}
                <Link
                  href={`/positions/${application.jobPosition.id}`}
                  className="font-medium text-slate-700 hover:underline"
                >
                  {application.jobPosition.title}
                </Link>{" "}
                · {application.jobPosition.department}
              </>
            ) : (
              "Candidatura spontanea (nessuna posizione specifica)"
            )}
          </p>
        </div>
        <form action={deleteWithId}>
          <ConfirmSubmitButton
            confirmMessage="Eliminare questa candidatura?"
            className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Elimina candidatura
          </ConfirmSubmitButton>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Fase attuale
          </h2>
          <StageBadge stage={stage} />
        </div>
        <div
          data-testid="stage-actions"
          className="mt-4 flex flex-wrap gap-2"
        >
          {APPLICATION_STAGES.map((s) => {
            const isCurrent = s === stage;
            const action = updateApplicationStage.bind(null, application.id, s);
            return (
              <form key={s} action={action}>
                <button
                  type="submit"
                  disabled={isCurrent}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    isCurrent
                      ? "cursor-default bg-slate-900 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {APPLICATION_STAGE_LABELS[s]}
                </button>
              </form>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">Candidato</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Email" value={application.candidate.email} />
            <Row label="Telefono" value={application.candidate.phone || "—"} />
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Valutazione
          </h2>
          <form action={rateWithId} className="mt-3 flex items-center gap-3">
            <select
              name="rating"
              defaultValue={application.rating?.toString() ?? ""}
              className="form-input max-w-[10rem]"
            >
              <option value="">Nessuna valutazione</option>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {"★".repeat(value)} ({value}/5)
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Salva
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Questionario conoscitivo
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Invia questo link al candidato per raccogliere qualche informazione
          in più (interessi, disponibilità, esperienze). Nessun campo è
          obbligatorio per lui.
        </p>
        <div className="mt-3">
          <CopyLink url={questionnaireLink} />
        </div>

        {application.profile ? (
          <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <ProfileRow label="Fa sport?" value={yesNo(application.profile.playsSport)} />
            <ProfileRow label="Quale sport" value={application.profile.sportDetails} />
            <ProfileRow label="Hobby" value={application.profile.hobbies} wide />
            <ProfileRow
              label="Paesi visitati"
              value={application.profile.countriesVisited}
              wide
            />
            <ProfileRow
              label="Cosa gli/le piace di Iseo"
              value={[
                application.profile.iseoFavorite1,
                application.profile.iseoFavorite2,
                application.profile.iseoFavorite3,
              ]
                .filter(Boolean)
                .join(" · ")}
              wide
            />
            <ProfileRow
              label="Abilità manuali"
              value={application.profile.manualSkills}
              wide
            />
            <ProfileRow
              label="Gli/le dà soddisfazione?"
              value={yesNo(application.profile.manualSkillsIsSatisfying)}
            />
            <ProfileRow
              label="Patente e mezzo proprio"
              value={yesNo(application.profile.hasDrivingLicenseAndVehicle)}
            />
            <ProfileRow
              label="Disponibile da"
              value={application.profile.availableFrom}
            />
            <ProfileRow
              label="Preferenza di lavoro"
              value={application.profile.workPreference}
            />
            <ProfileRow label="Lingue" value={application.profile.languages} />
            <ProfileRow
              label="Esperienze precedenti"
              value={application.profile.priorExperience}
              wide
            />
            <ProfileRow
              label="Motivazione"
              value={application.profile.motivation}
              wide
            />
          </dl>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Il candidato non ha ancora compilato il questionario.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Note e attività
        </h2>

        <form action={addNoteWithId} className="mt-4 space-y-2">
          <textarea
            name="body"
            rows={3}
            required
            placeholder="Aggiungi una nota, esito colloquio, feedback..."
            className="form-input"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Aggiungi nota
          </button>
        </form>

        {application.notes.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Nessuna nota o attività ancora.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {application.notes.map((note) => {
              const isActivity = note.kind === "ACTIVITY";
              const authorLabel =
                note.author?.name ?? (isActivity ? "Sistema" : "Candidato");
              return (
                <li
                  key={note.id}
                  className={`rounded-lg border p-4 ${
                    isActivity
                      ? "border-slate-100 bg-white"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isActivity
                          ? "bg-slate-100 text-slate-500"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {isActivity ? "Attività" : "Nota"}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {note.body}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {authorLabel} ·{" "}
                    {new Intl.DateTimeFormat("it-IT", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(note.createdAt)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-900">{value}</dd>
    </div>
  );
}

function yesNo(value: boolean | null | undefined) {
  if (value === true) return "Sì";
  if (value === false) return "No";
  return "";
}

function ProfileRow({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-slate-500">{label}</dt>
      <dd className="whitespace-pre-wrap text-slate-900">{value || "—"}</dd>
    </div>
  );
}
