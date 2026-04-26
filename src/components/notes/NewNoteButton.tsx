"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewNoteButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);

        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Untitled note" }),
        });

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const note = await response.json();
        router.push(`/notes/${note.id}`);
        router.refresh();
      }}
      className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-60"
      style={{ background: "var(--accent)" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {loading ? "Creating..." : "New note"}
    </button>
  );
}