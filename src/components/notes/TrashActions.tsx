"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmModal } from "living_archive/components/ui/ConfirmModal";

export function TrashActions({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRestore = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingRestore(true);
    await fetch(`/api/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isTrashed: false, trashedAt: null }),
    });
    setLoadingRestore(false);
    router.refresh();
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    await fetch(`/api/notes/${noteId}?permanent=true`, {
      method: "DELETE",
    });
    setLoadingDelete(false);
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
        <button 
          disabled={loadingRestore || loadingDelete} 
          onClick={handleRestore}
          className="flex items-center justify-center gap-2 text-xs px-3 py-1.5 rounded-full border transition disabled:opacity-50"
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
        >
          {loadingRestore && (
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
            </svg>
          )}
          Restore
        </button>
        <button 
          disabled={loadingRestore || loadingDelete} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 text-xs px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition disabled:opacity-50"
        >
          {loadingDelete && (
            <svg className="h-3.5 w-3.5 animate-spin text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
            </svg>
          )}
          Delete permanently
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Permanently"
        description="Are you sure you want to permanently delete this note? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isLoading={loadingDelete}
      />
    </>
  );
}
