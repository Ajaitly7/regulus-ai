import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "@/data/regulatoryUpdates";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function riskColor(level: RiskLevel) {
  switch (level) {
    case "HIGH":
      return "text-red-400 bg-red-400/10 border-red-400/30";
    case "MEDIUM":
      return "text-amber-400 bg-amber-400/10 border-amber-400/30";
    case "LOW":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
  }
}

export function riskScoreColor(score: number) {
  if (score >= 80) return "text-red-400";
  if (score >= 60) return "text-amber-400";
  return "text-emerald-400";
}

export function statusColor(status: string) {
  switch (status) {
    case "Enacted":
      return "text-red-300 bg-red-900/30 border-red-700/40";
    case "Final":
      return "text-gold bg-gold/10 border-gold/30";
    case "Active":
      return "text-amber-300 bg-amber-900/30 border-amber-700/40";
    case "Pending":
      return "text-sky-400 bg-sky-900/30 border-sky-700/40";
    case "Draft":
      return "text-zinc-400 bg-zinc-800/50 border-zinc-600/30";
    default:
      return "text-zinc-400 bg-zinc-800/50 border-zinc-600/30";
  }
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
