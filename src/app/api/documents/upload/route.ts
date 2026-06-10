import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { extractText, chunkText } from "@/lib/extraction";
import { embedBatch } from "@/lib/embeddings";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const source = formData.get("source") as string | null;
    const jurisdiction = formData.get("jurisdiction") as string | null;
    const category = formData.get("category") as string | null;
    const publishedAt = formData.get("publishedAt") as string | null;

    if (!file || !title || !source || !jurisdiction || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext ?? "")) {
      return NextResponse.json(
        { error: "Only PDF, DOCX, and TXT files supported" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const rawText = await extractText(filePath, ext!);

    const document = await prisma.document.create({
      data: {
        title,
        source,
        jurisdiction,
        category,
        fileType: ext!,
        filePath,
        rawText,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    const chunks = chunkText(rawText);
    const embeddings = await embedBatch(chunks);

    for (let i = 0; i < chunks.length; i++) {
      const vectorStr = `[${embeddings[i].join(",")}]`;
      await prisma.$executeRaw`
        INSERT INTO "DocumentChunk" (id, "documentId", "chunkIndex", text, embedding, "createdAt")
        VALUES (${uuidv4()}, ${document.id}, ${i}, ${chunks[i]}, ${vectorStr}::vector, NOW())
      `;
    }

    return NextResponse.json({
      success: true,
      documentId: document.id,
      chunkCount: chunks.length,
      message: `Document ingested: ${chunks.length} chunks embedded`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Upload error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
