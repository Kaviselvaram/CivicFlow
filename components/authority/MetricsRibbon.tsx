import React from "react";
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon, ShieldCheckIcon, TruckIcon } from "../icons";

interface MetricsRibbonProps {
  total: number;
  criticalCount: number;
  inProgressCount: number;
  resolvedCount: number;
  verifiedCount: number;
}

export function MetricsRibbon({
  total,
  criticalCount,
  inProgressCount,
  resolvedCount,
  verifiedCount,
}: MetricsRibbonProps) {
  const verificationRate =
    resolvedCount + verifiedCount > 0
      ? Math.round((verifiedCount / (resolvedCount + verifiedCount)) * 100)
      : 100;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {/* Active Reports */}
      <div className="bg-white border border-[#E7E1D7] rounded-2xl p-4.5 shadow-xs transition hover:border-[#14352B]/40 group">
        <div className="flex items-center justify-between text-[#687584] mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
            Active Reports
          </span>
          <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E7E1D7] flex items-center justify-center text-[#1E4E68] group-hover:scale-105 transition">
            <ClockIcon size={14} />
          </div>
        </div>
        <div className="font-serif font-black text-3xl text-[#12181F] tracking-tight">
          {total}
        </div>
        <p className="text-[11px] text-[#687584] mt-1 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Across 12 City Wards
        </p>
      </div>

      {/* Critical Triage */}
      <div className="bg-white border border-rose-200/80 rounded-2xl p-4.5 shadow-xs transition hover:border-rose-300 group">
        <div className="flex items-center justify-between text-rose-800 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-rose-800">
            Critical Triage
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 group-hover:scale-105 transition">
            <AlertTriangleIcon size={14} />
          </div>
        </div>
        <div className="font-serif font-black text-3xl text-rose-950 tracking-tight">
          {criticalCount}
        </div>
        <p className="text-[11px] text-rose-700 font-semibold mt-1 font-mono">
          ⚡ SLA Target: &lt; 4 Hours
        </p>
      </div>

      {/* Field Crews Active */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-4.5 shadow-xs transition hover:border-amber-300 group">
        <div className="flex items-center justify-between text-amber-800 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-800">
            Field Crews Active
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition">
            <TruckIcon size={14} />
          </div>
        </div>
        <div className="font-serif font-black text-3xl text-[#12181F] tracking-tight">
          {inProgressCount}
        </div>
        <p className="text-[11px] text-[#687584] mt-1 font-mono">
          Physical Remediation
        </p>
      </div>

      {/* Awaiting Verification */}
      <div className="bg-white border border-emerald-200/80 rounded-2xl p-4.5 shadow-xs transition hover:border-emerald-300 group">
        <div className="flex items-center justify-between text-emerald-800 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-800">
            Awaiting Signoff
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition">
            <CheckCircleIcon size={14} />
          </div>
        </div>
        <div className="font-serif font-black text-3xl text-emerald-950 tracking-tight">
          {resolvedCount}
        </div>
        <p className="text-[11px] text-emerald-700 font-semibold mt-1 font-mono">
          Citizen Proof Review
        </p>
      </div>

      {/* Verification Rate (Highlight Card) */}
      <div className="col-span-2 sm:col-span-1 bg-[#14352B] text-white rounded-2xl p-4.5 shadow-xs transition relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center justify-between text-white/70 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
            Verification Rate
          </span>
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#D94532]">
            <ShieldCheckIcon size={14} />
          </div>
        </div>
        <div className="font-serif font-black text-3xl text-[#FAF8F5] tracking-tight">
          {verificationRate}%
        </div>
        <p className="text-[11px] text-white/75 mt-1 font-mono">
          {verifiedCount} Sealed Closures
        </p>
      </div>
    </div>
  );
}

