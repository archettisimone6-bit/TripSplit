import Link from "next/link";
import { logoutAction } from "@/app/(app)/logout-action";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/positions", label: "Posizioni" },
  { href: "/candidates", label: "Candidati" },
  { href: "/pipeline", label: "Pipeline" },
];

export function Nav({ userName }: { userName: string }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            TripSplit HR
          </span>
          <nav className="flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{userName}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Esci
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
