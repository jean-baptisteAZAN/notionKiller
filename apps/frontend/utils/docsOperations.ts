import type { Document } from "@notionkiller/shared/types";
import MarkdownIt from "markdown-it";

type ExportFormat = "markdown" | "pdf" | "html" | "txt";

interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  fileName?: string;
}

export async function duplicateDocument(doc: Document) {
  const cookie = useCookie("auth-token");
  const API_URL = import.meta.env.VITE_API_URL;

  try {
    const response = await $fetch(`${API_URL}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
      body: {
        title: `${doc.title} (Copy)`,
        content: doc.content,
      },
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}

export async function renameDocument(id: string, newTitle: string) {
  const cookie = useCookie("auth-token");
  const API_URL = import.meta.env.VITE_API_URL;

  try {
    const response = await $fetch(`${API_URL}/documents/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      },
      body: {
        title: newTitle,
      },
    });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
}

// utils/docsOperations.ts
export async function exportDocument(
  doc: Document,
  options: ExportOptions = { format: "markdown" },
) {
  const { format, includeMetadata = true, fileName = doc.title } = options;

  let content = "";
  let mimeType = "";
  let extension = "";

  // Ajout des métadonnées si demandé
  if (includeMetadata) {
    const metadata = [
      `---`,
      `title: ${doc.title}`,
      `created: ${doc.created_at}`,
      `updated: ${doc.updated_at}`,
      `---\n\n`,
    ].join("\n");
    content = metadata + doc.content;
  } else {
    content = doc.content;
  }

  switch (format) {
    case "markdown":
      mimeType = "text/markdown";
      extension = "md";
      break;

    case "txt":
      content = content
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/`{3}[\s\S]*?`{3}/g, "");
      mimeType = "text/plain";
      extension = "txt";
      break;

    case "html":
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      });

      const formattedDate = new Date(doc.updated_at).toLocaleString();

      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${doc.title}</title>
          <meta name="created" content="${doc.created_at}">
          <meta name="updated" content="${doc.updated_at}">
          <style>
            body {
              max-width: 800px;
              margin: 40px auto;
              padding: 0 20px;
              font-family: -apple-system, system-ui, sans-serif;
              line-height: 1.6;
            }
            pre {
              background: #f5f5f5;
              padding: 1em;
              overflow-x: auto;
            }
            img {
              max-width: 100%;
            }
            .metadata {
              color: #666;
              font-size: 0.9em;
              margin-bottom: 2em;
            }
          </style>
        </head>
        <body>
          <h1>${doc.title}</h1>
          <div class="metadata">
            Last updated: ${formattedDate}
          </div>
          ${md.render(doc.content)}
        </body>
        </html>
      `.trim();
      mimeType = "text/html";
      extension = "html";
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const sanitizedFileName = fileName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    a.download = `${sanitizedFileName}_${new Date().toISOString().split("T")[0]}.${extension}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return {
      success: true,
      format,
      fileName: a.download,
    };
  } catch (error) {
    console.error("Export error:", error);
    throw new Error(error instanceof Error ? error.message : "Export failed");
  }
}
