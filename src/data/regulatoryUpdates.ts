export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export type Status = "Active" | "Pending" | "Draft" | "Final" | "Enacted";

export interface RegulatoryUpdate {
  id: string;
  title: string;
  source: string;
  jurisdiction: string;
  category: string;
  riskLevel: RiskLevel;
  riskScore: number;
  status: Status;
  date: string;
  summary: string;
  whyItMatters: string;
  keyObligations: string[];
  affectedTeams: string[];
  recommendedActions: string[];
  timeline: string;
  stakeholders: string[];
  confidence: number;
  sourceUrl: string;
  affectedBusinessAreas: string[];
}

export const regulatoryUpdates: RegulatoryUpdate[] = [
  {
    id: "reg-001",
    title: "AI Accountability Act Advances to Committee Review",
    source: "U.S. Senate Commerce Committee",
    jurisdiction: "Federal (US)",
    category: "AI Governance",
    riskLevel: "HIGH",
    riskScore: 87,
    status: "Active",
    date: "2026-04-18",
    summary:
      "The AI Accountability Act has passed out of subcommittee and is now under full Commerce Committee review. The bill mandates impact assessments for high-risk AI systems deployed in consequential decision-making contexts.",
    whyItMatters:
      "This bill could impose mandatory algorithmic audits and transparency disclosures on any organization deploying AI in hiring, lending, healthcare, or critical infrastructure. Penalties reach $10M per violation.",
    keyObligations: [
      "Conduct algorithmic impact assessments annually",
      "Publish model cards for high-risk AI systems",
      "Establish internal AI governance committees",
      "Submit audit results to FTC within 30 days of completion",
    ],
    affectedTeams: ["Legal", "Product", "Engineering", "Compliance"],
    recommendedActions: [
      "Begin mapping all AI systems to risk categories defined in bill",
      "Engage policy counsel to submit public comment",
      "Draft internal AI governance policy aligned with bill requirements",
      "Monitor committee markup session scheduled for May 12",
    ],
    timeline: "Committee vote expected Q2 2026; Floor vote Q3 2026",
    stakeholders: ["Sen. Cantwell", "FTC", "NIST", "Industry coalitions"],
    confidence: 82,
    sourceUrl: "https://www.congress.gov",
    affectedBusinessAreas: ["Product", "Engineering", "Legal", "Executive"],
  },
  {
    id: "reg-002",
    title: "Federal Data Privacy Rule Opens for Public Comment",
    source: "Federal Trade Commission",
    jurisdiction: "Federal (US)",
    category: "Data Privacy",
    riskLevel: "HIGH",
    riskScore: 91,
    status: "Pending",
    date: "2026-04-10",
    summary:
      "The FTC has issued a Notice of Proposed Rulemaking for a comprehensive federal data privacy standard. The rule proposes consent requirements, data minimization obligations, and a private right of action for consumers.",
    whyItMatters:
      "First federal-level privacy rule with enforcement teeth. Organizations handling personal data of more than 100K consumers per year would face mandatory compliance deadlines starting in 18 months.",
    keyObligations: [
      "Obtain explicit consent for secondary data use",
      "Implement data minimization practices",
      "Respond to deletion requests within 30 days",
      "Maintain data inventories and processing records",
    ],
    affectedTeams: ["Legal", "Product", "Data", "Marketing"],
    recommendedActions: [
      "Submit public comment before June 15 deadline",
      "Audit current data collection and retention practices",
      "Engage privacy counsel for gap analysis",
      "Brief executive team on compliance investment required",
    ],
    timeline: "Comment period closes June 15, 2026; Final rule expected Q1 2027",
    stakeholders: ["FTC Chair", "Consumer advocacy groups", "Ad-tech industry"],
    confidence: 88,
    sourceUrl: "https://www.ftc.gov",
    affectedBusinessAreas: ["Product", "Data", "Marketing", "Legal"],
  },
  {
    id: "reg-003",
    title: "SEC Climate Disclosure Enforcement Guidance Updated",
    source: "Securities and Exchange Commission",
    jurisdiction: "Federal (US)",
    category: "Climate & ESG",
    riskLevel: "HIGH",
    riskScore: 83,
    status: "Final",
    date: "2026-04-05",
    summary:
      "The SEC has released updated enforcement guidance clarifying which climate-related disclosures are subject to mandatory reporting under the 2024 Climate Disclosure Rule. The guidance expands scope to include Scope 3 emissions for large accelerated filers.",
    whyItMatters:
      "Public companies and large private issuers must now include quantified climate risk assessments in annual reports. Enforcement actions have begun against early non-compliant filers.",
    keyObligations: [
      "Report Scope 1 and 2 emissions in 10-K filings",
      "Disclose material climate-related risks to business strategy",
      "Large accelerated filers must include Scope 3 by FY2027",
      "Obtain third-party attestation for emissions data",
    ],
    affectedTeams: ["Legal", "Finance", "Operations", "Investor Relations"],
    recommendedActions: [
      "Engage ESG reporting consultant for disclosure framework",
      "Begin Scope 3 emissions inventory project",
      "Update 10-K disclosure language with outside counsel",
      "Establish internal data governance for climate metrics",
    ],
    timeline: "FY2025 disclosures due in filings from March 2026 onward",
    stakeholders: ["SEC", "Investors", "ESG rating agencies", "Board Audit Committee"],
    confidence: 91,
    sourceUrl: "https://www.sec.gov",
    affectedBusinessAreas: ["Finance", "Legal", "Operations", "Executive"],
  },
  {
    id: "reg-004",
    title: "State Consumer Protection Bill Adds Algorithmic Transparency Requirements",
    source: "California State Assembly",
    jurisdiction: "California (US)",
    category: "Consumer Protection",
    riskLevel: "MEDIUM",
    riskScore: 72,
    status: "Active",
    date: "2026-04-02",
    summary:
      "AB-2847 would require companies to disclose when algorithmic systems are used to make decisions affecting California consumers, including pricing, content curation, and service eligibility.",
    whyItMatters:
      "With California's market reach, compliance would effectively apply to most national consumer-facing businesses. Firms must disclose algorithmic decision logic and provide opt-out mechanisms.",
    keyObligations: [
      "Disclose use of algorithmic decision-making to affected consumers",
      "Provide plain-language explanation of how decisions are made",
      "Offer opt-out mechanism from purely automated decisions",
      "Maintain logs of algorithmic decisions for 2 years",
    ],
    affectedTeams: ["Product", "Legal", "Customer Experience"],
    recommendedActions: [
      "Inventory all consumer-facing algorithmic systems",
      "Draft disclosure language for UI/UX implementation",
      "Monitor Assembly Judiciary Committee for amendments",
    ],
    timeline: "Assembly floor vote expected May 2026; Effective Jan 2027 if enacted",
    stakeholders: ["CA AG", "Consumer advocacy groups", "Tech industry"],
    confidence: 74,
    sourceUrl: "https://leginfo.legislature.ca.gov",
    affectedBusinessAreas: ["Product", "Customer Experience", "Legal"],
  },
  {
    id: "reg-005",
    title: "Cybersecurity Incident Reporting Window Shortened to 36 Hours",
    source: "Cybersecurity and Infrastructure Security Agency (CISA)",
    jurisdiction: "Federal (US)",
    category: "Cybersecurity",
    riskLevel: "HIGH",
    riskScore: 89,
    status: "Final",
    date: "2026-03-28",
    summary:
      "CISA has finalized the CIRCIA implementing rule, shortening the mandatory cyber incident reporting window for covered entities from 72 hours to 36 hours. Ransom payment reporting now required within 24 hours.",
    whyItMatters:
      "Critical infrastructure operators, financial institutions, and healthcare providers must now report significant cyber incidents faster, with stricter definitions of what constitutes a reportable event.",
    keyObligations: [
      "Report significant cyber incidents to CISA within 36 hours",
      "Report ransomware payments within 24 hours",
      "Designate a CISA-compliant incident response lead",
      "Preserve incident-related data for minimum 18 months",
    ],
    affectedTeams: ["Security", "Legal", "IT", "Compliance"],
    recommendedActions: [
      "Update incident response playbook to reflect 36-hour window",
      "Brief Security Operations Center on new reporting thresholds",
      "Engage outside counsel experienced in CISA compliance",
      "Test incident notification procedures in next tabletop exercise",
    ],
    timeline: "Effective 90 days from publication (June 2026)",
    stakeholders: ["CISA", "FBI", "Sector-specific agencies", "Legal counsel"],
    confidence: 95,
    sourceUrl: "https://www.cisa.gov",
    affectedBusinessAreas: ["Security", "IT", "Legal", "Operations"],
  },
  {
    id: "reg-006",
    title: "Healthcare Data Sharing Rule Expands Consent Requirements",
    source: "Department of Health and Human Services",
    jurisdiction: "Federal (US)",
    category: "Healthcare Data",
    riskLevel: "HIGH",
    riskScore: 85,
    status: "Active",
    date: "2026-03-22",
    summary:
      "HHS proposed updates to HIPAA information blocking rules would require covered entities to obtain granular consent for AI-driven analytics applications that use de-identified patient data.",
    whyItMatters:
      "Health tech companies and digital health platforms using patient-derived datasets for AI training or analytics must obtain explicit consent, even for de-identified datasets if re-identification risk exists.",
    keyObligations: [
      "Implement granular consent UI for AI analytics data use",
      "Conduct re-identification risk assessments for all datasets",
      "Update Business Associate Agreements with AI vendors",
      "Establish patient data rights request process",
    ],
    affectedTeams: ["Product", "Legal", "Engineering", "Clinical Operations"],
    recommendedActions: [
      "Audit data flows to identify HIPAA-touching AI applications",
      "Engage health law specialist for consent framework design",
      "Submit public comment before comment period closes",
      "Update privacy notices and patient consent forms",
    ],
    timeline: "Comment period closes July 2026; Final rule expected Q4 2026",
    stakeholders: ["HHS Office for Civil Rights", "AHA", "Digital health coalitions"],
    confidence: 79,
    sourceUrl: "https://www.hhs.gov",
    affectedBusinessAreas: ["Product", "Legal", "Engineering", "Clinical"],
  },
  {
    id: "reg-007",
    title: "FTC Advertising Guidance Targets AI-Generated Claims",
    source: "Federal Trade Commission",
    jurisdiction: "Federal (US)",
    category: "Advertising Compliance",
    riskLevel: "MEDIUM",
    riskScore: 68,
    status: "Final",
    date: "2026-03-15",
    summary:
      "The FTC updated its endorsement and testimonial guidance to address AI-generated marketing content. Companies must now clearly disclose when advertising content, reviews, or testimonials are AI-generated.",
    whyItMatters:
      "Any use of AI-generated content in consumer-facing advertising—including synthetic reviews, AI voiceovers, or generated testimonials—must include clear disclosure or face deceptive advertising enforcement.",
    keyObligations: [
      "Label AI-generated advertising content with clear disclosure",
      "Review all AI-assisted marketing workflows for compliance",
      "Maintain records of AI tool use in advertising production",
      "Train marketing teams on updated endorsement guidelines",
    ],
    affectedTeams: ["Marketing", "Legal", "Brand", "Product"],
    recommendedActions: [
      "Audit current AI-generated content in ad campaigns",
      "Update marketing team guidelines and approval processes",
      "Implement disclosure labels in ad creative templates",
      "Brief agency partners on FTC guidance requirements",
    ],
    timeline: "Effective immediately; enforcement guidance in effect now",
    stakeholders: ["FTC", "Ad industry councils", "Marketing agencies"],
    confidence: 93,
    sourceUrl: "https://www.ftc.gov",
    affectedBusinessAreas: ["Marketing", "Brand", "Legal"],
  },
  {
    id: "reg-008",
    title: "Financial Services Vendor Risk Rule Advances in Rulemaking",
    source: "Office of the Comptroller of the Currency",
    jurisdiction: "Federal (US)",
    category: "Financial Regulation",
    riskLevel: "HIGH",
    riskScore: 81,
    status: "Pending",
    date: "2026-03-10",
    summary:
      "OCC proposed rule would require national banks and federal thrifts to apply enhanced due diligence to third-party AI vendors, including mandatory model risk assessments and exit strategy documentation.",
    whyItMatters:
      "Banks and their fintech partners using third-party AI models for credit decisions, fraud detection, or customer service would face new oversight requirements, including annual vendor assessments.",
    keyObligations: [
      "Conduct enhanced due diligence on all AI third-party vendors",
      "Document model risk management for AI-driven decisions",
      "Maintain exit strategies and contingency plans per vendor",
      "Report material AI vendor incidents to OCC within 48 hours",
    ],
    affectedTeams: ["Risk", "Legal", "Procurement", "Technology"],
    recommendedActions: [
      "Inventory all third-party AI vendors and classify risk tier",
      "Update vendor management policy for AI-specific requirements",
      "Engage OCC relationship manager for guidance on implementation",
    ],
    timeline: "Comment period closes August 2026; Final rule Q1 2027",
    stakeholders: ["OCC", "Federal Reserve", "FDIC", "Fintech industry groups"],
    confidence: 77,
    sourceUrl: "https://www.occ.gov",
    affectedBusinessAreas: ["Finance", "Risk", "Legal", "Technology"],
  },
  {
    id: "reg-009",
    title: "Children's Online Safety Regulation Updated with Stricter Age Verification",
    source: "Federal Communications Commission / Congress",
    jurisdiction: "Federal (US)",
    category: "Consumer Protection",
    riskLevel: "HIGH",
    riskScore: 86,
    status: "Enacted",
    date: "2026-03-05",
    summary:
      "KOSA amendments enacted in early 2026 now require age-appropriate design standards and mandatory age verification for platforms with audiences under 17. Platforms must also limit algorithmic amplification for minors.",
    whyItMatters:
      "Any consumer platform with a potential minor user base must now implement significant product changes or risk FTC enforcement and state AG actions. Multiple state laws are being superseded by this federal standard.",
    keyObligations: [
      "Implement age verification system for users under 17",
      "Disable algorithmic content amplification for minor accounts",
      "Publish annual children's safety reports",
      "Designate a Children's Safety Officer",
    ],
    affectedTeams: ["Product", "Legal", "Engineering", "Trust & Safety"],
    recommendedActions: [
      "Engage age verification technology vendor immediately",
      "Conduct product audit for KOSA compliance gaps",
      "Brief executive team on compliance timeline and cost",
      "Draft Children's Safety Policy update",
    ],
    timeline: "Compliance required by September 2026",
    stakeholders: ["FTC", "State AGs", "NCMEC", "Parent advocacy groups"],
    confidence: 97,
    sourceUrl: "https://www.congress.gov",
    affectedBusinessAreas: ["Product", "Engineering", "Legal", "Trust & Safety"],
  },
  {
    id: "reg-010",
    title: "Employment AI Bias Audit Requirement Proposed at Federal Level",
    source: "Equal Employment Opportunity Commission",
    jurisdiction: "Federal (US)",
    category: "AI Governance",
    riskLevel: "MEDIUM",
    riskScore: 71,
    status: "Pending",
    date: "2026-02-28",
    summary:
      "EEOC proposed guidance would extend Title VII protections to require employers using AI in hiring and promotion decisions to conduct annual adverse impact analyses and disclose AI use to job applicants.",
    whyItMatters:
      "Employers using AI-assisted resume screening, video interviews, or predictive scoring tools would face new compliance obligations and potential liability if disparate impact is detected.",
    keyObligations: [
      "Conduct annual adverse impact analysis on AI hiring tools",
      "Disclose AI use in hiring process to job applicants",
      "Maintain records of AI hiring decisions for 4 years",
      "Implement mitigation measures if disparate impact detected",
    ],
    affectedTeams: ["HR", "Legal", "Product", "Compliance"],
    recommendedActions: [
      "Audit all AI tools used in talent acquisition pipeline",
      "Engage employment law specialist for compliance assessment",
      "Brief HR leadership on proposed requirements",
      "Monitor EEOC rulemaking calendar for public comment dates",
    ],
    timeline: "Comment period opens Q3 2026; Final guidance expected 2027",
    stakeholders: ["EEOC", "DOL", "Civil rights organizations", "HR tech vendors"],
    confidence: 70,
    sourceUrl: "https://www.eeoc.gov",
    affectedBusinessAreas: ["HR", "Legal", "Product"],
  },
  {
    id: "reg-011",
    title: "Cross-Border Data Transfer Guidance Revised Under EU-US Framework",
    source: "European Data Protection Board",
    jurisdiction: "EU / International",
    category: "Data Privacy",
    riskLevel: "MEDIUM",
    riskScore: 75,
    status: "Final",
    date: "2026-02-20",
    summary:
      "EDPB updated adequacy decision guidance following ECJ review. Organizations relying on the EU-US Data Privacy Framework for transatlantic transfers must now complete an updated transfer impact assessment by July 2026.",
    whyItMatters:
      "Any company transferring EU personal data to US-based systems or cloud providers must complete a fresh adequacy assessment and update their transfer mechanisms or risk regulatory action from EU supervisory authorities.",
    keyObligations: [
      "Complete updated Transfer Impact Assessment by July 2026",
      "Re-certify under EU-US Data Privacy Framework if applicable",
      "Update Standard Contractual Clauses where DPF not available",
      "Brief Data Protection Officer on revised transfer rules",
    ],
    affectedTeams: ["Legal", "Data", "IT", "Compliance"],
    recommendedActions: [
      "Map all EU personal data transfer flows immediately",
      "Engage EU-qualified privacy counsel for TIA completion",
      "Update data processing agreements with US sub-processors",
      "Submit re-certification if using DPF as transfer mechanism",
    ],
    timeline: "Updated TIA required by July 1, 2026",
    stakeholders: ["EDPB", "EU supervisory authorities", "DPO", "US Commerce Dept"],
    confidence: 86,
    sourceUrl: "https://edpb.europa.eu",
    affectedBusinessAreas: ["Legal", "Data", "IT", "International Operations"],
  },
  {
    id: "reg-012",
    title: "Public Procurement AI Standards Draft Released",
    source: "Office of Management and Budget",
    jurisdiction: "Federal (US)",
    category: "AI Governance",
    riskLevel: "LOW",
    riskScore: 44,
    status: "Draft",
    date: "2026-02-10",
    summary:
      "OMB released a draft framework requiring federal agencies to evaluate AI tools against a new vendor assurance checklist before procurement. Government contractors selling AI to federal agencies would need to meet minimum standards.",
    whyItMatters:
      "Companies selling AI software to federal agencies must align product documentation and safety practices with OMB standards. Non-compliant vendors may be excluded from federal procurement.",
    keyObligations: [
      "Complete OMB AI Vendor Assurance Questionnaire",
      "Document AI model cards for all products sold to federal agencies",
      "Implement incident reporting process for government deployments",
    ],
    affectedTeams: ["Product", "Legal", "Government Sales", "Engineering"],
    recommendedActions: [
      "Review draft standards against current product documentation",
      "Submit feedback during public comment period",
      "Engage government affairs team for procurement strategy",
    ],
    timeline: "Draft comment period through May 2026; Final standards expected Q4 2026",
    stakeholders: ["OMB", "GSA", "Agency CIOs", "Government contractors"],
    confidence: 65,
    sourceUrl: "https://www.whitehouse.gov/omb",
    affectedBusinessAreas: ["Government Sales", "Product", "Legal"],
  },
  {
    id: "reg-013",
    title: "Antitrust Review Guidelines Updated for Platform Markets",
    source: "Department of Justice / FTC",
    jurisdiction: "Federal (US)",
    category: "Competition & Antitrust",
    riskLevel: "MEDIUM",
    riskScore: 66,
    status: "Final",
    date: "2026-02-05",
    summary:
      "DOJ and FTC released updated joint merger guidelines with expanded scrutiny criteria for platform and data-driven markets. The guidelines lower the threshold for presumptive illegality and introduce new frameworks for evaluating multi-sided platforms.",
    whyItMatters:
      "Technology companies, media platforms, and data-intensive businesses face increased M&A risk and potential retroactive scrutiny of past acquisitions. The guidelines signal a more aggressive enforcement posture across all platform sectors.",
    keyObligations: [
      "Conduct updated antitrust risk assessment before any acquisition activity",
      "Review past acquisitions against new presumptive illegality thresholds",
      "Engage competition counsel for platform-specific compliance review",
      "Brief deal team and board on updated enforcement environment",
    ],
    affectedTeams: ["Legal", "Corporate Development", "Strategy", "Executive"],
    recommendedActions: [
      "Engage antitrust counsel for pre-deal assessment under new guidelines",
      "Update M&A playbook with revised risk thresholds",
      "Monitor DOJ/FTC enforcement actions for precedent signals",
      "Brief board on revised regulatory environment for corporate development",
    ],
    timeline: "Effective immediately; applies to all transactions filed from Jan 2026",
    stakeholders: ["DOJ Antitrust Division", "FTC", "Merger arbitrage community", "Competition bar"],
    confidence: 89,
    sourceUrl: "https://www.justice.gov/atr",
    affectedBusinessAreas: ["Corporate Development", "Legal", "Strategy", "Executive"],
  },
  {
    id: "reg-014",
    title: "State Privacy Enforcement Task Force Announces 2026 Priorities",
    source: "Multi-State Attorney General Coalition",
    jurisdiction: "Multi-State (US)",
    category: "Consumer Protection",
    riskLevel: "MEDIUM",
    riskScore: 69,
    status: "Active",
    date: "2026-01-28",
    summary:
      "A coalition of 18 state attorneys general announced coordinated enforcement priorities for 2026, focusing on dark patterns, children's data practices, AI-generated content disclosures, and location data monetization.",
    whyItMatters:
      "Even without a federal privacy law, state AG enforcement creates material compliance risk. Coordinated multi-state investigations have produced settlements exceeding $200M and mandatory operational changes for large platforms.",
    keyObligations: [
      "Audit consumer-facing UI/UX for dark patterns per FTC and state AG guidance",
      "Review location data collection, sharing, and monetization practices",
      "Implement AI-content disclosure labels in consumer products",
      "Ensure children's data practices comply with COPPA and state equivalents",
    ],
    affectedTeams: ["Legal", "Product", "Marketing", "Trust & Safety"],
    recommendedActions: [
      "Conduct dark-pattern audit of subscription and consent flows",
      "Map all location data partners and review data-sharing agreements",
      "Engage state AG relations counsel in top-3 enforcement states",
      "Update privacy policy and in-product disclosures proactively",
    ],
    timeline: "Enforcement actions expected to begin Q2 2026",
    stakeholders: ["State AGs", "Consumer advocacy groups", "NAAG", "FTC"],
    confidence: 76,
    sourceUrl: "https://www.naag.org",
    affectedBusinessAreas: ["Legal", "Product", "Marketing"],
  },
  {
    id: "reg-015",
    title: "Federal Agency Rulemaking Calendar Signals New Compliance Deadlines",
    source: "Office of Information and Regulatory Affairs (OIRA)",
    jurisdiction: "Federal (US)",
    category: "Agency Rulemaking",
    riskLevel: "LOW",
    riskScore: 41,
    status: "Active",
    date: "2026-01-15",
    summary:
      "OIRA's Unified Regulatory Agenda for Spring 2026 reveals a significant pipeline of final rules expected across HHS, EPA, FTC, FCC, and CFPB. Organizations should use this forward-looking calendar to anticipate compliance obligations and plan public comment engagement.",
    whyItMatters:
      "The Unified Regulatory Agenda is the most reliable signal of near-term federal rulemaking activity. Teams that monitor it proactively can allocate resources, schedule comment submissions, and prepare compliance programs months ahead of final rule publication.",
    keyObligations: [
      "Review OIRA Spring 2026 agenda entries relevant to your sector",
      "Flag rules in pre-final stage for immediate comment tracking",
      "Assign regulatory owners for each anticipated rule",
      "Schedule public comment calendar for Q2–Q4 2026",
    ],
    affectedTeams: ["Government Affairs", "Legal", "Compliance", "Executive"],
    recommendedActions: [
      "Download and annotate OIRA Spring 2026 Unified Regulatory Agenda",
      "Filter for rules in 'Final Rule' and 'Proposed Rule' stages by agency",
      "Build a 90-day compliance readiness calendar for top-priority rules",
      "Share forward-looking regulatory calendar with executive team",
    ],
    timeline: "Ongoing — new agenda published biannually (Spring and Fall)",
    stakeholders: ["OIRA", "Agency regulatory offices", "Industry coalitions", "Outside regulatory counsel"],
    confidence: 82,
    sourceUrl: "https://www.reginfo.gov",
    affectedBusinessAreas: ["Government Affairs", "Legal", "Compliance", "Executive"],
  },
];

export const jurisdictions = [...new Set(regulatoryUpdates.map((r) => r.jurisdiction))];
export const categories = [...new Set(regulatoryUpdates.map((r) => r.category))];
export const riskLevels: RiskLevel[] = ["HIGH", "MEDIUM", "LOW"];
export const statuses: Status[] = ["Active", "Pending", "Draft", "Final", "Enacted"];
