export default function CandidaturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 items-start justify-center bg-slate-100 px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl">
        <p className="mb-6 text-center text-sm font-semibold tracking-wide text-slate-500">
          TripSplit
        </p>
        {children}
      </div>
    </div>
  );
}
