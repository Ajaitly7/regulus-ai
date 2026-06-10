import fs from "fs";

export async function extractText(filePath: string, fileType: string): Promise<string> {
  if (fileType === "pdf") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text as string;
  }
  if (fileType === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  if (fileType === "txt") {
    return fs.readFileSync(filePath, "utf-8");
  }
  throw new Error(`Unsupported file type: ${fileType}`);
}

export function chunkText(text: string, chunkSize = 800, overlap = 150): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = current.slice(-overlap) + " " + sentence;
    } else {
      current = current ? current + " " + sentence : sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.filter((c) => c.length > 50);
}
