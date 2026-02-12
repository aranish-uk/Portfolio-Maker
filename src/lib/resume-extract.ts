import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function extractResumeText(file: File): Promise<string> {
  const type = file.type || "";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();
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
