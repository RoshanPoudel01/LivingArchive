import type { JSONContent } from "@tiptap/core";

export const emptyDocument: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function normalizeEditorContent(content: unknown): JSONContent {
  if (content && typeof content === "object") {
    return content as JSONContent;
  }

  return emptyDocument;
}

export function extractPlainText(content: JSONContent): string {
  const chunks: string[] = [];

  const visit = (node: JSONContent | undefined) => {
    if (!node) {
      return;
    }

    if (typeof node.text === "string") {
      chunks.push(node.text);
    }

    node.content?.forEach((child) => visit(child));

    if (node.type === "paragraph" || node.type === "heading" || node.type === "blockquote") {
      chunks.push("\n");
    }
  };

  visit(content);

  return chunks.join(" ").replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n").trim();
}

export function countWords(plainText: string): number {
  return plainText.trim().split(/\s+/).filter(Boolean).length;
}