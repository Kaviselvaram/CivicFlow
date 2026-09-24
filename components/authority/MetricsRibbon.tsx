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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#788290] mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
            Active Reports
          </span>
          <ClockIcon size={16} className="text-[#244B5C]" />
        </div>
        <div className="font-display font-bold text-2xl text-[#182026]">
          {total}
        </div>
        <p className="text-[11px] text-[#788290] mt-0.5 font-mono">
          Across 12 City Wards
        </p>
      </div>

      <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#788290] mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-rose-800">
            Critical Triage
          </span>
          <AlertTriangleIcon size={16} className="text-rose-600" />
        </div>
        <div className="font-display font-bold text-2xl text-rose-950">
          {criticalCount}
        </div>
        <p className="text-[11px] text-rose-700 mt-0.5 font-mono">
          SLA Under 4h Target
        </p>
      </div>

      <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#788290] mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-orange-800">
            Field Crews Active
          </span>
          <TruckIcon size={16} className="text-orange-600" />
        </div>
        <div className="font-display font-bold text-2xl text-[#182026]">
          {inProgressCount}
        </div>
        <p className="text-[11px] text-[#788290] mt-0.5 font-mono">
          In Physical Repair
        </p>
      </div>

      <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#788290] mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-emerald-800">
            Awaiting Verification
          </span>
          <CheckCircleIcon size={16} className="text-emerald-600" />
        </div>
        <div className="font-display font-bold text-2xl text-emerald-950">
          {resolvedCount}
        </div>
        <p className="text-[11px] text-emerald-700 mt-0.5 font-mono">
          Pending Citizen Signoff
        </p>
      </div>

      <div className="col-span-2 sm:col-span-1 bg-[#19382F] text-white rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-white/70 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">
            Verification Rate
          </span>
          <ShieldCheckIcon size={16} className="text-[#E05A47]" />
        </div>
        <div className="font-display font-bold text-2xl text-[#FBF9F5]">
          {verificationRate}%
        </div>
        <p className="text-[11px] text-white/70 mt-0.5 font-mono">
          {verifiedCount} Sealed Closures
        </p>
      </div>
    </div>
  );
}
