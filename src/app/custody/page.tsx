"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Lock,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Zap,
  BarChart3,
  Globe,
  ExternalLink,
  Database,
  Loader2,
  Search,
} from "lucide-react";

interface DocumentWithAnalysis {
  id: string;
  title: string;
  source: string;
  jurisdiction: string;
  category: string;
  uploadedAt: string;
  _count: { chunks: number };
  analyses: Array<{
    id: string;
    riskScore: number;
    riskLevel: string;
    affectedAssets: string[];
    keyObligations: string[];
    custodyImpact: string;
    complianceDeadline: string | null;
    recommendedActions: string[];
    nydfsRelevance: boolean;
    stakingImpact: boolean;
  }>;
}
import { custodyAssets, type CustodyAsset } from "@/data/custodyAssets";
import { custodyRegulations } from "@/data/custodyRegulations";
import { riskColor, formatDate } from "@/lib/utils";

function tierColor(tier: string) {
  if (tier === "Tier 1") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  if (tier === "Tier 2") return "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/20";
  if (tier === "Tier 3") return "text-sky-400 bg-sky-400/10 border-sky-400/20";
  return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
}

function statusColor(status: string) {
  if (status === "Approved") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  if (status === "Under Review") return "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/20";
  if (status === "Pending Approval") return "text-sky-400 bg-sky-400/10 border-sky-400/20";
  return "text-red-400 bg-red-400/10 border-red-400/20";
}

function ScoreBar({ value, colorClass }: { value: number; colorClass: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono text-zinc-400 w-6 text-right">{value}</span>
    </div>
  );
}

