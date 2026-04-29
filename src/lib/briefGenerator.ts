import type { RegulatoryUpdate } from "@/data/regulatoryUpdates";

export type Audience = "Executive" | "Legal" | "Public Affairs" | "Product" | "Compliance";
export type Tone = "Concise" | "Detailed" | "Board-Ready";

export interface GeneratedBrief {
  title: string;
  audience: Audience;
  tone: Tone;
  generatedAt: string;
  executiveSummary: string;
  whyItMatters: string;
  riskScore: number;
  riskLevel: string;
  keyObligations: string[];
  affectedTeams: string[];
  recommendedNextSteps: string[];
  stakeholderMessaging: string;
  timeline: string;
  urgency: string;
  confidenceLevel: number;
  sourceReference: string;
  disclaimer: string;
}

const audienceOpeners: Record<Audience, string> = {
  Executive:
    "This brief provides leadership with the strategic context and immediate actions required in response to the following regulatory development.",
  Legal:
    "This legal brief outlines the regulatory obligations, enforcement posture, and recommended legal strategy associated with the following development.",
  "Public Affairs":
    "This brief equips the public affairs team with narrative framing, stakeholder context, and engagement strategy for the following regulatory matter.",
  Product:
    "This brief identifies the product-level implications, required feature changes, and user experience considerations triggered by the following regulatory update.",
  Compliance:
    "This compliance brief details the specific obligations, control requirements, and audit readiness steps required to achieve compliance with the following regulation.",
};

const toneModifier: Record<Tone, string> = {
  Concise: "Key points only. Action-focused.",
  Detailed: "Comprehensive analysis with full context and detailed obligations.",
  "Board-Ready": "Suitable for board presentation. Strategic framing, risk quantification, and executive summary format.",
};

export function generateBrief(
  doc: RegulatoryUpdate,
  audience: Audience,
  tone: Tone
): GeneratedBrief {
  const urgencyMap: Record<string, string> = {
    HIGH: "IMMEDIATE — Requires action within 30 days",
    MEDIUM: "ELEVATED — Action required within 60 days",
    LOW: "MONITOR — Track for developments over next quarter",
  };

  const stakeholderMsgMap: Record<Audience, string> = {
    Executive: `"We are actively monitoring ${doc.title} and have initiated internal assessment. Our compliance team is engaged and we anticipate no material disruption to business operations, subject to final rulemaking."`,
    Legal: `Internal memo to legal team: "Initiate regulatory watch protocol for ${doc.source}. Assign outside counsel review. Prepare impact assessment for executive briefing no later than ${new Date(doc.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}."`,
    "Public Affairs": `Draft statement: "We welcome constructive regulatory dialogue and support the development of clear, workable standards that protect consumers while enabling innovation. We are engaging directly with ${doc.stakeholders[0] || "relevant stakeholders"} to ensure our perspective is heard."`,
    Product: `Internal product update: "Regulatory requirement identified that may affect [specific feature]. Product review scheduled. Engineering scoping to begin within 14 days. No user-facing change expected before compliance deadline."`,
    Compliance: `Compliance notice: "New regulatory obligation identified under ${doc.source}. Control owners should review applicability against current program. Evidence requirements to be documented in compliance management system by end of quarter."`,
  };

  return {
    title: doc.title,
    audience,
    tone,
    generatedAt: new Date().toISOString(),
    executiveSummary: `${audienceOpeners[audience]} ${doc.summary} ${toneModifier[tone]}`,
    whyItMatters: doc.whyItMatters,
    riskScore: doc.riskScore,
    riskLevel: doc.riskLevel,
    keyObligations: doc.keyObligations,
    affectedTeams: doc.affectedTeams,
    recommendedNextSteps: doc.recommendedActions,
    stakeholderMessaging: stakeholderMsgMap[audience],
    timeline: doc.timeline,
    urgency: urgencyMap[doc.riskLevel],
    confidenceLevel: doc.confidence,
    sourceReference: `${doc.source} — ${doc.sourceUrl} — Published ${doc.date}`,
    disclaimer:
      "AI-generated draft. Verify with legal counsel before external use. This brief is for internal planning purposes only and does not constitute legal advice.",
  };
}

export function briefToText(brief: GeneratedBrief): string {
  return `REGULUS AI — POLICY BRIEF
Generated: ${new Date(brief.generatedAt).toLocaleString()}
Audience: ${brief.audience} | Tone: ${brief.tone}
Risk Level: ${brief.riskLevel} | Risk Score: ${brief.riskScore}/100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${brief.title.toUpperCase()}

EXECUTIVE SUMMARY
${brief.executiveSummary}

WHY IT MATTERS
${brief.whyItMatters}

KEY OBLIGATIONS
${brief.keyObligations.map((o, i) => `${i + 1}. ${o}`).join("\n")}

AFFECTED TEAMS
${brief.affectedTeams.join(", ")}

RECOMMENDED NEXT STEPS
${brief.recommendedNextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

SUGGESTED STAKEHOLDER MESSAGING
${brief.stakeholderMessaging}

TIMELINE & URGENCY
${brief.timeline}
Urgency: ${brief.urgency}

CONFIDENCE LEVEL: ${brief.confidenceLevel}%

SOURCE
${brief.sourceReference}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISCLAIMER: ${brief.disclaimer}`;
}
