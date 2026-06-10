import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Load env vars
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const custodyRegulations = [
  {
    id: "seed-001",
    title: "NYDFS Updates BitLicense Framework for Qualified Custodians",
    source: "NYDFS",
    jurisdiction: "New York (US)",
    category: "Digital Asset Custody",
    rawText: `NYDFS Updates BitLicense Framework for Qualified Custodians.
Source: NY Department of Financial Services. Jurisdiction: New York (US). Category: Digital Asset Custody.
Summary: NYDFS issued updated supervisory guidance for virtual currency entities operating under the BitLicense or Limited Purpose Trust Company charter. The guidance expands asset listing requirements and mandates quarterly cybersecurity attestations for qualified custodians.
Why it matters: Fireblocks Trust Company operates under NYDFS charter. Updated listing and cybersecurity requirements directly affect asset evaluation workflows and compliance attestation timelines. Non-compliance risks charter suspension.
Key Obligations: Submit updated asset listing application within 60 days for any new asset additions. Conduct quarterly cybersecurity attestation by licensed third-party auditor. Implement new cold storage segregation requirements by Q3 2026. Report any custody operational incidents to NYDFS within 72 hours.
Recommended Actions: Map all pending asset approvals to updated NYDFS listing requirements. Engage cybersecurity auditor for Q3 2026 attestation schedule. Review cold storage architecture against new segregation standards. Update incident reporting runbook to reflect 72-hour NYDFS window.
Timeline: Updated guidance effective July 1, 2026.`,
  },
  {
    id: "seed-002",
    title: "SEC Staff Bulletin: Investment Adviser Custody of Digital Assets",
    source: "SEC",
    jurisdiction: "Federal (US)",
    category: "Digital Asset Custody",
    rawText: `SEC Staff Bulletin: Investment Adviser Custody of Digital Assets.
Source: Securities and Exchange Commission. Jurisdiction: Federal (US). Category: Digital Asset Custody.
Summary: Following the September 2025 no-action letter, SEC staff issued a formal bulletin confirming that state-chartered trust companies (including NYDFS-regulated entities) may serve as qualified custodians for registered investment advisers holding digital assets on behalf of clients.
Why it matters: This bulletin directly expands the addressable market for Fireblocks Trust Company to include RIAs and hedge funds with digital asset allocations. Operational procedures must be updated to onboard these new client types with appropriate segregation and reporting.
Key Obligations: Maintain asset segregation per Investment Company Act standards for RIA clients. Provide quarterly account statements to RIA clients with independent verification. Implement enhanced KYC/AML for RIA and fund clients. Establish written custody agreements meeting SEC audit trail requirements.
Recommended Actions: Develop RIA-specific onboarding procedures and custody agreement templates. Update account statement infrastructure to meet SEC quarterly requirements. Brief client services team on RIA regulatory obligations.
Timeline: Bulletin effective immediately; enforcement guidance active.`,
  },
  {
    id: "seed-003",
    title: "OCC Supplemental Guidance on Crypto Asset Custody for National Banks",
    source: "OCC",
    jurisdiction: "Federal (US)",
    category: "Digital Asset Custody",
    rawText: `OCC Supplemental Guidance on Crypto Asset Custody for National Banks.
Source: Office of the Comptroller of the Currency. Jurisdiction: Federal (US). Category: Digital Asset Custody.
Summary: OCC issued supplemental guidance extending 2020 interpretive letters on bank crypto custody. National banks offering digital asset custody services must now implement enhanced operational risk controls, including segregated cold storage and multi-party computation (MPC) wallet standards.
Why it matters: Bank clients using Fireblocks Trust Company must demonstrate that sub-custodian arrangements meet OCC operational risk standards.
Key Obligations: Cold storage must use hardware security module (HSM) or MPC-based key management. Segregated omnibus accounts or individually segregated accounts required. Annual operational resilience testing including custody failover scenarios. Contractual audit rights for bank clients in sub-custody arrangements.
Recommended Actions: Review MPC wallet architecture against OCC HSM/MPC standards. Update custody agreement templates with audit rights provisions for bank clients. Schedule annual custody failover simulation in H2 2026.
Timeline: Guidance in effect; compliance expected within 90 days.`,
  },
  {
    id: "seed-004",
    title: "FinCEN Proposes Enhanced AML Requirements for Digital Asset Custodians",
    source: "FinCEN",
    jurisdiction: "Federal (US)",
    category: "AML / BSA Compliance",
    rawText: `FinCEN Proposes Enhanced AML Requirements for Digital Asset Custodians.
Source: Financial Crimes Enforcement Network. Jurisdiction: Federal (US). Category: AML / BSA Compliance.
Summary: FinCEN proposed rule would require digital asset custodians holding assets for third parties to implement enhanced due diligence (EDD) programs, including beneficial ownership verification for custodied assets above $3,000 threshold.
Key Obligations: Implement EDD for all custody accounts holding assets valued at $3,000+. Verify beneficial ownership of custodied assets. File SARs for suspicious custody-related activity within 30 days. Maintain transaction records for digital asset custody movements for 5 years.
Recommended Actions: Submit public comment before comment period closes (September 2026). Begin gap analysis of current KYC/AML procedures against proposed EDD requirements. Update custody onboarding procedures to anticipate new requirements.
Timeline: Comment period closes Sept 2026; Final rule expected Q2 2027.`,
  },
  {
    id: "seed-005",
    title: "EU MiCA Title III Implementation: Crypto-Asset Custody Service Requirements",
    source: "EBA",
    jurisdiction: "EU / International",
    category: "Digital Asset Custody",
    rawText: `EU MiCA Title III Implementation: Crypto-Asset Custody Service Requirements.
Source: European Banking Authority. Jurisdiction: EU / International. Category: Digital Asset Custody.
Summary: EBA published final technical standards under MiCA Title III governing custody and administration of crypto-assets on behalf of clients. Standards require custodians to maintain segregated client accounts, implement cold storage requirements, and submit to annual EBA supervisory reviews.
Key Obligations: Segregate client assets into individually or omnibus custody accounts per MiCA Article 70. Implement cold storage for at least 90% of custodied assets. Submit annual reports to national competent authority. Maintain €150K minimum own funds or 2% of custodied assets.
Recommended Actions: Map current NYDFS operational controls against MiCA Title III requirements. Engage EU-qualified regulatory counsel for MiCA compliance gap analysis. Develop EU-specific custody agreement template for BNP Paribas, Revolut EU clients.
Timeline: MiCA Title III fully applicable from December 2024; EBA technical standards effective March 2026.`,
  },
  {
    id: "seed-006",
    title: "IRS Rev. Proc. 2026-18: Digital Asset Custody Tax Reporting Requirements",
    source: "IRS",
    jurisdiction: "Federal (US)",
    category: "Tax & Reporting",
    rawText: `IRS Rev. Proc. 2026-18: Digital Asset Custody Tax Reporting Requirements.
Source: Internal Revenue Service. Jurisdiction: Federal (US). Category: Tax & Reporting.
Summary: IRS finalized broker reporting rules under the 2021 Infrastructure Investment and Jobs Act, confirming that qualified custodians of digital assets are 'brokers' subject to Form 1099-DA reporting obligations beginning tax year 2026.
Key Obligations: Issue Form 1099-DA to custody clients for all digital asset transactions. Track cost basis using per-account, per-asset FIFO or specific identification method. Report staking rewards as ordinary income at fair market value on receipt date. File with IRS by March 31, 2027 for tax year 2026 transactions.
Recommended Actions: Engage tax technology vendor for 1099-DA reporting infrastructure build. Implement cost basis tracking at account level immediately. Update client custody agreements to reflect new tax reporting obligations.
Timeline: Applies to tax year 2026 transactions; first 1099-DA filings due March 31, 2027.`,
  },
  {
    id: "seed-007",
    title: "CFTC Proposed Rulemaking: Crypto Derivatives Custodian Requirements",
    source: "CFTC",
    jurisdiction: "Federal (US)",
    category: "Digital Asset Custody",
    rawText: `CFTC Proposed Rulemaking: Crypto Derivatives Custodian Requirements.
Source: Commodity Futures Trading Commission. Jurisdiction: Federal (US). Category: Digital Asset Custody.
Summary: CFTC proposed rule would designate qualified custodians holding digital assets as collateral for derivatives contracts to meet minimum capital, operational resilience, and reporting standards consistent with futures commission merchant (FCM) custodian rules.
Key Obligations: Register as 'digital asset custodian' with CFTC if holding derivatives collateral. Segregate derivatives collateral from other custodied assets. Report collateral movements to CFTC daily for accounts above threshold. Meet CFTC-defined capital requirements for custodied collateral value.
Timeline: Comment period closes June 2026; Final rule expected Q1 2027.`,
  },
  {
    id: "seed-008",
    title: "NYDFS Cybersecurity Regulation Part 500 Amendment — Crypto Custodian Addendum",
    source: "NYDFS",
    jurisdiction: "New York (US)",
    category: "Cybersecurity",
    rawText: `NYDFS Cybersecurity Regulation Part 500 Amendment — Crypto Custodian Addendum.
Source: NY Department of Financial Services. Jurisdiction: New York (US). Category: Cybersecurity.
Summary: NYDFS finalized the crypto custodian addendum to Part 500 cybersecurity regulations. Trust companies holding digital assets must now implement annual penetration testing of custody key management infrastructure and designate a dedicated Crypto Cybersecurity Officer (CCO).
Key Obligations: Designate a Crypto Cybersecurity Officer (CCO) — distinct from CISO if custodied assets exceed $500M. Annual penetration testing of MPC/HSM key management infrastructure by certified third party. Incident response plan must cover custody key compromise scenarios specifically. Submit annual cybersecurity compliance certification to NYDFS by April 15 each year.
Recommended Actions: Designate CCO role and confirm organizational placement by Q3 2026. Engage pen testing firm experienced in MPC infrastructure (CertiK, NCC Group). Update incident response plan with key compromise playbook. Calendar April 15 NYDFS cybersecurity certification deadline.
Timeline: Effective March 1, 2026; CCO designation required by September 1, 2026.`,
  },
];

