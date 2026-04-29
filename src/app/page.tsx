"use client";

import Link from "next/link";
import {
  Shield,
  Zap,
  TrendingUp,
  FileText,
  Globe,
  Lock,
  ChevronRight,
  AlertTriangle,
  Users,
  ArrowRight,
  CheckCircle2,
  Rss,
  Briefcase,
  BarChart3,
  MapPin,
  Bell,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070708] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#070708]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#D4A843]/20 border border-[#D4A843]/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#D4A843]" />
            </div>
            <span className="text-sm font-bold tracking-wide">Regulus AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/intelligence" className="hover:text-white transition-colors">Intelligence</Link>
            <Link href="/briefs" className="hover:text-white transition-colors">AI Briefs</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm bg-[#D4A843] text-black font-semibold px-4 py-1.5 rounded hover:bg-[#F5C842] transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(#D4A843 1px, transparent 1px), linear-gradient(90deg, #D4A843 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[320px] bg-[#D4A843]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs font-medium px-3 py-1.5 rounded-full mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
            AI-powered regulatory early warning system · 15 jurisdictions monitored
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-[1.08] tracking-tight mb-5">
            Turn Regulatory Noise
            <br />
            <span className="text-[#D4A843]">Into Actionable Intelligence</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-4">
            Regulus AI monitors emerging policy, regulation, and stakeholder activity across jurisdictions —
            then converts it into executive-ready briefs, risk scores, and recommended actions.
          </p>
          <p className="text-sm text-zinc-500 max-w-xl mb-9">
            Built for public affairs, government relations, legal, compliance, and executive teams that cannot afford to miss policy change.
          </p>

          <div className="flex flex-wrap gap-3 mb-14">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-[#D4A843] text-black font-bold px-6 py-3 rounded text-sm hover:bg-[#F5C842] transition-all shadow-lg shadow-[#D4A843]/20"
            >
              View Demo Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/briefs"
              className="flex items-center gap-2 border border-[#D4A843]/40 text-[#D4A843] font-semibold px-6 py-3 rounded text-sm hover:bg-[#D4A843]/10 transition-all"
            >
              Generate AI Brief <FileText className="w-4 h-4" />
            </Link>
          </div>

          {/* Mini dashboard preview */}
          <div className="bg-[#0D0D0E] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/50" />
                <span className="w-3 h-3 rounded-full bg-amber-500/50" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <span className="text-xs text-zinc-500 font-mono">regulus-ai · command center</span>
              <span className="ml-auto flex items-center gap-1.5 text-[10px] text-[#D4A843]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
                Live policy feed
              </span>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3">
              {[
                { label: "Monitored Updates", value: "248", icon: Globe, change: "+14 today" },
                { label: "High-Priority Signals", value: "37", icon: AlertTriangle, change: "+3 new" },
                { label: "Jurisdictions", value: "15", icon: MapPin, change: "Tracked" },
                { label: "Briefing Time Saved", value: "91%", icon: Zap, change: "vs. manual" },
              ].map(({ label, value, icon: Icon, change }) => (
                <div key={label} className="bg-[#111112] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-tight">{label}</span>
                    <Icon className="w-3.5 h-3.5 text-[#D4A843]/50" />
                  </div>
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="text-[10px] text-[#D4A843] mt-0.5">{change}</div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4 grid grid-cols-3 gap-2">
              {[
                { title: "AI Accountability Act Advances to Committee", risk: "HIGH", score: 87, cat: "AI Governance" },
                { title: "Federal Data Privacy Rule Opens for Comment", risk: "HIGH", score: 91, cat: "Data Privacy" },
                { title: "Antitrust Guidelines Updated for Platforms", risk: "MEDIUM", score: 66, cat: "Competition" },
              ].map(({ title, risk, score, cat }) => (
                <div key={title} className="bg-[#111112] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-zinc-500">{cat}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${risk === "HIGH" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {risk}
                    </span>
                  </div>
                  <div className="text-xs text-white font-medium leading-snug mb-2">{title}</div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4A843] rounded-full" style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-[10px] text-[#D4A843] font-mono">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audience bar */}
      <section className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs text-zinc-600 text-center uppercase tracking-widest mb-5">
            Built for teams across government affairs, policy, legal, and executive functions
          </div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { icon: Globe, label: "Government Affairs" },
              { icon: Briefcase, label: "Public Affairs" },
              { icon: Shield, label: "Legal & Compliance" },
              { icon: BarChart3, label: "Executive & Strategy" },
              { icon: Users, label: "Policy & Regulatory" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 py-4 px-3 bg-[#0D0D0E] rounded-xl border border-white/5 text-center">
                <Icon className="w-5 h-5 text-[#D4A843]" />
                <span className="text-xs text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">The Problem</div>
            <h2 className="text-3xl font-bold">Policy change moves faster than your team</h2>
            <p className="text-zinc-500 text-sm mt-3 max-w-xl mx-auto">
              Bills, agency rules, enforcement guidance, stakeholder signals — the volume is impossible to track manually.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { stat: "40,000+", label: "regulatory documents published federally and across states each year" },
              { stat: "72hrs", label: "average time for a policy team to respond to a new regulatory signal" },
              { stat: "68%", label: "of compliance failures traced to missed early-stage legislative signals" },
            ].map(({ stat, label }) => (
              <div key={stat} className="bg-[#0D0D0E] border border-white/5 rounded-xl p-6 text-center">
                <div className="text-4xl font-black text-[#D4A843] mb-2">{stat}</div>
                <div className="text-sm text-zinc-400 leading-relaxed">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution — three pillars */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">The Solution</div>
            <h2 className="text-3xl font-bold">Map, track, brief, and report on the policy landscape</h2>
            <p className="text-zinc-500 text-sm mt-3 max-w-xl mx-auto">
              From bills, rules, and guidance to clear action — in one platform.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[
              {
                icon: Bell,
                title: "Monitor & Alert",
                desc: "Continuous monitoring of legislation, agency rulemaking, enforcement guidance, and stakeholder activity across federal and state jurisdictions.",
                features: ["Real-time regulatory signal detection", "Risk scoring at intake", "Multi-jurisdiction coverage"],
              },
              {
                icon: TrendingUp,
                title: "Assess & Prioritize",
                desc: "AI-powered risk scoring across jurisdictions based on urgency, enforcement posture, and business impact. Know what requires immediate action.",
                features: ["0–100 risk scores per signal", "Heat maps by category and geography", "Trend analysis over time"],
              },
              {
                icon: FileText,
                title: "Brief & Coordinate",
                desc: "AI-generated executive briefs tailored to legal, public affairs, product, or board audiences — in seconds, not days.",
                features: ["5 audience modes", "3 tone options", "Stakeholder workflow coordination"],
              },
            ].map(({ icon: Icon, title, desc, features }) => (
              <div key={title} className="bg-[#0D0D0E] border border-[#D4A843]/15 rounded-xl p-6 hover:border-[#D4A843]/40 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center mb-4 group-hover:bg-[#D4A843]/20 transition-all">
                  <Icon className="w-5 h-5 text-[#D4A843]" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{desc}</p>
                <ul className="space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A843]/70 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two core working features */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Core Features</div>
            <h2 className="text-3xl font-bold">Two live working components</h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#D4A843]/10 to-transparent border border-[#D4A843]/20 rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <Rss className="w-7 h-7 text-[#D4A843]" />
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 border border-emerald-700/30 px-2 py-0.5 rounded uppercase tracking-widest">Live</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Regulatory Intelligence Feed</h3>
              <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
                A real-time, filterable feed of regulatory updates. Search by jurisdiction, policy category, risk level, or status. Click any item for a full detail view, or generate an AI brief in one click.
              </p>
              <ul className="space-y-1.5 mb-6">
                {["Search + filter across 15 mock signals", "Detail drawer with obligations + timeline", "Direct route to brief generator"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A843]/70 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/intelligence" className="flex items-center gap-1.5 text-[#D4A843] text-sm font-semibold hover:gap-3 transition-all">
                Explore Feed <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-[#D4A843]/10 to-transparent border border-[#D4A843]/20 rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-7 h-7 text-[#D4A843]" />
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 border border-emerald-700/30 px-2 py-0.5 rounded uppercase tracking-widest">Live</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Policy Brief Generator</h3>
              <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
                Select any regulatory item, choose your audience and tone, and generate a structured brief in seconds — risk score, key obligations, recommended actions, and stakeholder messaging included.
              </p>
              <ul className="space-y-1.5 mb-6">
                {["5 audience types · 3 tone modes", "Structured brief with all key sections", "Copy-to-clipboard export"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A843]/70 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/briefs" className="flex items-center gap-1.5 text-[#D4A843] text-sm font-semibold hover:gap-3 transition-all">
                Generate Brief <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform modules */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Platform</div>
            <h2 className="text-3xl font-bold">Public affairs intelligence for modern regulatory teams</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: BarChart3, href: "/dashboard", label: "Command Center", desc: "KPIs, risk trends, heat maps, and signal tracker" },
              { icon: Rss, href: "/intelligence", label: "Intelligence Feed", desc: "Live policy signals with search, filter, and detail view" },
              { icon: FileText, href: "/briefs", label: "AI Brief Generator", desc: "Audience-tailored executive briefs from any signal" },
              { icon: Users, href: "/stakeholders", label: "Stakeholder Map", desc: "Manage legislators, agencies, coalitions, and internal owners" },
              { icon: Briefcase, href: "/campaigns", label: "Campaign Workspace", desc: "Track documents, tasks, and progress per campaign" },
              { icon: Globe, href: "/reports", label: "Reports & Analytics", desc: "Trend analysis, risk scoring, and export-ready insights" },
              { icon: Bell, href: "/intelligence", label: "Early Warning", desc: "Risk scoring at intake with real-time priority alerts" },
              { icon: TrendingUp, href: "/reports", label: "Jurisdiction Mapping", desc: "Monitor regulatory activity across 15+ jurisdictions" },
            ].map(({ icon: Icon, href, label, desc }) => (
              <Link key={label} href={href} className="bg-[#0D0D0E] border border-white/5 rounded-xl p-4 hover:border-[#D4A843]/30 hover:bg-[#D4A843]/5 transition-all group">
                <Icon className="w-5 h-5 text-[#D4A843]/60 mb-3 group-hover:text-[#D4A843] transition-colors" />
                <div className="text-sm font-semibold text-white mb-1">{label}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-14 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-6">Responsible by design</div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Human-in-the-loop review" },
              { icon: Lock, label: "Source-linked summaries" },
              { icon: CheckCircle2, label: "Audit-ready workflows" },
              { icon: Shield, label: "No black-box automation" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2.5 p-5 bg-[#0D0D0E] rounded-xl border border-white/5">
                <Icon className="w-5 h-5 text-[#D4A843]" />
                <span className="text-xs text-zinc-400 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4A843]/3 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <h2 className="text-3xl font-black mb-4">
            Policy intelligence for teams that cannot afford to miss change.
          </h2>
          <p className="text-zinc-400 mb-8 text-sm">Open the demo dashboard — no login required.</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#D4A843] text-black font-bold px-8 py-3.5 rounded text-sm hover:bg-[#F5C842] transition-all"
            >
              Open Command Center <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/intelligence"
              className="inline-flex items-center gap-2 border border-white/10 text-zinc-300 font-semibold px-6 py-3.5 rounded text-sm hover:bg-white/5 transition-all"
            >
              View Intelligence Feed
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded bg-[#D4A843]/20 border border-[#D4A843]/40 flex items-center justify-center">
                <Shield className="w-3 h-3 text-[#D4A843]" />
              </div>
              <span className="font-bold text-white text-sm">Regulus AI</span>
            </div>
            <div className="text-xs text-zinc-500">Intelligence. Compliance. Impact.</div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-zinc-600">
            <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Dashboard</Link>
            <Link href="/intelligence" className="hover:text-zinc-400 transition-colors">Intelligence</Link>
            <Link href="/briefs" className="hover:text-zinc-400 transition-colors">AI Briefs</Link>
            <Link href="/stakeholders" className="hover:text-zinc-400 transition-colors">Stakeholders</Link>
          </div>
          <div className="text-xs text-zinc-700">© 2026 Regulus AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

