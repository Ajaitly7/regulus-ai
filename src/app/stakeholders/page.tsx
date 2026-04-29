"use client";

import AppShell from "@/components/layout/AppShell";
import { Users, Building2, Landmark, Network, Mail, Star, ChevronDown, Globe, Handshake } from "lucide-react";

const stakeholders = [
  {
    id: 1,
    name: "Sen. Maria Cantwell",
    role: "Chair, Senate Commerce Committee",
    type: "Legislator",
    jurisdiction: "Federal (US)",
    alignment: 72,
    strength: 85,
    issues: ["AI Governance", "Data Privacy", "Consumer Protection"],
    lastContact: "Apr 12, 2026",
    notes: "Key vote on AI Accountability Act. Previously supportive of industry-led standards. Open to technical briefings.",
    icon: Landmark,
    party: "D",
  },
  {
    id: 2,
    name: "House Energy & Commerce Committee",
    role: "Congressional Committee",
    type: "Committee",
    jurisdiction: "Federal (US)",
    alignment: 64,
    strength: 78,
    issues: ["Data Privacy", "AI Governance", "Healthcare Data"],
    lastContact: "Apr 5, 2026",
    notes: "Active on federal preemption debate. Staff-level briefings most effective. Bipartisan working group on privacy.",
    icon: Landmark,
    party: null,
  },
  {
    id: 3,
    name: "FTC Office of Technology",
    role: "Federal Regulatory Agency",
    type: "Agency",
    jurisdiction: "Federal (US)",
    alignment: 58,
    strength: 90,
    issues: ["Consumer Protection", "AI Advertising", "Data Privacy"],
    lastContact: "Mar 28, 2026",
    notes: "Rulemaking on AI endorsement guidance. Responsive to industry comments. Annual workshop outreach effective.",
    icon: Building2,
    party: null,
  },
  {
    id: 4,
    name: "Chamber of Commerce AI Coalition",
    role: "Industry Trade Association",
    type: "Trade Association",
    jurisdiction: "Federal (US)",
    alignment: 91,
    strength: 78,
    issues: ["AI Governance", "Federal Privacy", "Competition"],
    lastContact: "Apr 20, 2026",
    notes: "Closely aligned on preemption strategy. Coordinate joint comment letters here. Co-sign opportunities available.",
    icon: Network,
    party: null,
  },
  {
    id: 5,
    name: "California Attorney General",
    role: "State Enforcement Authority",
    type: "Agency",
    jurisdiction: "California (US)",
    alignment: 45,
    strength: 70,
    issues: ["Consumer Protection", "Data Privacy", "Advertising"],
    lastContact: "Mar 15, 2026",
    notes: "Leading state privacy enforcement posture. Proactive outreach through state affairs counsel recommended.",
    icon: Building2,
    party: null,
  },
  {
    id: 6,
    name: "Future of Privacy Forum",
    role: "Non-Profit Think Tank",
    type: "Civil Society",
    jurisdiction: "Federal (US)",
    alignment: 55,
    strength: 60,
    issues: ["Data Privacy", "AI Governance", "Children's Safety"],
    lastContact: "Feb 28, 2026",
    notes: "Credibility signal for privacy-forward positions. Co-authorship opportunities on policy white papers.",
    icon: Users,
    party: null,
  },
  {
    id: 7,
    name: "European Data Protection Board",
    role: "EU Regulatory Body",
    type: "Agency",
    jurisdiction: "EU / International",
    alignment: 50,
    strength: 65,
    issues: ["Data Privacy", "Cross-Border Transfer", "AI Governance"],
    lastContact: "Feb 10, 2026",
    notes: "Key decision-maker on adequacy and transfer impact assessments. Engagement through EU Privacy Coalition.",
    icon: Globe,
    party: null,
  },
  {
    id: 8,
    name: "Chief Compliance Officer (Internal)",
    role: "Internal Owner · Compliance",
    type: "Internal",
    jurisdiction: "Internal",
    alignment: 95,
    strength: 99,
    issues: ["All Policy Areas"],
    lastContact: "Apr 25, 2026",
    notes: "Primary internal stakeholder for all regulatory briefs. Receives weekly digest. Drives board-level reporting.",
    icon: Handshake,
    party: null,
  },
  {
    id: 9,
    name: "TechNet Policy Council",
    role: "Technology Industry Coalition",
    type: "Trade Association",
    jurisdiction: "Federal (US)",
    alignment: 84,
    strength: 72,
    issues: ["AI Governance", "Data Privacy", "Cybersecurity"],
    lastContact: "Apr 8, 2026",
    notes: "Active in federal AI rulemaking comment coordination. Regular joint briefings with member companies.",
    icon: Network,
    party: null,
  },
];

