import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  APPLICATION_STAGE_LABELS,
  PIPELINE_COLUMNS,
  nextStage,
  type ApplicationStage,
} from "@/lib/constants";
import { updateApplicationStage } from "../applications/actions";

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ positionId?: string }>;
}) {
  const { positionId } = await searchParams;

  const [positions, applications] = await Promise.all([
    prisma.jobPosition.findMany({ orderBy: { title: "asc" } }),
    prisma.application.findMany({
      where: positionId ? { jobPositionId: positionId } : undefined,
      orderBy: { updatedAt: "desc" },
      include: { candidate: true, jobPosition: true },
    }),
  ]);

  const columns = new Map<ApplicationStage, typeof applications>();
  for (const stage of PIPELINE_COLUMNS) columns.set(stage, []);
  for (const application of applications) {
    const stage = application.stage as ApplicationStage;
    columns.get(stage)?.push(application);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pipeline</h1>
          <p className="mt-1 text-sm text-slate-500">
            Avanzamento delle candidature attraverso le fasi di selezione.
          </p>
        </div>
        <form className="flex items-center gap-2">
          <select
            name="positionId"
            defaultValue={positionId ?? ""}
            className="form-input"
          >
            <option value="">Tutte le posizioni</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Filtra
          </button>
        </form>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {PIPELINE_COLUMNS.map((stage) => {
          const items = columns.get(stage) ?? [];
          return (
            <div
              key={stage}
              className="flex w-64 shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-50"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  {APPLICATION_STAGE_LABELS[stage]}
                </h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                  {items.length}
                </span>
              </div>
              <div className="flex-1 space-y-3 p-3">
                {items.map((application) => {
                  const advanceTo = nextStage(stage);
                  const advance = advanceTo
                    ? updateApplicationStage.bind(
                        null,
                        application.id,
                        advanceTo
                      )
                    : null;
                  return (
                    <div
                      key={application.id}
                      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <Link
                        href={`/applications/${application.id}`}
                        className="text-sm font-medium text-slate-900 hover:underline"
                      >
                        {application.candidate.firstName}{" "}
                        {application.candidate.lastName}
                      </Link>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {application.jobPosition.title}
                      </p>
                      {advance && (
                        <form action={advance} className="mt-2">
                          <button
                            type="submit"
                            className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            Sposta a &ldquo;
                            {APPLICATION_STAGE_LABELS[advanceTo!]}&rdquo; →
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <p className="px-1 text-xs text-slate-400">Vuoto</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
