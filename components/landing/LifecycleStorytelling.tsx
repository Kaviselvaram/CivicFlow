"use client";

import React, { useState } from "react";
import {
  CameraIcon,
  SparklesIcon,
  TruckIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  MapPinIcon,
  RoadIcon,
} from "../icons";

interface Stage {
  number: string;
  name: string;
  tagline: string;
  shortLabel: string;
  role: string;
  timeframe: string;
  description: string;
  actionText: string;
  image: string;
  actorBadge: string;
  telemetryCode: string;
}

const STAGES: Stage[] = [
  {
    number: "01",
    name: "Rapid Capture",
    shortLabel: "Capture",
    tagline: "One photo. Precise coordinates. Zero paperwork.",
    role: "Resident Observer",
    timeframe: "00:00:45 Intake",
    description:
      "A resident spots a 40cm pothole exposing rebar foundation. In 45 seconds, they snap a photo and touch the interactive city cartography.",
    actionText: "Report Recorded: #CF-1001",
    image:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80",
    actorBadge: "Citizen Maya Chen",
    telemetryCode: "GPS: 40.7138° N, 74.0080° W • Ward 4",
  },
  {
    number: "02",
    name: "Intelligent Triage",
    shortLabel: "Understand",
    tagline: "Natural language parsed into exact municipal routing.",
    role: "AI Classification Engine",
    timeframe: "+ 2 seconds",
    description:
      "Natural language analysis detects high hazard signals ('rebar', 'transit stop'). The engine recommends Public Works at HIGH priority with 94% confidence.",
    actionText: "Route: Dept. of Public Works (48h SLA)",
    image:
      "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80",
    actorBadge: "Heuristic AI Core v2.4",
    telemetryCode: "CATEGORY: ROADS • PRIORITY: HIGH",
  },
  {
    number: "03",
    name: "Crew Dispatch",
    shortLabel: "Assign",
    tagline: "Spatial clustering and work order assignment.",
    role: "Operations Supervisor",
    timeframe: "+ 3.5 Hours",
    description:
      "Superintendent David O'Connor groups Elm Street defects on the geospatial triage map and dispatches Road Patching Crew Bravo with a hot-mix asphalt truck.",
    actionText: "Dispatched: Patching Unit Bravo (Truck #14)",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
    actorBadge: "Supervisor David O'Connor",
    telemetryCode: "WORK ORDER DISPATCHED • STATUS: IN_PROGRESS",
  },
  {
    number: "04",
    name: "Field Remediation",
    shortLabel: "Resolve",
    tagline: "Physical repair with mandatory photographic proof.",
    role: "Field Maintenance Crew",
    timeframe: "+ 18.2 Hours",
    description:
      "Crew Bravo clears loose cavity gravel, applies tack coat, rolls fresh hot-mix asphalt, and uploads before/after photographic proof from the field.",
    actionText: "Work Completed: Fresh Cured Asphalt",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80",
    actorBadge: "Lead Hector Vance (Crew Bravo)",
    telemetryCode: "STATUS: RESOLVED • PROOF ATTACHED",
  },
  {
    number: "05",
    name: "Citizen Verification",
    shortLabel: "Verify",
    tagline: "The loop closes only when the resident confirms.",
    role: "Reporting Citizen",
    timeframe: "+ 24.1 Hours Total",
    description:
      "Maya inspects the finished street on her walk home. With one tap, she confirms the smooth surface, awards 5 stars, and the immutable digital verification seal is applied.",
    actionText: "Verified & Sealed: ★ 5.0 Rating",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
    actorBadge: "Resident Verification Seal Applied",
    telemetryCode: "STATUS: VERIFIED • PERMANENT AUDIT SEAL",
  },
];

export function LifecycleStorytelling() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStage = STAGES[activeIdx];

  const icons = [
    <CameraIcon key="1" size={18} />,
    <SparklesIcon key="2" size={18} />,
    <TruckIcon key="3" size={18} />,
    <CheckCircleIcon key="4" size={18} />,
    <ShieldCheckIcon key="5" size={18} />,
  ];

  return (
    <div className="bg-white border border-[#E6DFD4] rounded-3xl p-6 lg:p-10 shadow-sm space-y-8">
      {/* Step Selector Horizontal Bar */}
      <div className="grid grid-cols-5 gap-2 border-b border-[#E6DFD4] pb-6">
        {STAGES.map((stage, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;

          return (
            <button
              key={stage.number}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`flex flex-col items-start p-3 sm:p-4 rounded-2xl text-left transition cursor-pointer ${
                isActive
                  ? "bg-[#14352B] text-white shadow-sm"
                  : isPast
                  ? "bg-[#F3EFE8] text-[#12181F] hover:bg-[#ECE6DC]"
                  : "bg-transparent text-[#7A8799] hover:bg-[#FAF8F5]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`text-[11px] font-mono font-bold ${
                    isActive ? "text-[#D94532]" : "text-[#7A8799]"
                  }`}
                >
                  STAGE {stage.number}
                </span>
                <span className={isActive ? "text-white" : "text-[#7A8799]"}>
                  {icons[idx]}
                </span>
              </div>
              <span className="font-display font-semibold text-xs sm:text-sm truncate w-full">
                {stage.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Dynamic Stage Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Stage Narrative */}
        <div className="lg:col-span-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6DFD4] text-[11px] font-mono font-bold text-[#14352B]">
              {activeStage.role}
            </span>
            <span className="text-[#D1C7B8]">•</span>
            <span className="text-[11px] font-mono text-[#D94532] font-semibold">
              ⏱ {activeStage.timeframe}
            </span>
          </div>

          <h3 className="font-display font-bold text-3xl sm:text-4xl text-[#12181F] leading-tight">
            {activeStage.name}
          </h3>

          <p className="font-display italic text-base text-[#475467] leading-relaxed">
            &ldquo;{activeStage.tagline}&rdquo;
          </p>

          <p className="text-sm text-[#475467] leading-relaxed">
            {activeStage.description}
          </p>

          {/* Telemetry pill */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6DFD4] space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-[#12181F]">
                {activeStage.actionText}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] font-mono text-[#7A8799]">
              {activeStage.telemetryCode}
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
              className="text-xs font-semibold px-4 py-2 rounded-xl border border-[#D1C7B8] disabled:opacity-40 hover:bg-[#F3EFE8] transition cursor-pointer"
            >
              ← Previous Stage
            </button>
            <button
              type="button"
              disabled={activeIdx === STAGES.length - 1}
              onClick={() =>
                setActiveIdx((prev) => Math.min(STAGES.length - 1, prev + 1))
              }
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#14352B] text-white disabled:opacity-40 hover:bg-[#0E251E] transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Stage</span>
              <ArrowRightIcon size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Visual Frame */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl overflow-hidden border border-[#E6DFD4] bg-[#FAF8F5] aspect-video sm:aspect-4/3 shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeStage.image}
              alt={activeStage.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Top actor badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E6DFD4] shadow-sm text-xs font-medium text-[#12181F] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D94532]" />
              <span>{activeStage.actorBadge}</span>
            </div>

            {/* Bottom status watermark */}
            <div className="absolute bottom-4 right-4 bg-[#12181F]/90 backdrop-blur-md px-3 py-1 rounded-lg text-white font-mono text-xs">
              CIVICFLOW AUDIT HASH: #CF-STAGE-{activeStage.number}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