const typeColors: Record<string, string> = {
  Legislator: "text-amber-300 bg-amber-900/20 border-amber-700/30",
  Committee: "text-yellow-300 bg-yellow-900/20 border-yellow-700/30",
  Agency: "text-sky-300 bg-sky-900/20 border-sky-700/30",
  "Trade Association": "text-emerald-300 bg-emerald-900/20 border-emerald-700/30",
  "Civil Society": "text-purple-300 bg-purple-900/20 border-purple-700/30",
  Internal: "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/30",
};

const typeOptions = ["All", "Legislator", "Committee", "Agency", "Trade Association", "Civil Society", "Internal"];

export default function StakeholdersPage() {
  return (
    <AppShell>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Public Affairs</div>
            <h1 className="text-2xl font-black text-white">Stakeholder Map</h1>
            <p className="text-sm text-zinc-500 mt-1 max-w-xl">
              Manage legislative relationships, agency contacts, coalition coordination, and internal engagement across your regulatory portfolio.
            </p>
          </div>
          <button className="text-sm bg-[#D4A843] text-black font-bold px-4 py-2 rounded hover:bg-[#F5C842] transition-all">
            + Add Stakeholder
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-5 gap-3 mb-5">
          {[
            { label: "Legislators", count: 2, color: "text-amber-400" },
            { label: "Agencies", count: 3, color: "text-sky-400" },
            { label: "Trade Assoc.", count: 2, color: "text-emerald-400" },
            { label: "Civil Society", count: 1, color: "text-purple-400" },
            { label: "Internal", count: 1, color: "text-[#D4A843]" },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-[#0D0D0E] border border-white/5 rounded-xl p-3 text-center">
              <div className={`text-xl font-black ${color}`}>{count}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#0D0D0E] border border-white/5 rounded-xl p-4 mb-5 flex gap-2 items-center flex-wrap">
          <span className="text-xs text-zinc-500">Filter:</span>
          {typeOptions.map((t) => (
            <button
              key={t}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                t === "All"
                  ? "bg-[#D4A843]/10 border-[#D4A843]/40 text-[#D4A843]"
                  : "bg-[#111112] border-white/8 text-zinc-400 hover:border-white/20"
              }`}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            {["Issue Area", "Jurisdiction", "Engagement"].map((f) => (
              <button key={f} className="flex items-center gap-1.5 text-xs bg-[#111112] border border-white/8 text-zinc-400 px-3 py-1.5 rounded-lg hover:border-white/20 transition-all">
                {f} <ChevronDown className="w-3 h-3" />
              </button>
            ))}
          </div>
          <div className="text-xs text-zinc-600">{stakeholders.length} stakeholders</div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {stakeholders.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="bg-[#0D0D0E] border border-white/5 rounded-xl p-5 hover:border-[#D4A843]/25 transition-all group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#D4A843]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <span className="text-sm font-semibold text-white leading-tight">{s.name}</span>
                      {s.party && (
                        <span className={`text-[9px] font-bold px-1 rounded ${s.party === "D" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"}`}>
                          {s.party}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-500 leading-tight">{s.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded border ${typeColors[s.type] || "text-zinc-400 bg-zinc-800/50 border-zinc-600/30"}`}>
                    {s.type}
                  </span>
                  <span className="text-[10px] text-zinc-600 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                    {s.jurisdiction}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-zinc-500">Issue Alignment</span>
                      <span className="text-[10px] text-[#D4A843] font-mono">{s.alignment}%</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4A843] rounded-full" style={{ width: `${s.alignment}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-zinc-500">Relationship Strength</span>
                      <span className="text-[10px] text-sky-400 font-mono">{s.strength}%</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full" style={{ width: `${s.strength}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {s.issues.slice(0, 3).map((issue) => (
                    <span key={issue} className="text-[9px] bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 px-1.5 py-0.5 rounded">
                      {issue}
                    </span>
                  ))}
                </div>

                <div className="bg-[#111112] rounded-lg p-2.5 mb-3">
                  <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">{s.notes}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                    <Star className="w-3 h-3" />
                    {s.lastContact}
                  </div>
                  <button className="flex items-center gap-1 text-[10px] bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] px-2 py-1 rounded hover:bg-[#D4A843]/20 transition-all">
                    <Mail className="w-3 h-3" />
                    Draft Outreach
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
