import mammoth from "mammoth";

type PdfParseFn = (dataBuffer: Buffer) => Promise<{ text: string }>;

export async function extractResumeText(file: File): Promise<string> {
  const type = file.type || "";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf")) {
    // Import parser internals directly to avoid the package-root debug path
    // that attempts to read local test fixtures in serverless runtimes.
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default as PdfParseFn;
    const parsed = await pdfParse(buffer);
    return parsed.text.trim();
  }

  if (
    type.includes("word") ||
    type.includes("officedocument") ||
    file.name.toLowerCase().endsWith(".docx")
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value.trim();
  }

  throw new Error("Unsupported resume format. Please upload PDF or DOCX.");
}
