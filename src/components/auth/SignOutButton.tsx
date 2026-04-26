"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { ConfirmModal } from "living_archive/components/ui/ConfirmModal";

export function SignOutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-105 active:scale-95"
        style={{
          borderColor: "var(--border)",
          color: "var(--foreground)",
          background: "var(--surface)",
        }}
        title="Sign out"
        aria-label="Sign out"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSignOut}
        title="Sign out"
        description="Are you sure you want to sign out? You will need to log back in to access your notes."
        confirmText="Sign out"
        isLoading={isLoading}
      />
    </>
  );
}