function chunkText(text: string, chunkSize = 800, overlap = 150): string[] {
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

async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts.map((t) => t.slice(0, 8000)),
  });
  return response.data.map((d) => d.embedding);
}

async function runCustodyAnalysis(documentId: string, doc: (typeof custodyRegulations)[0]) {
  const prompt = `Analyze this regulatory document for custody operations impact. Return a JSON object:
{
  "riskScore": <integer 0-100>,
  "riskLevel": <"HIGH" | "MEDIUM" | "LOW">,
  "affectedAssets": <array of crypto tickers or []>,
  "keyObligations": <array of 3-5 obligations>,
  "custodyImpact": <2-3 sentence paragraph>,
  "regulatorBody": <"NYDFS" | "SEC" | "OCC" | "FinCEN" | "CFTC" | "IRS" | "EBA" | "Other">,
  "complianceDeadline": <deadline string or null>,
  "recommendedActions": <array of 3-4 actions>,
  "nydfsRelevance": <true/false>,
  "stakingImpact": <true/false>
}

DOCUMENT: ${doc.title}
SOURCE: ${doc.source}
TEXT: ${doc.rawText.slice(0, 3000)}

Return ONLY the JSON object.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "{}";
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  await prisma.custodyAnalysis.create({
    data: {
      documentId,
      riskScore: Math.min(100, Math.max(0, Number(parsed.riskScore) || 50)),
      riskLevel: ["HIGH", "MEDIUM", "LOW"].includes(parsed.riskLevel) ? parsed.riskLevel : "MEDIUM",
      affectedAssets: Array.isArray(parsed.affectedAssets) ? parsed.affectedAssets : [],
      keyObligations: Array.isArray(parsed.keyObligations) ? parsed.keyObligations : [],
      custodyImpact: parsed.custodyImpact ?? "",
      regulatorBody: parsed.regulatorBody ?? doc.source,
      complianceDeadline: parsed.complianceDeadline ?? null,
      recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : [],
      nydfsRelevance: Boolean(parsed.nydfsRelevance),
      stakingImpact: Boolean(parsed.stakingImpact),
    },
  });
}

async function main() {
  console.log("Seeding database with custody regulations...\n");

  for (const reg of custodyRegulations) {
    // Check if already seeded
    const existing = await prisma.document.findFirst({ where: { title: reg.title } });
    if (existing) {
      console.log(`  SKIP: ${reg.title} (already exists)`);
      continue;
    }

    console.log(`  Ingesting: ${reg.title}`);

    // Create document
    const doc = await prisma.document.create({
      data: {
        title: reg.title,
        source: reg.source,
        jurisdiction: reg.jurisdiction,
        category: reg.category,
        fileType: "txt",
        filePath: `/seed/${reg.id}.txt`,
        rawText: reg.rawText,
      },
    });

    // Chunk + embed
    const chunks = chunkText(reg.rawText);
    console.log(`    → ${chunks.length} chunks`);
    const embeddings = await embedBatch(chunks);

    for (let i = 0; i < chunks.length; i++) {
      const vectorStr = `[${embeddings[i].join(",")}]`;
      await prisma.$executeRaw`
        INSERT INTO "DocumentChunk" (id, "documentId", "chunkIndex", text, embedding, "createdAt")
        VALUES (${uuidv4()}, ${doc.id}, ${i}, ${chunks[i]}, ${vectorStr}::vector, NOW())
      `;
    }

    // Run custody analysis
    console.log(`    → Running custody analysis...`);
    await runCustodyAnalysis(doc.id, reg);
    console.log(`    ✓ Done`);

    // Rate limit pause between documents
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
