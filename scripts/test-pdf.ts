
import { extractResumeText } from "../src/lib/resume-extract";
import fs from "fs";
import path from "path";

// Minimal valid PDF binary string (1.0)
const minimalPdf =
    "%PDF-1.0\n" +
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj\n" +
    "xref\n" +
    "0 4\n" +
    "0000000000 65535 f\n" +
    "0000000010 00000 n\n" +
    "0000000060 00000 n\n" +
    "0000000117 00000 n\n" +
    "trailer<</Size 4/Root 1 0 R>>\n" +
    "startxref\n" +
    "223\n" +
    "%%EOF";

async function run() {
    console.log("Starting PDF extraction test...");

    // Create a mock File object since we are in Node
    const buffer = Buffer.from(minimalPdf);
    const file = {
        name: "test.pdf",
        type: "application/pdf",
        arrayBuffer: async () => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
    } as unknown as File;

    try {
        const text = await extractResumeText(file);
        console.log("Success! Extracted text length:", text.length);
    } catch (error) {
        console.error("FAILED:", error);
        process.exit(1);
    }
}

run();
