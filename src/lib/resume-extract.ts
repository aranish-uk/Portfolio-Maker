import mammoth from "mammoth";

type PdfParseFn = (dataBuffer: Buffer) => Promise<{ text: string }>;

export async function extractResumeText(file: File): Promise<string> {
  const type = file.type || "";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf")) {
    // Dynamically import pdfjs-dist
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Set up the worker (even though we might not strictly need it for basic text, 
    // it's good practice or required by some versions). 
    // However, in a serverless node env, we often want to disable worker or point to a local file.
    // For simplicity and stability in Next.js server actions, we'll try standard load.
    // Note: 'legacy' build is better for Node environments in some pdfjs versions.

    // We need to pass data as a Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Config to reduce serverless warnings
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true, // silences font warnings
      isEvalSupported: false, // silences some evaluation warnings
    });

    const pdfDocument = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent({
        includeMarkedContent: false,
      });
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText.trim();
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
