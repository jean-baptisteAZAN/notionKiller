import type { Document } from "@/types/document";

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
      `created: ${new Date(doc.createdAt).toISOString()}`,
      `updated: ${new Date(doc.updatedAt).toISOString()}`,
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
      // Convertir le markdown en texte simple (option basique)
      content = content
        .replace(/#{1,6}\s/g, "") // Enlever les #
        .replace(/\*\*/g, "") // Enlever les **
        .replace(/\*/g, "") // Enlever les *
        .replace(/`{3}[\s\S]*?`{3}/g, ""); // Enlever les blocs de code
      mimeType = "text/plain";
      extension = "txt";
      break;

    case "html":
      // Utiliser markdown-it pour convertir en HTML
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      });

      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${doc.title}</title>
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
          </style>
        </head>
        <body>
          ${md.render(doc.content)}
        </body>
        </html>
      `;
      mimeType = "text/html";
      extension = "html";
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${extension}`;

  // Ajout d'un timestamp si spécifié
  if (includeMetadata) {
    a.download = `${a.download.replace(`.${extension}`, "")}_${new Date().toISOString().slice(0, 10)}.${extension}`;
  }

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return {
    success: true,
    format,
    fileName: a.download,
  };
}
