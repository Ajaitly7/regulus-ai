import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { uploadedAt: "desc" },
      include: {
        _count: { select: { chunks: true } },
        analyses: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    return NextResponse.json(documents);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Documents list error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
