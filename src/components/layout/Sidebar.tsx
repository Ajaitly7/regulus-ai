"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Rss,
  FileText,
  Users,
  Briefcase,
  BarChart3,
  Shield,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { label: "Intelligence Feed", href: "/intelligence", icon: Rss },
  { label: "AI Brief Generator", href: "/briefs", icon: FileText },
  { label: "Stakeholder Map", href: "/stakeholders", icon: Users },
  { label: "Campaigns", href: "/campaigns", icon: Briefcase },
  { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-62 bg-[#080809] border-r border-gold/10 flex flex-col z-50" style={{ width: 240 }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[#D4A843]/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-[#D4A843]/20 border border-[#D4A843]/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#D4A843]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">Regulus AI</div>
            <div className="text-[10px] text-[#D4A843]/60 tracking-widest uppercase">Public Affairs Intelligence</div>
          </div>
        </Link>
      </div>

      {/* Live signal pill */}
      <div className="px-4 py-3 border-b border-[#D4A843]/10">
        <div className="flex items-center gap-2 bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-lg px-2.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
          <span className="text-[11px] text-[#D4A843]/80 font-medium">37 live policy signals</span>
          <Bell className="w-3 h-3 text-[#D4A843] ml-auto" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                active
                  ? "bg-[#D4A843]/10 text-[#D4A843] border border-[#D4A843]/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-[#D4A843]" : "text-zinc-500")} />
              <span className="leading-tight">{label}</span>
              {label === "AI Brief Generator" && (
                <span className="ml-auto text-[9px] bg-[#D4A843]/20 text-[#D4A843] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Section divider */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Platform</div>
        <div className="grid grid-cols-2 gap-1">
          {[
            { label: "15 jurisdictions" },
            { label: "248 signals" },
            { label: "5 audiences" },
            { label: "3 tones" },
          ].map(({ label }) => (
            <div key={label} className="text-[10px] text-zinc-700 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#D4A843]/40" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#D4A843]/10">
        <div className="text-[10px] text-zinc-600 text-center leading-relaxed">
          Regulus AI · v1.0
          <br />
          <span className="text-zinc-700">Intelligence. Compliance. Impact.</span>
        </div>
      </div>
    </aside>
  );
}
