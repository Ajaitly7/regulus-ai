export type AssetTier = "Tier 1" | "Tier 2" | "Tier 3" | "Under Review";
export type CustodyStatus = "Approved" | "Pending Approval" | "Under Review" | "Rejected";
export type StakingEligibility = "Eligible" | "Not Eligible" | "Under Assessment";

export interface CustodyAsset {
  id: string;
  symbol: string;
  name: string;
  tier: AssetTier;
  custodyStatus: CustodyStatus;
  securityScore: number;        // 0-100
  resiliencyScore: number;      // 0-100
  overallRiskScore: number;     // 0-100 (lower = safer for custody)
  marketCap: string;
  blockchain: string;
  consensusMechanism: string;
  stakingEligible: StakingEligibility;
  annualizedYield?: string;
  keyRisks: string[];
  securityNotes: string[];
  resiliencyNotes: string[];
  recommendedAction: string;
  reviewDate: string;
  analyst: string;
  nydfsApproved: boolean;
}

export const custodyAssets: CustodyAsset[] = [
  {
    id: "asset-btc",
    symbol: "BTC",
    name: "Bitcoin",
    tier: "Tier 1",
    custodyStatus: "Approved",
    securityScore: 97,
    resiliencyScore: 99,
    overallRiskScore: 12,
    marketCap: "$1.9T",
    blockchain: "Bitcoin",
    consensusMechanism: "Proof of Work",
    stakingEligible: "Not Eligible",
    keyRisks: [
      "51% attack — theoretical only at current hash rate",
      "Long-term miner incentive shift post-halving",
      "Quantum computing threat horizon (10–15 yr)",
    ],
    securityNotes: [
      "Largest proof-of-work network globally; $600B+ in mining infrastructure securing the chain",
      "No smart contract attack surface; simple UTXO model minimizes protocol-layer risk",
      "10+ year track record with zero successful double-spend at scale",
    ],
    resiliencyNotes: [
      "Network operates across 15,000+ nodes globally with no single point of failure",
      "Longest uninterrupted blockchain history; survived multiple market cycles",
      "Deeply liquid across 100+ regulated trading venues globally",
    ],
    recommendedAction: "Maintain Tier 1 status. No action required.",
    reviewDate: "2026-03-15",
    analyst: "Custody Ops Team",
    nydfsApproved: true,
  },
  {
    id: "asset-eth",
    symbol: "ETH",
    name: "Ethereum",
    tier: "Tier 1",
    custodyStatus: "Approved",
    securityScore: 92,
    resiliencyScore: 94,
    overallRiskScore: 18,
    marketCap: "$420B",
    blockchain: "Ethereum",
    consensusMechanism: "Proof of Stake",
    stakingEligible: "Eligible",
    annualizedYield: "3.2–4.1%",
    keyRisks: [
      "Smart contract complexity creates larger protocol attack surface vs BTC",
      "Validator concentration risk — top 5 operators hold ~35% of stake",
      "Regulatory classification uncertainty in some jurisdictions",
    ],
    securityNotes: [
      "Battle-tested PoS consensus since Merge (Sept 2022); no validator double-sign incidents at scale",
      "EIP-1559 fee burn mechanism reduces inflation and long-term supply risk",
      "Robust client diversity (Geth, Nethermind, Besu) reduces single-client failure risk",
    ],
    resiliencyNotes: [
      "Largest smart contract platform; 3,000+ active dApps create deep ecosystem moat",
      "500K+ active validators provide strong liveness guarantees",
      "ETH staking yield from Figment integration: 3.2–4.1% APR under qualified custody",
    ],
    recommendedAction: "Tier 1 approved. Enable staking via Figment integration. Monitor validator concentration quarterly.",
    reviewDate: "2026-03-15",
    analyst: "Custody Ops Team",
    nydfsApproved: true,
  },
  {
    id: "asset-sol",
    symbol: "SOL",
    name: "Solana",
    tier: "Tier 2",
    custodyStatus: "Approved",
    securityScore: 78,
    resiliencyScore: 72,
    overallRiskScore: 38,
    marketCap: "$92B",
    blockchain: "Solana",
    consensusMechanism: "Proof of History / PoS",
    stakingEligible: "Eligible",
    annualizedYield: "6.5–8.2%",
    keyRisks: [
      "Network outages: 5 significant incidents in 2021–2023 history",
      "High validator hardware requirements limit decentralization",
      "Relatively young network (<6 years); limited stress-test history vs BTC/ETH",
    ],
    securityNotes: [
      "FIREDANCER client (Jump Crypto) launch in 2025 significantly improved client diversity",
      "No major consensus-layer exploits to date; outages have been liveness, not safety failures",
      "Improved 2024–2025 uptime track record following architectural upgrades",
    ],
    resiliencyNotes: [
      "Highest throughput L1 at 50,000+ TPS; essential for high-frequency custody use cases",
      "1,800+ validators; concentration risk improving but remains elevated vs Ethereum",
      "Strong institutional demand (Kraken, FalconX, Coinbase) validates Tier 2 inclusion",
    ],
    recommendedAction: "Maintain Tier 2. Staking eligible via approved validators. Re-evaluate for Tier 1 in Q4 2026 pending uptime record.",
    reviewDate: "2026-04-01",
    analyst: "Custody Ops Team",
    nydfsApproved: true,
  },
  {
    id: "asset-usdc",
    symbol: "USDC",
    name: "USD Coin",
    tier: "Tier 1",
    custodyStatus: "Approved",
    securityScore: 89,
    resiliencyScore: 91,
    overallRiskScore: 22,
    marketCap: "$61B",
    blockchain: "Multi-chain (Ethereum, Solana, Base)",
    consensusMechanism: "N/A — ERC-20 / SPL token",
    stakingEligible: "Not Eligible",
    keyRisks: [
      "Issuer risk: Circle's regulatory standing and reserve management",
      "De-peg risk in systemic liquidity crises (March 2023 SVB event precedent)",
      "Smart contract risk on non-Ethereum deployments",
    ],
    securityNotes: [
      "Monthly Deloitte reserve attestations; $1:1 cash + T-bill backing",
      "Circle received US money transmitter licenses in 49 states; EU MiCA compliant",
      "CCTP (Cross-Chain Transfer Protocol) eliminates wrapped token bridge risk",
    ],
    resiliencyNotes: [
      "Most widely used regulated stablecoin in institutional DeFi and payments",
      "Over $200B/month in transfer volume on Fireblocks network",
      "Primary settlement currency for Fireblocks Trust Company custody clients",
    ],
    recommendedAction: "Tier 1 approved. Core settlement asset. Monitor Circle reserve attestations monthly.",
    reviewDate: "2026-03-01",
    analyst: "Custody Ops Team",
    nydfsApproved: true,
  },
  {
    id: "asset-dot",
    symbol: "DOT",
    name: "Polkadot",
    tier: "Tier 2",
    custodyStatus: "Approved",
    securityScore: 74,
    resiliencyScore: 76,
    overallRiskScore: 42,
    marketCap: "$12B",
    blockchain: "Polkadot",
    consensusMechanism: "Nominated Proof of Stake",
    stakingEligible: "Eligible",
    annualizedYield: "11–14%",
    keyRisks: [
      "Parachain architecture adds complexity to cross-chain custody operations",
      "Unbonding period (28 days) creates liquidity risk for custody clients",
      "Governance-based upgrades introduce protocol change risk",
    ],
    securityNotes: [
      "Shared security model across parachains reduces individual chain attack surface",
      "Formal verification used in critical runtime components (Substrate framework)",
      "No significant slashing events to date on mainnet",
    ],
    resiliencyNotes: [
      "1,000 active nominators; reasonable decentralization for Tier 2 classification",
      "Strong VC-backed ecosystem; Web3 Foundation grants drive developer activity",
      "High staking yield (11–14%) makes it attractive for institutional staking mandates",
    ],
    recommendedAction: "Tier 2 approved with staking. Flag 28-day unbonding period in client agreements. Review liquidity management procedures.",
    reviewDate: "2026-04-10",
    analyst: "Custody Ops Team",
    nydfsApproved: false,
  },
  {
    id: "asset-avax",
    symbol: "AVAX",
    name: "Avalanche",
    tier: "Tier 2",
    custodyStatus: "Under Review",
    securityScore: 71,
    resiliencyScore: 73,
    overallRiskScore: 48,
    marketCap: "$18B",
    blockchain: "Avalanche",
    consensusMechanism: "Avalanche Consensus (PoS variant)",
    stakingEligible: "Under Assessment",
    keyRisks: [
      "Three-chain architecture (X/C/P) introduces operational complexity for custody workflows",
      "Relatively concentrated validator set (~1,200 validators)",
      "Smart contract TVL concentration on C-Chain creates systemic risk",
    ],
    securityNotes: [
      "Novel Avalanche consensus protocol; theoretically stronger finality guarantees than traditional BFT",
      "No critical consensus-layer vulnerabilities discovered to date",
      "Audit history improving; Ava Labs has contracted Trail of Bits for protocol reviews",
    ],
    resiliencyNotes: [
      "Strong subnet ecosystem enabling institutional-grade private chains",
      "BlackRock, Franklin Templeton tokenization activity validates institutional interest",
      "Network has maintained consistent uptime since 2020 mainnet launch",
    ],
    recommendedAction: "Under Review — pending NYDFS approval and operational workflow mapping for tri-chain architecture. Target completion Q3 2026.",
    reviewDate: "2026-05-01",
    analyst: "Custody Ops Team",
    nydfsApproved: false,
  },
  {
    id: "asset-link",
    symbol: "LINK",
    name: "Chainlink",
    tier: "Tier 3",
    custodyStatus: "Pending Approval",
    securityScore: 65,
    resiliencyScore: 68,
    overallRiskScore: 55,
    marketCap: "$11B",
    blockchain: "Ethereum (ERC-20)",
    consensusMechanism: "N/A — Oracle Network",
    stakingEligible: "Under Assessment",
    keyRisks: [
      "Oracle manipulation risk could affect DeFi protocols relying on LINK feeds",
      "Token utility highly coupled to Chainlink network adoption trajectory",
      "Staking v0.2 launched 2024 — limited track record for institutional staking",
    ],
    securityNotes: [
      "No direct protocol exploits; security risk is primarily oracle data manipulation",
      "Decentralized Oracle Network architecture distributes trust across node operators",
      "Regular security audits by Certik, Trail of Bits, and internal teams",
    ],
    resiliencyNotes: [
      "Most widely integrated oracle solution ($20T+ in secured value)",
      "Strong enterprise partnerships (SWIFT, DTCC, ANZ Bank) support long-term demand",
      "Recent CCIP (Cross-Chain Interoperability Protocol) launch expands use case moat",
    ],
    recommendedAction: "Pending internal approval. Complete oracle risk assessment and NYDFS filing. Staking assessment in progress.",
    reviewDate: "2026-05-20",
    analyst: "Custody Ops Team",
    nydfsApproved: false,
  },
  {
    id: "asset-near",
    symbol: "NEAR",
    name: "NEAR Protocol",
    tier: "Under Review",
    custodyStatus: "Under Review",
    securityScore: 62,
    resiliencyScore: 66,
    overallRiskScore: 61,
    marketCap: "$7B",
    blockchain: "NEAR",
    consensusMechanism: "Nightshade (Sharded PoS)",
    stakingEligible: "Under Assessment",
    keyRisks: [
      "Sharding architecture adds operational complexity; limited custody precedent",
      "Smaller validator set than comparable Tier 2 assets",
      "Client diversity limited — primarily maintained by NEAR Foundation",
    ],
    securityNotes: [
      "Stateless validation design reduces storage requirements and improves security",
      "Formal verification of smart contract runtime in progress",
      "No critical consensus exploits to date on mainnet",
    ],
    resiliencyNotes: [
      "Backed by Andreessen Horowitz, Coinbase Ventures; strong funding runway",
      "Growing AI x blockchain narrative — attracting developer activity",
      "400+ validators; decentralization improving but below threshold for Tier 2",
    ],
    recommendedAction: "Under Review. Escalate to senior analyst for sharding complexity assessment before custody eligibility decision.",
    reviewDate: "2026-06-01",
    analyst: "Custody Ops Team",
    nydfsApproved: false,
  },
];

export const assetTiers: AssetTier[] = ["Tier 1", "Tier 2", "Tier 3", "Under Review"];
export const custodyStatuses: CustodyStatus[] = ["Approved", "Pending Approval", "Under Review", "Rejected"];
