"use client";

import React, { useState, useEffect } from "react";
import {
  RoadIcon,
  WaterIcon,
  LightIcon,
  WasteIcon,
  InfraIcon,
  TrafficIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "../icons";

export interface CivicPulsePoint {
  id: string;
  ticketNumber: string;
  title: string;
  category: "ROADS" | "WATER" | "ELECTRICAL" | "SANITATION" | "INFRASTRUCTURE" | "TRAFFIC";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "REPORTED" | "IN_REVIEW" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "VERIFIED" | "REOPENED";
  x: number; // 0 - 100 percentage
  y: number; // 0 - 100 percentage
  ward: string;
  address: string;
  slaHoursRemaining?: number;
}

const DEFAULT_POINTS: CivicPulsePoint[] = [
  {
    id: "p1",
    ticketNumber: "CF-1001",
    title: "Severe Road Cavity (40cm depth)",
    category: "ROADS",
    priority: "HIGH",
    status: "IN_PROGRESS",
    x: 42,
    y: 36,
    ward: "Ward 4 (Central)",
    address: "442 Elm Street",
    slaHoursRemaining: 18,
  },
  {
    id: "p2",
    ticketNumber: "CF-1002",
    title: "Commercial Dumping & Box Overflow",
    category: "SANITATION",
    priority: "MEDIUM",
    status: "RESOLVED",
    x: 28,
    y: 52,
    ward: "Ward 2 (Market)",
    address: "18 Market Square Alley",
    slaHoursRemaining: 6,
  },
  {
    id: "p3",
    ticketNumber: "CF-1003",
    title: "Streetlight Luminaire Blackout",
    category: "ELECTRICAL",
    priority: "LOW",
    status: "VERIFIED",
    x: 68,
    y: 22,
    ward: "Ward 1 (North)",
    address: "88 Highland Avenue",
    slaHoursRemaining: 0,
  },
  {
    id: "p4",
    ticketNumber: "CF-1004",
    title: "High-Pressure Water Main Burst",
    category: "WATER",
    priority: "CRITICAL",
    x: 74,
    y: 65,
    status: "ASSIGNED",
    ward: "Ward 3 (Downtown)",
    address: "210 4th Ave & Pine",
    slaHoursRemaining: 4,
  },
  {
    id: "p5",
    ticketNumber: "CF-1005",
    title: "Damaged Pedestrian Guardrail",
    category: "INFRASTRUCTURE",
    priority: "HIGH",
    status: "REOPENED",
    x: 18,
    y: 78,
    ward: "Ward 3 (Downtown)",
    address: "Pier 6 Promenade",
    slaHoursRemaining: 12,
  },
  {
    id: "p6",
    ticketNumber: "CF-1006",
    title: "Faulty Signal Cycle (35min gridlock)",
    category: "TRAFFIC",
    priority: "MEDIUM",
    status: "REPORTED",
    x: 82,
    y: 44,
    ward: "Ward 5 (Eastside)",
    address: "Grand Ave & 7th St",
    slaHoursRemaining: 22,
  },
];

export function CivicPulseVisual({
  points = DEFAULT_POINTS,
  onSelectPoint,
  heightClass = "h-[480px]",
  interactive = true,
}: {
  points?: CivicPulsePoint[];
  onSelectPoint?: (point: CivicPulsePoint) => void;
  heightClass?: string;
  interactive?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [hoveredPoint, setHoveredPoint] = useState<CivicPulsePoint | null>(null);
  const [radarAngle, setRadarAngle] = useState(0);

  // Subtle continuous radar sweep effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRadarAngle((prev) => (prev + 0.75) % 360);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const filteredPoints =
    activeCategory === "ALL"
      ? points
      : points.filter((p) => p.category === activeCategory);

  function getCategoryIcon(cat: CivicPulsePoint["category"]) {
    switch (cat) {
      case "ROADS":
        return <RoadIcon size={12} />;
      case "WATER":
        return <WaterIcon size={12} />;
      case "ELECTRICAL":
        return <LightIcon size={12} />;
      case "SANITATION":
        return <WasteIcon size={12} />;
      case "INFRASTRUCTURE":
        return <InfraIcon size={12} />;
      case "TRAFFIC":
        return <TrafficIcon size={12} />;
    }
  }

  function getNodeVisuals(point: CivicPulsePoint) {
    if (point.status === "VERIFIED") {
      return {
        bg: "bg-[#14352B] text-[#FAF8F5] border-[#14352B]",
        ring: "ring-2 ring-[#14352B]/30",
        pulse: false,
        size: "w-7 h-7",
      };
    }
    if (point.status === "RESOLVED") {
      return {
        bg: "bg-emerald-600 text-white border-emerald-500",
        ring: "ring-4 ring-emerald-100",
        pulse: false,
        size: "w-7 h-7",
      };
    }
    if (point.priority === "CRITICAL") {
      return {
        bg: "bg-[#DC2626] text-white border-white",
        ring: "ring-4 ring-rose-200 animate-ping",
        pulse: true,
        size: "w-8 h-8",
      };
    }
    if (point.priority === "HIGH") {
      return {
        bg: "bg-[#D94532] text-white border-white",
        ring: "ring-3 ring-orange-200",
        pulse: true,
        size: "w-7 h-7",
      };
    }
    return {
      bg: "bg-white text-[#12181F] border-[#D1C7B8]",
      ring: "ring-2 ring-black/5",
      pulse: false,
      size: "w-6 h-6",
    };
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#E6DFD4] bg-[#FAF8F5] shadow-xs select-none ${heightClass}`}
    >
      {/* Background Architectural Blueprint Canvas */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="pulse-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#E8E2D6"
              strokeWidth="0.8"
            />
            <circle cx="0" cy="0" r="1.5" fill="#D1C7B8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pulse-grid)" />

        {/* Concentric Telemetry Radar Rings */}
        <circle
          cx="50%"
          cy="50%"
          r="120"
          fill="none"
          stroke="#E0D7C8"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <circle
          cx="50%"
          cy="50%"
          r="220"
          fill="none"
          stroke="#E0D7C8"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle
          cx="50%"
          cy="50%"
          r="320"
          fill="none"
          stroke="#ECE6DC"
          strokeWidth="1"
        />

        {/* Dynamic Sweeping Radar Beam */}
        <line
          x1="50%"
          y1="50%"
          x2={`${50 + 45 * Math.cos((radarAngle * Math.PI) / 180)}%`}
          y2={`${50 + 45 * Math.sin((radarAngle * Math.PI) / 180)}%`}
          stroke="rgba(217, 69, 50, 0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Arterial Municipal Interconnect Lines */}
        <path
          d="M 180 380 Q 350 200 420 180 T 740 320"
          fill="none"
          stroke="#D8CFBF"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 280 260 Q 420 180 680 110"
          fill="none"
          stroke="#D8CFBF"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      </svg>

      {/* Top Header Toolbar */}
      <div className="absolute top-3.5 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E6DFD4] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#D94532] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#12181F]">
            Civic Pulse Telemetry
          </span>
          <span className="text-[#D1C7B8]">•</span>
          <span className="text-xs font-mono text-[#7A8799]">
            {filteredPoints.length} Nodes Active
          </span>
        </div>

        {/* Category Filter Pills */}
        {interactive && (
          <div className="flex flex-wrap items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#E6DFD4] shadow-2xs">
            {["ALL", "ROADS", "WATER", "ELECTRICAL", "SANITATION"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase font-bold tracking-wider transition cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#14352B] text-white shadow-2xs"
                    : "text-[#475467] hover:bg-[#F3EFE8] hover:text-[#12181F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Node Render Engine */}
      <div className="absolute inset-0">
        {filteredPoints.map((point) => {
          const visuals = getNodeVisuals(point);
          const isHovered = hoveredPoint?.id === point.id;

          return (
            <div
              key={point.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-200 hover:scale-125"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
              onClick={() => onSelectPoint?.(point)}
            >
              {/* Ping Ring for Critical / High */}
              {visuals.pulse && (
                <span className="absolute -inset-2.5 rounded-full bg-[#D94532]/25 animate-ping pointer-events-none" />
              )}

              {/* Node Icon Circle */}
              <div
                className={`relative flex items-center justify-center rounded-full border shadow-sm transition-all ${visuals.size} ${visuals.bg} ${visuals.ring}`}
              >
                {point.status === "VERIFIED" ? (
                  <ShieldCheckIcon size={14} className="text-[#FAF8F5]" />
                ) : point.status === "RESOLVED" ? (
                  <CheckCircleIcon size={14} className="text-white" />
                ) : (
                  getCategoryIcon(point.category)
                )}
              </div>

              {/* Monospace Badge Tag */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded bg-[#12181F] text-white text-[10px] font-mono whitespace-nowrap shadow-md pointer-events-none transition-opacity duration-150 ${
                  isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {point.ticketNumber} • {point.priority}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Architectural Inspection Card on Hover */}
      {hoveredPoint && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-30 bg-white/95 backdrop-blur-md border border-[#E6DFD4] rounded-xl p-4 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#E6DFD4]">
            <span className="font-mono text-xs font-bold text-[#12181F]">
              {hoveredPoint.ticketNumber}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                hoveredPoint.status === "VERIFIED"
                  ? "bg-[#14352B] text-white"
                  : hoveredPoint.status === "RESOLVED"
                  ? "bg-emerald-100 text-emerald-800"
                  : hoveredPoint.priority === "CRITICAL"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {hoveredPoint.status}
            </span>
          </div>

          <h4 className="font-display font-semibold text-sm text-[#12181F] leading-tight">
            {hoveredPoint.title}
          </h4>
          <p className="text-xs text-[#7A8799] mt-1 font-mono">
            📍 {hoveredPoint.address} ({hoveredPoint.ward})
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#F3EFE8] flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-[#475467]">
              SLA: {hoveredPoint.slaHoursRemaining ? `${hoveredPoint.slaHoursRemaining}h target` : "Verified"}
            </span>
            <span className="text-[11px] font-semibold text-[#D94532]">
              Inspect Telemetry →
            </span>
          </div>
        </div>
      )}

      {/* Bottom Live Activity Feed Ticker */}
      <div className="absolute bottom-3 right-4 z-10 hidden sm:flex items-center gap-2 bg-white/85 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#E6DFD4] text-[11px] font-mono text-[#7A8799]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span>SECTOR GRID ACTIVE: 12 WARDS ONLINE</span>
      </div>
    </div>
  );
}
