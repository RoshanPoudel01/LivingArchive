"use client";
import logo from "living_archive/assets/logo.svg";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-card w-full max-w-md rounded-[2rem] p-8 sm:p-10">
        <div className="mb-8 space-y-3">
          <Image priority src={logo} alt="Living Archive" />
          <h1 className="font-serif text-4xl leading-tight" style={{ color: "var(--foreground)" }}>
            Capture notes with a calmer workspace.
          </h1>
          <p className="text-sm leading-6" style={{ color: "var(--muted)" }}>
            Sign in with Google to sync notes, notebooks, and rich text drafts across devices.
          </p>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/notes" })}
          className="inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center text-xs leading-5" style={{ color: "var(--muted)" }}>
          Mobile-friendly layout, auto-saving editor, and Prisma-backed storage.
        </p>
      </div>
    </div>
  );
}