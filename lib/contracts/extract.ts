// Estrazione testo dai file contratto — INTERAMENTE nel browser (D15):
// il documento non lascia il PC dell'utente in questa fase.
// Import dinamici: mammoth e pdfjs pesano e vengono caricati solo se servono.

const MAX_PDF_PAGES = 60;

export async function extractTextFromFile(
  file: File
): Promise<{ text?: string; error?: "unsupported" | "extract-failed" }> {
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith(".txt") || name.endsWith(".md") || file.type === "text/plain") {
      return { text: await file.text() };
    }

    if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({
        arrayBuffer: await file.arrayBuffer(),
      });
      return { text: result.value };
    }

    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      let text = "";
      const pages = Math.min(doc.numPages, MAX_PDF_PAGES);
      for (let i = 1; i <= pages; i += 1) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text +=
          content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ") + "\n";
      }
      await doc.destroy();
      // PDF probabilmente scansionato (immagine senza layer testo): quasi nessun carattere.
      if (text.replace(/\s/g, "").length < 40) return { error: "extract-failed" };
      return { text };
    }

    return { error: "unsupported" };
  } catch {
    return { error: "extract-failed" };
  }
}
