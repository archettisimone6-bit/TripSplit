import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PositionForm } from "../../position-form";
import { updatePosition } from "../../actions";

export default async function EditPositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const position = await prisma.jobPosition.findUnique({ where: { id } });

  if (!position) {
    notFound();
  }

  const updateWithId = updatePosition.bind(null, position.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">
        Modifica posizione
      </h1>
      <p className="mt-1 text-sm text-slate-500">{position.title}</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <PositionForm
          action={updateWithId}
          defaultValues={position}
          submitLabel="Salva modifiche"
        />
      </div>
    </div>
  );
}