function AssetRow({ asset }: { asset: CustodyAsset }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-black text-white">{asset.symbol.slice(0, 2)}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{asset.symbol}</div>
              <div className="text-[10px] text-zinc-500">{asset.name}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tierColor(asset.tier)}`}>
            {asset.tier}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusColor(asset.custodyStatus)}`}>
            {asset.custodyStatus}
          </span>
        </td>
        <td className="px-4 py-3 w-28">
          <ScoreBar value={asset.securityScore} colorClass="bg-sky-400" />
        </td>
        <td className="px-4 py-3 w-28">
          <ScoreBar value={asset.resiliencyScore} colorClass="bg-emerald-400" />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${asset.overallRiskScore <= 25 ? "bg-emerald-400" : asset.overallRiskScore <= 50 ? "bg-[#D4A843]" : "bg-red-400"}`}
            />
            <span className="text-sm font-mono font-bold text-white">{asset.overallRiskScore}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-xs text-zinc-400">{asset.marketCap}</td>
        <td className="px-4 py-3">
          {asset.stakingEligible === "Eligible" ? (
            <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded">
              {asset.annualizedYield}
            </span>
          ) : asset.stakingEligible === "Under Assessment" ? (
            <span className="text-[10px] text-zinc-500 bg-zinc-800 border border-white/10 px-1.5 py-0.5 rounded">
              Assessing
            </span>
          ) : (
            <span className="text-[10px] text-zinc-600">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </td>
      </tr>

      {expanded && (
        <tr className="bg-[#0A0A0B] border-b border-white/[0.04]">
          <td colSpan={9} className="px-6 py-5">
            <div className="grid grid-cols-3 gap-6">
              {/* Security notes */}
              <div>
                <div className="text-[10px] text-sky-400 uppercase tracking-widest font-bold mb-2.5 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Security Assessment
                </div>
                <ul className="space-y-1.5">
                  {asset.securityNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-3 h-3 text-sky-400/60 flex-shrink-0 mt-0.5" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resiliency notes */}
              <div>
                <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-2.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Resiliency Assessment
                </div>
                <ul className="space-y-1.5">
                  {asset.resiliencyNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400/60 flex-shrink-0 mt-0.5" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks + action */}
              <div>
                <div className="text-[10px] text-red-400 uppercase tracking-widest font-bold mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> Key Risk Vectors
                </div>
                <ul className="space-y-1.5 mb-4">
                  {asset.keyRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <AlertTriangle className="w-3 h-3 text-red-400/60 flex-shrink-0 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
                <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-lg p-3">
                  <div className="text-[10px] text-[#D4A843] uppercase tracking-widest font-bold mb-1">
                    Recommended Action
                  </div>
                  <div className="text-xs text-zinc-300 leading-relaxed">{asset.recommendedAction}</div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[10px] text-zinc-600">
                    {asset.nydfsApproved ? "✓ NYDFS Approved" : "○ NYDFS Pending"}
                  </span>
                  <span className="text-[10px] text-zinc-600">Reviewed {formatDate(asset.reviewDate)}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CustodyPage() {
  const [activeTab, setActiveTab] = useState<"assets" | "regulations" | "analysis">("assets");
  const [filterTier, setFilterTier] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [expandedReg, setExpandedReg] = useState<string | null>(null);
  const [dbDocuments, setDbDocuments] = useState<DocumentWithAnalysis[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

  const fetchDbDocuments = useCallback(async () => {
    setDbLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDbDocuments(data);
    } catch (err) {
      setDbError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "analysis") fetchDbDocuments();
  }, [activeTab, fetchDbDocuments]);

  async function runAnalysis(docId: string) {
    setAnalyzingIds((prev) => new Set(prev).add(docId));
    try {
      await fetch(`/api/documents/${docId}/analyze`, { method: "POST" });
      await fetchDbDocuments();
    } finally {
      setAnalyzingIds((prev) => { const n = new Set(prev); n.delete(docId); return n; });
    }
  }

  const approved = custodyAssets.filter((a) => a.custodyStatus === "Approved").length;
  const underReview = custodyAssets.filter((a) => a.custodyStatus === "Under Review").length;
  const pending = custodyAssets.filter((a) => a.custodyStatus === "Pending Approval").length;
  const stakingEnabled = custodyAssets.filter((a) => a.stakingEligible === "Eligible").length;

  const filteredAssets = custodyAssets.filter((a) => {
    if (filterTier !== "All" && a.tier !== filterTier) return false;
    if (filterStatus !== "All" && a.custodyStatus !== filterStatus) return false;
    return true;
  });

  const highRegs = custodyRegulations.filter((r) => r.riskLevel === "HIGH").length;

  return (
    <AppShell>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-xs text-zinc-500 uppercase tracking-widest">Custody Intelligence</div>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-900/30 border border-emerald-700/30 px-1.5 py-0.5 rounded uppercase tracking-widest">
                New
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Custody Operations Command Center</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Asset evaluation, risk scoring, and regulatory intelligence for Fireblocks Trust Company.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
              <div className="text-xs text-zinc-500">NYDFS Charter</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-semibold">Compliant</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
              <span className="text-xs text-[#D4A843] font-medium">Live · {custodyAssets.length} assets tracked</span>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Approved Assets",
              value: String(approved),
              delta: "Custody eligible",
              sub: "Tier 1 + Tier 2 cleared",
              icon: CheckCircle2,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
              border: "border-emerald-400/20",
            },
            {
              label: "Under Review",
              value: String(underReview + pending),
              delta: `${underReview} active reviews`,
              sub: `${pending} pending NYDFS approval`,
              icon: Clock,
              color: "text-[#D4A843]",
              bg: "bg-[#D4A843]/10",
              border: "border-[#D4A843]/20",
            },
            {
              label: "Staking-Enabled",
              value: String(stakingEnabled),
              delta: "Yield generation active",
              sub: "Via Figment integration",
              icon: TrendingUp,
              color: "text-sky-400",
              bg: "bg-sky-400/10",
              border: "border-sky-400/20",
            },
            {
              label: "Regulatory Alerts",
              value: String(custodyRegulations.length),
              delta: `${highRegs} high priority`,
              sub: "NYDFS, SEC, OCC, FinCEN",
              icon: AlertTriangle,
              color: "text-red-400",
              bg: "bg-red-400/10",
              border: "border-red-400/20",
            },
          ].map(({ label, value, delta, sub, icon: Icon, color, bg, border }) => (
            <div key={label} className={`bg-[#0D0D0E] border ${border} rounded-xl p-5 hover:brightness-110 transition-all`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-zinc-500 uppercase tracking-widest leading-tight max-w-[75%]">{label}</span>
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-0.5">{value}</div>
              <div className={`text-xs ${color} font-medium`}>{delta}</div>
              <div className="text-[10px] text-zinc-600 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Regulatory context banner */}
        <div className="bg-[#0D0D0E] border border-[#D4A843]/20 rounded-xl px-5 py-4 mb-6 flex items-center gap-6">
          <div className="w-8 h-8 rounded-lg bg-[#D4A843]/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-[#D4A843]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white mb-0.5">Fireblocks Trust Company — NYDFS Regulated Qualified Custodian</div>
            <div className="text-xs text-zinc-500">
              Operating under NY Limited Purpose Trust Company charter · Regulated by NYDFS · SEC no-action letter (Sept 2025) confirms state trust co. qualified custodian status for RIAs
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            {["BNY Mellon", "Galaxy", "Bakkt", "FalconX"].map((client) => (
              <div key={client} className="text-[10px] text-zinc-500 bg-zinc-800/60 px-2 py-1 rounded border border-white/5">
                {client}
              </div>
            ))}
            <span className="text-[10px] text-zinc-600">+ more</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 bg-[#0D0D0E] border border-white/5 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab("assets")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "assets"
                ? "bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Asset Evaluation
            </span>
          </button>
          <button
            onClick={() => setActiveTab("regulations")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "regulations"
                ? "bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Regulatory Feed
              <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-bold">
                {highRegs} HIGH
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "analysis"
                ? "bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5" /> Document Analysis
              <span className="text-[9px] bg-[#D4A843]/20 text-[#D4A843] border border-[#D4A843]/20 px-1.5 py-0.5 rounded font-bold">
                RAG
              </span>
            </span>
          </button>
        </div>

        {/* Asset Evaluation Tab */}
        {activeTab === "assets" && (
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Digital Asset Evaluation Matrix</div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Security & resiliency analysis for custody eligibility — click any row to expand assessment
                </div>
              </div>
              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  className="text-xs bg-zinc-900 border border-white/10 text-zinc-400 px-2 py-1.5 rounded outline-none"
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                >
                  <option value="All">All Tiers</option>
                  <option value="Tier 1">Tier 1</option>
                  <option value="Tier 2">Tier 2</option>
                  <option value="Tier 3">Tier 3</option>
                  <option value="Under Review">Under Review</option>
                </select>
                <select
                  className="text-xs bg-zinc-900 border border-white/10 text-zinc-400 px-2 py-1.5 rounded outline-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Pending Approval">Pending Approval</option>
                </select>
              </div>
            </div>

            {/* Score legend */}
            <div className="px-5 py-2 border-b border-white/5 flex items-center gap-6 bg-[#080809]">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Score Legend:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="text-[10px] text-zinc-500">Security (higher = safer)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-zinc-500">Resiliency (higher = more resilient)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#D4A843]" />
                <span className="text-[10px] text-zinc-500">Overall Risk (lower = less risk)</span>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Asset", "Tier", "Custody Status", "Security Score", "Resiliency Score", "Risk Score", "Mkt Cap", "Staking Yield", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <AssetRow key={asset.id} asset={asset} />
                ))}
              </tbody>
            </table>

            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-600">
                Showing {filteredAssets.length} of {custodyAssets.length} assets
              </span>
              <span className="text-xs text-zinc-600">
                Last updated: June 9, 2026 · Analyst: Custody Ops Team
              </span>
            </div>
          </div>
        )}

        {/* Regulatory Feed Tab */}
        {activeTab === "regulations" && (
          <div className="bg-[#0D0D0E] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Digital Asset Custody Regulatory Feed</div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  NYDFS · SEC · OCC · FinCEN · CFTC · IRS · EBA — custody-specific regulatory signals
                </div>
              </div>
              <Link
                href="/briefs"
                className="flex items-center gap-1.5 text-xs bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] px-3 py-1.5 rounded hover:bg-[#D4A843]/20 transition-all"
              >
                <Zap className="w-3 h-3" /> Generate Custody Brief
              </Link>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {custodyRegulations.map((reg) => (
                <div key={reg.id}>
                  <div
                    className="px-5 py-4 flex items-start gap-4 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => setExpandedReg(expandedReg === reg.id ? null : reg.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${riskColor(reg.riskLevel)}`}>
                          {reg.riskLevel}
                        </span>
                        <span className="text-[10px] text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded">
                          {reg.category}
                        </span>
                        <span className="text-[10px] text-zinc-600">{reg.jurisdiction}</span>
                        <span className="text-[10px] text-zinc-600">{reg.source}</span>
                      </div>
                      <div className="text-sm text-white font-medium mb-1">{reg.title}</div>
                      <div className="text-xs text-zinc-500 leading-relaxed">{reg.summary}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xl font-black text-[#D4A843] font-mono leading-none">{reg.riskScore}</div>
                        <div className="text-[10px] text-zinc-600">risk score</div>
                      </div>
                      <div className="text-[10px] text-zinc-500">{formatDate(reg.date)}</div>
                      {expandedReg === reg.id ? (
                        <ChevronUp className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                  </div>

                  {expandedReg === reg.id && (
                    <div className="px-5 pb-5 bg-[#0A0A0B] border-t border-white/5">
                      <div className="grid grid-cols-3 gap-6 pt-5">
                        {/* Why it matters */}
                        <div className="col-span-3">
                          <div className="text-[10px] text-[#D4A843] uppercase tracking-widest font-bold mb-2">Why It Matters for Custody Ops</div>
                          <p className="text-sm text-zinc-300 leading-relaxed bg-[#D4A843]/5 border border-[#D4A843]/15 rounded-lg px-4 py-3">
                            {reg.whyItMatters}
                          </p>
                        </div>

                        {/* Key obligations */}
                        <div>
                          <div className="text-[10px] text-sky-400 uppercase tracking-widest font-bold mb-2.5">Key Obligations</div>
                          <ul className="space-y-1.5">
                            {reg.keyObligations.map((o, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                                <span className="text-sky-400 font-mono text-[10px] mt-0.5 flex-shrink-0">{i + 1}.</span>
                                {o}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommended actions */}
                        <div>
                          <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-2.5">Recommended Actions</div>
                          <ul className="space-y-1.5">
                            {reg.recommendedActions.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400/60 flex-shrink-0 mt-0.5" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Timeline + teams */}
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2.5">Timeline & Teams</div>
                          <div className="bg-zinc-900/50 border border-white/5 rounded-lg px-3 py-3 mb-3">
                            <div className="text-[10px] text-zinc-600 mb-0.5">Deadline</div>
                            <div className="text-xs text-white">{reg.timeline}</div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {reg.affectedTeams.map((t) => (
                              <span key={t} className="text-[10px] text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded border border-white/5">
                                {t}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <Link
                              href={`/briefs?documentId=${reg.id}`}
                              className="flex items-center gap-1.5 text-xs bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] px-3 py-1.5 rounded hover:bg-[#D4A843]/20 transition-all"
                            >
                              <FileText className="w-3 h-3" /> Generate Brief
                            </Link>
                            <a
                              href={reg.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs border border-white/10 text-zinc-500 px-3 py-1.5 rounded hover:bg-white/5 transition-all"
                            >
                              <ExternalLink className="w-3 h-3" /> Source
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-white/5">
              <span className="text-xs text-zinc-600">
                {custodyRegulations.length} custody-specific regulations tracked · {highRegs} high priority · Sources: NYDFS, SEC, OCC, FinCEN, CFTC, IRS, EBA
              </span>
            </div>
          </div>
        )}

        {/* Document Analysis Tab */}
        {activeTab === "analysis" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-zinc-500">
                Documents with AI-powered custody analysis from the RAG corpus
              </div>
              <Link
                href="/upload"
                className="flex items-center gap-1.5 text-xs bg-[#D4A843] text-black font-bold px-3 py-1.5 rounded-lg hover:bg-[#F5C842] transition-all"
              >
                <Database className="w-3 h-3" /> Upload Document
              </Link>
            </div>

            {dbError && (
              <div className="mb-4 flex items-center gap-2 bg-red-900/20 border border-red-600/30 rounded-lg px-4 py-3 text-sm text-red-300">
                Database unavailable — {dbError}. Start PostgreSQL to use this tab.
              </div>
            )}

            {dbLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-[#D4A843] animate-spin" />
              </div>
            ) : dbDocuments.length === 0 && !dbError ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-[#0D0D0E] border border-white/5 rounded-xl">
                <Database className="w-10 h-10 text-zinc-700 mb-3" />
                <div className="text-sm text-zinc-500 mb-1">No documents in corpus yet</div>
                <div className="text-xs text-zinc-700">
                  <Link href="/upload" className="text-[#D4A843] hover:underline">Upload a regulatory document</Link> to get started
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {dbDocuments.map((doc) => {
                  const analysis = doc.analyses[0];
                  const isAnalyzing = analyzingIds.has(doc.id);
                  return (
                    <div
                      key={doc.id}
                      className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {analysis && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                  analysis.riskLevel === "HIGH"
                                    ? "text-red-400 bg-red-400/10 border-red-400/20"
                                    : analysis.riskLevel === "MEDIUM"
                                    ? "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/20"
                                    : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                                }`}
                              >
                                {analysis.riskLevel}
                              </span>
                            )}
                            {analysis?.nydfsRelevance && (
                              <span className="text-[9px] text-sky-400 bg-sky-400/10 border border-sky-400/20 px-1.5 py-0.5 rounded font-bold">
                                NYDFS
                              </span>
                            )}
                            {analysis?.stakingImpact && (
                              <span className="text-[9px] text-purple-400 bg-purple-400/10 border border-purple-400/20 px-1.5 py-0.5 rounded font-bold">
                                STAKING
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-white">{doc.title}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">
                            {doc.source} · {doc.jurisdiction} · {doc._count.chunks} chunks
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {analysis && (
                            <div className="text-right mr-2">
                              <div className="text-[10px] text-zinc-600">Risk</div>
                              <div
                                className={`text-xl font-black font-mono ${
                                  analysis.riskScore >= 75
                                    ? "text-red-400"
                                    : analysis.riskScore >= 50
                                    ? "text-[#D4A843]"
                                    : "text-emerald-400"
                                }`}
                              >
                                {analysis.riskScore}
                              </div>
                            </div>
                          )}
                          {isAnalyzing ? (
                            <div className="flex items-center gap-1.5 text-xs text-[#D4A843]">
                              <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                            </div>
                          ) : !analysis ? (
                            <button
                              onClick={() => runAnalysis(doc.id)}
                              className="flex items-center gap-1.5 text-xs bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] px-2.5 py-1.5 rounded hover:bg-[#D4A843]/20 transition-all"
                            >
                              <Zap className="w-3 h-3" /> Run Analysis
                            </button>
                          ) : null}
                          <Link
                            href={`/query?documentId=${doc.id}`}
                            className="flex items-center gap-1 text-xs bg-white/5 border border-white/10 text-zinc-400 px-2.5 py-1.5 rounded hover:bg-white/10 transition-all"
                          >
                            <Search className="w-3 h-3" /> Ask
                          </Link>
                        </div>
                      </div>

                      {analysis && (
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/5">
                          <div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">
                              Custody Impact
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">{analysis.custodyImpact}</p>
                          </div>
                          <div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">
                              Key Obligations
                            </div>
                            <ul className="space-y-1">
                              {analysis.keyObligations.slice(0, 3).map((o, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-400">
                                  <span className="text-[#D4A843] font-mono mt-0.5 flex-shrink-0">{i + 1}.</span>
                                  {o}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {analysis.affectedAssets.length > 0 && (
                            <div>
                              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">
                                Affected Assets
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {analysis.affectedAssets.map((a) => (
                                  <span
                                    key={a}
                                    className="text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded"
                                  >
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {analysis.complianceDeadline && (
                            <div>
                              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">
                                Compliance Deadline
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-[#D4A843]">
                                <Clock className="w-3 h-3" />
                                {analysis.complianceDeadline}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Bottom info strip */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            {
              icon: Shield,
              title: "NYDFS-Regulated Framework",
              desc: "All asset approvals and custody procedures comply with NY Limited Purpose Trust Company requirements and BitLicense standards.",
            },
            {
              icon: Zap,
              title: "AI-Assisted Asset Analysis",
              desc: "Security and resiliency scoring integrates on-chain analytics, validator data, and market risk vectors to surface custody risk at a glance.",
            },
            {
              icon: ArrowUpRight,
              title: "Cross-Functional Workflow",
              desc: "Asset evaluations feed directly into compliance, legal, and product teams — tracking decisions from analysis through NYDFS approval.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
              <div className="w-8 h-8 rounded-lg bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-[#D4A843]" />
              </div>
              <div className="text-sm font-semibold text-white mb-1">{title}</div>
              <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
