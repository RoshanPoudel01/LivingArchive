"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function MobileNav({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium transition hover:opacity-80"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
          color: "var(--foreground)",
        }}
      >
        Menu
      </button>

      {isMounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col bg-[var(--background)]">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="font-serif text-xl sm:text-2xl" style={{ color: "var(--foreground)" }}>
              Living Archive
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border px-4 py-2 text-sm font-medium transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
                color: "var(--foreground)",
              }}
            >
              Close
            </button>
          </div>
          
          <nav className="flex-1 space-y-2 p-4 sm:p-6 overflow-y-auto">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 rounded-[1.5rem] p-4 text-lg font-medium transition hover:bg-[var(--surface)]"
                style={{ color: "var(--foreground)" }}
              >
                <span className="flex h-8 w-8 items-center justify-center opacity-70">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>,
        document.body
      )}
    </div>
  );
}
