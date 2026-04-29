"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import {
  FileText,
  ChevronDown,
  Copy,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react";
import { regulatoryUpdates } from "@/data/regulatoryUpdates";
import { generateBrief, briefToText, type Audience, type Tone } from "@/lib/briefGenerator";
import { riskColor, riskScoreColor, formatDate } from "@/lib/utils";

const audiences: Audience[] = ["Executive", "Legal", "Public Affairs", "Product", "Compliance"];
const tones: Tone[] = ["Concise", "Detailed", "Board-Ready"];

function BriefsContent() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("documentId");

  const [docId, setDocId] = useState(preselected || "");
  const [audience, setAudience] = useState<Audience>("Executive");
  const [tone, setTone] = useState<Tone>("Concise");
  const [brief, setBrief] = useState<ReturnType<typeof generateBrief> | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preselected) setDocId(preselected);
  }, [preselected]);

  const selectedDoc = regulatoryUpdates.find((r) => r.id === docId);

  const handleGenerate = () => {
    if (!selectedDoc) return;
    setLoading(true);
    setBrief(null);
    setTimeout(() => {
      setBrief(generateBrief(selectedDoc, audience, tone));
      setLoading(false);
    }, 1200);
  };

  const handleCopy = () => {
    if (!brief) return;
    navigator.clipboard.writeText(briefToText(brief));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="p-8">
        <div className="mb-6">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">AI Generator</div>
          <h1 className="text-2xl font-black text-white">AI Compliance Brief Generator</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Select a regulatory document, choose your audience and tone, generate an executive brief in seconds.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Config panel */}
          <div className="space-y-4">
            {/* Document picker */}
            <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
              <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
                1. Select Regulatory Document
              </div>
              <div className="relative">
                <select
                  value={docId}
                  onChange={(e) => setDocId(e.target.value)}
                  className="w-full appearance-none bg-[#111112] border border-white/8 text-sm text-white rounded-lg px-3 py-2.5 pr-8 outline-none focus:border-[#D4A843]/50 focus:ring-1 focus:ring-[#D4A843]/20 cursor-pointer transition-all"
                >
                  <option value="" className="bg-[#111112]">
                    — Choose a document —
                  </option>
                  {regulatoryUpdates.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#111112]">
                      [{r.riskLevel}] {r.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>

              {selectedDoc && (
                <div className="mt-3 bg-[#111112] border border-[#D4A843]/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${riskColor(selectedDoc.riskLevel)}`}>
                      {selectedDoc.riskLevel}
                    </span>
                    <span className="text-[10px] text-zinc-500">{selectedDoc.category}</span>
                    <span className="text-[10px] text-zinc-600">{selectedDoc.jurisdiction}</span>
                  </div>
                  <div className="text-xs text-white font-medium mb-1">{selectedDoc.title}</div>
                  <div className="text-[10px] text-zinc-500">
                    {selectedDoc.source} · {formatDate(selectedDoc.date)} · Risk:{" "}
                    <span className={`font-bold ${riskScoreColor(selectedDoc.riskScore)}`}>
                      {selectedDoc.riskScore}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Audience */}
            <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
              <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">2. Choose Audience</div>
              <div className="grid grid-cols-3 gap-2">
                {audiences.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`text-xs rounded-lg px-3 py-2 border transition-all ${
                      audience === a
                        ? "bg-[#D4A843]/15 border-[#D4A843]/50 text-[#D4A843] font-semibold"
                        : "bg-[#111112] border-white/8 text-zinc-400 hover:border-white/20 hover:text-zinc-300"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5">
              <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">3. Select Tone</div>
              <div className="grid grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`text-xs rounded-lg px-3 py-2 border transition-all ${
                      tone === t
                        ? "bg-[#D4A843]/15 border-[#D4A843]/50 text-[#D4A843] font-semibold"
                        : "bg-[#111112] border-white/8 text-zinc-400 hover:border-white/20 hover:text-zinc-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[10px] text-zinc-600">
                {tone === "Concise" && "Key points only. Action-focused summary."}
                {tone === "Detailed" && "Comprehensive analysis with full context."}
                {tone === "Board-Ready" && "Strategic framing for executive presentations."}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!selectedDoc || loading}
              className={`w-full flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-xl transition-all ${
                !selectedDoc || loading
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  : "bg-[#D4A843] text-black hover:bg-[#F5C842] shadow-lg shadow-[#D4A843]/20"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Brief...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate AI Brief
                </>
              )}
            </button>

            {!selectedDoc && (
              <div className="flex items-center gap-2 text-xs text-zinc-600 justify-center">
                <AlertCircle className="w-3.5 h-3.5" />
                Select a document to generate a brief
              </div>
            )}
          </div>

          {/* Brief output */}
          <div>
            {!brief && !loading && (
              <div className="h-full bg-[#0D0D0E] border border-white/5 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-10">
                <FileText className="w-12 h-12 text-zinc-700 mb-4" />
                <div className="text-sm text-zinc-500 mb-1">Your brief will appear here</div>
                <div className="text-xs text-zinc-700">
                  Configure options on the left and click Generate
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full bg-[#0D0D0E] border border-[#D4A843]/20 rounded-xl flex flex-col items-center justify-center text-center p-10">
                <Loader2 className="w-10 h-10 text-[#D4A843] animate-spin mb-4" />
                <div className="text-sm text-[#D4A843] mb-1">Generating your brief...</div>
                <div className="text-xs text-zinc-600">Analyzing obligations · Scoring risk · Drafting recommendations</div>
              </div>
            )}

            {brief && (
              <div className="bg-[#0D0D0E] border border-[#D4A843]/30 rounded-xl overflow-hidden">
                {/* Brief header */}
                <div className="px-5 py-4 border-b border-white/5 bg-[#D4A843]/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Regulus AI · Policy Brief</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-600" />
                      <span className="text-[10px] text-zinc-500">{brief.audience} · {brief.tone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] px-2.5 py-1.5 rounded hover:bg-[#D4A843]/20 transition-all"
                      >
                        {copied ? (
                          <><CheckCircle2 className="w-3 h-3" /> Copied!</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy Brief</>
                        )}
                      </button>
                      <button className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 text-zinc-400 px-2.5 py-1.5 rounded hover:bg-white/10 transition-all">
                        <Download className="w-3 h-3" /> PDF
                      </button>
                      <button className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 text-zinc-400 px-2.5 py-1.5 rounded hover:bg-white/10 transition-all">
                        <Share2 className="w-3 h-3" /> Share
                      </button>
                    </div>
                  </div>
                  <h2 className="text-sm font-bold text-white">{brief.title}</h2>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    Generated {new Date(brief.generatedAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-5 space-y-5 max-h-[600px] overflow-y-auto">
                  {/* Risk banner */}
                  <div className={`flex items-center gap-3 rounded-lg px-4 py-3 border ${
                    brief.riskLevel === "HIGH"
                      ? "bg-red-500/10 border-red-500/30"
                      : brief.riskLevel === "MEDIUM"
                      ? "bg-[#D4A843]/10 border-[#D4A843]/30"
                      : "bg-emerald-500/10 border-emerald-500/30"
                  }`}>
                    <div className="text-3xl font-black text-[#D4A843] font-mono">{brief.riskScore}</div>
                    <div>
                      <div className={`text-xs font-bold ${riskColor(brief.riskLevel as any).split(" ")[0]}`}>
                        {brief.riskLevel} RISK
                      </div>
                      <div className="text-[10px] text-zinc-500">{brief.urgency}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-xs text-zinc-500">Confidence</div>
                      <div className="text-sm font-bold text-[#D4A843]">{brief.confidenceLevel}%</div>
                    </div>
                  </div>

                  <BriefSection title="Executive Summary">{brief.executiveSummary}</BriefSection>
                  <BriefSection title="Why It Matters">{brief.whyItMatters}</BriefSection>

                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Key Obligations</div>
                    <ol className="space-y-1.5">
                      {brief.keyObligations.map((o, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <span className="text-[#D4A843] font-mono text-[10px] mt-0.5 flex-shrink-0">{i + 1}.</span>
                          {o}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Affected Teams</div>
                    <div className="flex flex-wrap gap-1.5">
                      {brief.affectedTeams.map((t) => (
                        <span key={t} className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Recommended Next Steps</div>
                    <ol className="space-y-1.5">
                      {brief.recommendedNextSteps.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                          <span className="w-4 h-4 rounded-full bg-[#D4A843]/20 text-[#D4A843] text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                      Suggested Stakeholder Messaging
                    </div>
                    <div className="bg-[#111112] border border-white/5 rounded-lg px-4 py-3 text-xs text-zinc-300 italic leading-relaxed">
                      {brief.stakeholderMessaging}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Timeline & Urgency</div>
                    <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-lg px-4 py-3">
                      <div className="text-xs text-zinc-300 mb-1">{brief.timeline}</div>
                      <div className="text-xs font-semibold text-[#D4A843]">{brief.urgency}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Source Reference</div>
                    <div className="text-[10px] text-zinc-500">{brief.sourceReference}</div>
                  </div>

                  {/* Disclaimer */}
                  <div className="flex items-start gap-2 bg-zinc-900/80 border border-white/5 rounded-lg px-4 py-3">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-[10px] text-zinc-500 leading-relaxed">{brief.disclaimer}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function BriefSection({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">{title}</div>
      <p className="text-xs text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}

export default function BriefsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-zinc-500">Loading...</div>}>
      <BriefsContent />
    </Suspense>
  );
}
