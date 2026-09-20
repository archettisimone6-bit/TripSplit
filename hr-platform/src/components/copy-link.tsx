"use client";

import { useState } from "react";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        readOnly
        value={url}
        onFocus={(event) => event.target.select()}
        className="form-input flex-1 bg-slate-50 text-slate-600"
      />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // Clipboard API can be unavailable (e.g. insecure context); the
            // input above is still selectable and copyable manually.
          }
        }}
        className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        {copied ? "Copiato!" : "Copia link"}
      </button>
    </div>
  );
}
