import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "./prisma";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function runCustodyAnalysis(documentId: string): Promise<string> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, title: true, source: true, rawText: true, jurisdiction: true },
  });

  if (!document) throw new Error("Document not found");

  const textSample = document.rawText.slice(0, 6000);

  const systemPrompt = `You are a senior custody operations analyst at Fireblocks Trust Company, a NYDFS-regulated qualified digital asset custodian.
You specialize in extracting compliance obligations from regulatory documents and assessing their impact on:
- Digital asset custody operations
- Asset eligibility and listing processes
- NYDFS charter compliance
- Staking and yield operations
- Client onboarding and KYC/AML workflows
- Cold storage and key management infrastructure
Be precise and operational. Extract specific numbers, deadlines, and thresholds when present.`;

  const prompt = `Analyze this regulatory document for custody operations impact. Return a JSON object with EXACTLY this structure:
{
  "riskScore": <integer 0-100, where 100 = most impactful for custody ops>,
  "riskLevel": <"HIGH" | "MEDIUM" | "LOW">,
  "affectedAssets": <array of crypto asset tickers affected, e.g. ["BTC", "ETH"] or [] if not asset-specific>,
  "keyObligations": <array of 3-6 specific compliance obligations extracted from the document>,
  "custodyImpact": <2-3 sentence paragraph describing the direct operational impact on custody workflows>,
  "regulatorBody": <primary regulator: "NYDFS" | "SEC" | "OCC" | "FinCEN" | "CFTC" | "IRS" | "EBA" | "Other">,
  "complianceDeadline": <deadline string if found, e.g. "July 1, 2026" or null>,
  "recommendedActions": <array of 3-5 specific operational actions the custody ops team should take>,
  "nydfsRelevance": <true if this directly affects NYDFS charter/BitLicense compliance, false otherwise>,
  "stakingImpact": <true if this affects staking operations or yield generation, false otherwise>
}

DOCUMENT TITLE: ${document.title}
SOURCE: ${document.source}
JURISDICTION: ${document.jurisdiction}

DOCUMENT TEXT:
${textSample}

Return ONLY the JSON object, no other text.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
    system: systemPrompt,
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "{}";

  let parsed: Record<string, unknown>;
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse custody analysis response");
  }

  const analysis = await prisma.custodyAnalysis.create({
    data: {
      documentId,
      riskScore: Math.min(100, Math.max(0, Number(parsed.riskScore) || 50)),
      riskLevel: ["HIGH", "MEDIUM", "LOW"].includes(parsed.riskLevel as string)
        ? (parsed.riskLevel as string)
        : "MEDIUM",
      affectedAssets: Array.isArray(parsed.affectedAssets) ? (parsed.affectedAssets as string[]) : [],
      keyObligations: Array.isArray(parsed.keyObligations) ? (parsed.keyObligations as string[]) : [],
      custodyImpact: (parsed.custodyImpact as string) ?? "",
      regulatorBody: (parsed.regulatorBody as string) ?? document.source,
      complianceDeadline: (parsed.complianceDeadline as string | null) ?? null,
      recommendedActions: Array.isArray(parsed.recommendedActions)
        ? (parsed.recommendedActions as string[])
        : [],
      nydfsRelevance: Boolean(parsed.nydfsRelevance),
      stakingImpact: Boolean(parsed.stakingImpact),
    },
  });

  return analysis.id;
}
