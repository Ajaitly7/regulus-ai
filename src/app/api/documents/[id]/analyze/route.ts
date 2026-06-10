import { NextRequest, NextResponse } from "next/server";
import { runCustodyAnalysis } from "@/lib/custodyAnalysis";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const analysisId = await runCustodyAnalysis(id);
    const analysis = await prisma.custodyAnalysis.findUnique({ where: { id: analysisId } });
    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const analyses = await prisma.custodyAnalysis.findMany({
    where: { documentId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(analyses);
}
