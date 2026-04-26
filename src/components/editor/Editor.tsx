"use client";

import type { JSONContent } from "@tiptap/core";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ConfirmModal } from "living_archive/components/ui/ConfirmModal";
import { useEffect, useRef, useState } from "react";

type NoteEditorProps = {
  note: {
    id: string;
    title: string;
    emoji: string | null;
    content: JSONContent;
    updatedAt: string;
    wordCount: number;
    characterCount: number;
  };
};

/* ── SVG icon helpers ──────────────────────────── */
const icons = {
  bold: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  ),
  italic: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  ),
  underline: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  ),
  h1: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h8" />
      <path d="M4 4v16" />
      <path d="M12 4v16" />
      <path d="M17 12l3-2v10" />
    </svg>
  ),
  h2: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h8" />
      <path d="M4 4v16" />
      <path d="M12 4v16" />
      <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
    </svg>
  ),
  bulletList: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  code: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
};

type ToolbarItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  isActive: () => boolean;
  action: () => void;
};

export function Editor({ note }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [emoji, setEmoji] = useState(note.emoji ?? "📝");
  const [status, setStatus] = useState("Saved");
  const [revision, setRevision] = useState(0);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [isTrashing, setIsTrashing] = useState(false);
  const isFirstRender = useRef(true);
  const saveTimer = useRef<number | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true, linkOnPaste: true },
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder:
          "Write something useful. The outline, the meeting, the idea you almost forgot.",
      }),
    ],
    content: note.content,
    editorProps: {
      attributes: {
        class:
          "min-h-[52vh] rounded-[1rem] px-5 py-4 text-[1.02rem] outline-none sm:px-6 sm:py-5",
        style:
          "background:var(--editor-bg);border:1px solid var(--border);color:var(--foreground); word-break: break-word;",
      },
    },
    onUpdate: () => {
      setRevision((value) => value + 1);
      setStatus("Unsaved changes");
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }

    saveTimer.current = window.setTimeout(async () => {
      const payload = {
        title: title.trim() || "Untitled note",
        emoji: emoji.trim() || null,
        content: editor.getJSON(),
      };

      setStatus("Saving…");

      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus("Save failed");
        return;
      }

      setStatus("Saved");
    }, 650);

    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, [editor, emoji, note.id, revision, title]);

  if (!editor) {
    return null;
  }

  const toolbarItems: ToolbarItem[] = [
    {
      key: "bold",
      icon: icons.bold,
      label: "Bold",
      isActive: () => editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      key: "italic",
      icon: icons.italic,
      label: "Italic",
      isActive: () => editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      key: "underline",
      icon: icons.underline,
      label: "Underline",
      isActive: () => editor.isActive("underline"),
      action: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      key: "h1",
      icon: icons.h1,
      label: "Heading 1",
      isActive: () => editor.isActive("heading", { level: 1 }),
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      key: "h2",
      icon: icons.h2,
      label: "Heading 2",
      isActive: () => editor.isActive("heading", { level: 2 }),
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: "bulletList",
      icon: icons.bulletList,
      label: "Bullet list",
      isActive: () => editor.isActive("bulletList"),
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      key: "code",
      icon: icons.code,
      label: "Code",
      isActive: () => editor.isActive("code"),
      action: () => editor.chain().focus().toggleCode().run(),
    },
  ];

  return (
    <div className="space-y-4">
      {/* ─── Toolbar ──────────────────────────── */}
      <div className="glass-card rounded-[1.5rem] p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {toolbarItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className="toolbar-btn"
              data-active={item.isActive()}
              onClick={item.action}
              title={item.label}
              aria-label={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Editor body ──────────────────────── */}
      <div className="glass-card rounded-[2rem] p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3 min-w-0 flex-1">
            <input
              value={emoji}
              onChange={(event) => setEmoji(event.target.value)}
              className="w-16 rounded-2xl border px-3 py-2 text-center text-2xl shadow-sm outline-none shrink-0"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
              aria-label="Note emoji"
            />
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Untitled note"
              className="block w-full border-0 bg-transparent px-0 text-3xl font-semibold tracking-tight outline-none sm:text-4xl text-ellipsis overflow-hidden whitespace-nowrap"
              style={{ color: "var(--foreground)" }}
            />
          </div>

          <div
            className="flex items-center justify-end gap-4 text-right text-sm shrink-0"
            style={{ color: "var(--muted)" }}
          >
            <div>
              <p>{status}</p>
              <p className="mt-1">
                Edited {new Date(note.updatedAt).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              disabled={isTrashing}
              onClick={() => setIsTrashModalOpen(true)}
              title="Move to trash"
              className="p-2 rounded-full border transition hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 disabled:opacity-50 flex items-center justify-center"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              {isTrashing ? (
                <svg
                  className="h-4 w-4 animate-spin text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="3"
                    className="opacity-25"
                  />
                  <path
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="prose-editor">
          <EditorContent editor={editor} />
        </div>

        <div
          className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <div className="flex gap-4">
            <span>{editor.storage.characterCount.characters()} characters</span>
            <span>{editor.storage.characterCount.words()} words</span>
          </div>
          <p className="text-right">
            Saved: {note.wordCount} words, {note.characterCount} characters
          </p>
        </div>
      </div>

      <ConfirmModal
        isOpen={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
        onConfirm={async () => {
          setIsTrashing(true);
          setStatus("Trashing...");
          await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
          window.location.href = "/notes";
        }}
        title="Move to Trash"
        description="Are you sure you want to move this note to the trash? You can restore it later."
        confirmText="Move to Trash"
        isDestructive={true}
        isLoading={isTrashing}
      />
    </div>
  );
}
