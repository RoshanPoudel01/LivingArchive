"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmModal } from "living_archive/components/ui/ConfirmModal";

export function MoveToTrashButton({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTrash = async () => {
    setLoading(true);
    await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
    });
    setLoading(false);
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <button 
        disabled={loading}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        title="Move to trash"
        className="p-2 -mr-2 rounded-full border border-transparent transition hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="3" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        )}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleTrash}
        title="Move to Trash"
        description="Are you sure you want to move this note to the trash? You can restore it later."
        confirmText="Move to Trash"
        isDestructive={true}
        isLoading={loading}
      />
    </>
  );
}
