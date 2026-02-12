import mammoth from "mammoth";

type PdfParseFn = (dataBuffer: Buffer) => Promise<{ text: string }>;

// Polyfill for Serverless/Node.js environments where DOM APIs are missing
if (typeof Promise.withResolvers === "undefined") {
  // @ts-expect-error - Polyfill
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

if (typeof global.DOMMatrix === "undefined") {
  // @ts-expect-error - Mocking DOMMatrix for pdfjs-dist
  global.DOMMatrix = class DOMMatrix {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor() { }
    multiply() { return this; }
    transformPoint(p: any) { return p; }
    inverse() { return this; }
  };
}

if (typeof global.ImageData === "undefined") {
  // @ts-expect-error - Mocking ImageData
  global.ImageData = class ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    constructor(w: number, h: number) {
      this.width = w;
      this.height = h;
      this.data = new Uint8ClampedArray(w * h * 4);
    }
  };
}

if (typeof global.Path2D === "undefined") {
  // @ts-expect-error - Mocking Path2D
  global.Path2D = class Path2D { };
}

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
