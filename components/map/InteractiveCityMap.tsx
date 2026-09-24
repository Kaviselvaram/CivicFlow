"use client";

import React, { useState } from "react";
import {
  RoadIcon,
  WaterIcon,
  LightIcon,
  WasteIcon,
  InfraIcon,
  TrafficIcon,
  MapPinIcon,
  CrosshairIcon,
} from "../icons";
import { StatusBadge, PriorityBadge } from "../ui/Badge";

export interface MapIssuePin {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  ward?: string | null;
}

interface InteractiveCityMapProps {
  issues?: MapIssuePin[];
  selectedIssueId?: string | null;
  onSelectIssue?: (issue: MapIssuePin | null) => void;
  // Picker mode for reporting wizard
  isPickerMode?: boolean;
  selectedLocation?: { lat: number; lng: number; address?: string } | null;
  onLocationSelect?: (location: {
    lat: number;
    lng: number;
    address: string;
    ward: string;
  }) => void;
  className?: string;
  heightClass?: string;
}

// Fixed geographic bounding box for demo city (Metro Center)
// Latitude: 40.705 to 40.725
// Longitude: -74.015 to -73.995
const BOUNDS = {
  minLat: 40.705,
  maxLat: 40.725,
  minLng: -74.015,
  maxLng: -73.995,
};

function latLngToPercent(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  // Invert Y for SVG/CSS screen coords (north is up)
  const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  };
}

function percentToLatLng(xPercent: number, yPercent: number) {
  const lng = BOUNDS.minLng + (xPercent / 100) * (BOUNDS.maxLng - BOUNDS.minLng);
  const lat = BOUNDS.minLat + (1 - yPercent / 100) * (BOUNDS.maxLat - BOUNDS.minLat);
  return { lat, lng };
}

export function InteractiveCityMap({
  issues = [],
  selectedIssueId,
  onSelectIssue,
  isPickerMode = false,
  selectedLocation,
  onLocationSelect,
  className = "",
  heightClass = "h-[450px]",
}: InteractiveCityMapProps) {
  const [activeHoverPin, setActiveHoverPin] = useState<MapIssuePin | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const activeIssue =
    issues.find((i) => i.id === selectedIssueId) || activeHoverPin;

  const filteredIssues =
    categoryFilter === "ALL"
      ? issues
      : issues.filter((i) => i.category === categoryFilter);

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!isPickerMode || !onLocationSelect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const { lat, lng } = percentToLatLng(x, y);

    // Deterministic reverse geocoding approximation for demonstration
    let ward = "Ward 4 (Central)";
    let street = "Elm Street";
    if (y < 35) {
      ward = "Ward 1 (North Heights)";
      street = "Highland Avenue";
    } else if (y > 70) {
      ward = "Ward 3 (Downtown)";
      street = "Pier 6 Promenade";
    } else if (x < 40) {
      ward = "Ward 2 (Market District)";
      street = "Market Square Alley";
    } else if (x > 70) {
      ward = "Ward 5 (Eastside)";
      street = "Grand Avenue";
    }

    const houseNumber = Math.floor(100 + lat * 1000) % 900;
    const address = `${houseNumber} ${street}, ${ward}`;

    onLocationSelect({
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      address,
      ward,
    });
  }

  function renderCategoryIcon(category: string) {
    switch (category) {
      case "ROADS":
        return <RoadIcon size={14} />;
      case "WATER":
        return <WaterIcon size={14} />;
      case "ELECTRICAL":
        return <LightIcon size={14} />;
      case "SANITATION":
        return <WasteIcon size={14} />;
      case "INFRASTRUCTURE":
        return <InfraIcon size={14} />;
      case "TRAFFIC":
        return <TrafficIcon size={14} />;
      default:
        return <MapPinIcon size={14} />;
    }
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#E8E2D8] bg-[#F7F4EE] shadow-inner select-none ${heightClass} ${className}`}
    >
      {/* Category filter pills for map */}
      {!isPickerMode && (
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-[#E8E2D8] shadow-sm max-w-[calc(100%-24px)]">
          {["ALL", "ROADS", "WATER", "ELECTRICAL", "SANITATION"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#19382F] text-white"
                  : "text-[#4B5563] hover:bg-[#F4EFEA] hover:text-[#182026]"
              }`}
            >
              {cat === "ALL" ? "All Issues" : cat}
            </button>
          ))}
        </div>
      )}

      {/* Picker Mode Instruction Banner */}
      {isPickerMode && (
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#E8E2D8] shadow-sm text-xs">
          <div className="flex items-center gap-2 text-[#182026] font-medium">
            <CrosshairIcon size={16} className="text-[#E05A47]" />
            <span>Click anywhere on the city map to pinpoint the exact defect location</span>
          </div>
          {selectedLocation?.address && (
            <span className="font-mono text-[11px] text-[#19382F] font-bold bg-[#EBF3F0] px-2 py-0.5 rounded border border-[#D0E2DB]">
              📍 {selectedLocation.address}
            </span>
          )}
        </div>
      )}

      {/* SVG Vector Cartography Background */}
      <div
        onClick={handleMapClick}
        className={`absolute inset-0 ${isPickerMode ? "cursor-crosshair" : "cursor-default"}`}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle civic grid lines */}
          <defs>
            <pattern
              id="civic-grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#EAE4DA"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#civic-grid)" />

          {/* River / Waterway Canal */}
          <path
            d="M 0 350 C 250 340, 400 480, 650 490 C 850 500, 950 560, 1000 580 L 1000 600 L 0 600 Z"
            fill="#E6F0F3"
            stroke="#C9DEE5"
            strokeWidth="2"
          />
          <text
            x="320"
            y="410"
            fill="#7CA3B0"
            fontSize="12"
            fontFamily="monospace"
            letterSpacing="3"
            opacity="0.8"
          >
            CIVIC WATERWAY CORRIDOR
          </text>

          {/* Primary Arterial Road Network */}
          <g stroke="#DDD6C8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* North-South Spine */}
            <path d="M 480 0 L 520 600" />
            {/* East-West Avenues */}
            <path d="M 0 160 L 1000 140" />
            <path d="M 0 320 L 1000 310" />
            <path d="M 0 460 L 1000 450" />
            {/* Diagonal Boulevard */}
            <path d="M 120 0 L 880 600" stroke="#D3C9B8" strokeWidth="14" />
          </g>

          {/* Inner Asphalt Core Lines */}
          <g stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 480 0 L 520 600" />
            <path d="M 0 160 L 1000 140" />
            <path d="M 0 320 L 1000 310" />
            <path d="M 0 460 L 1000 450" />
            <path d="M 120 0 L 880 600" />
          </g>

          {/* Ward District Boundaries & Labels */}
          <g fill="#9EA8B3" fontSize="11" fontFamily="sans-serif" fontWeight="600" letterSpacing="1.5">
            <text x="60" y="80">WARD 1 • NORTH HEIGHTS</text>
            <text x="100" y="240">WARD 2 • MARKET DISTRICT</text>
            <text x="120" y="520">WARD 3 • DOWNTOWN CORRIDOR</text>
            <text x="620" y="100">WARD 4 • CENTRAL TRANSIT</text>
            <text x="750" y="380">WARD 5 • EASTSIDE COMMERCE</text>
          </g>

          {/* Public Municipal Landmark Outlines */}
          <rect x="540" y="180" width="90" height="70" rx="4" fill="#E8E2D6" stroke="#D5CCC0" strokeWidth="1.5" />
          <text x="555" y="220" fill="#6A7582" fontSize="9" fontWeight="bold">CITY HALL</text>

          <rect x="220" y="200" width="80" height="50" rx="4" fill="#E8E2D6" stroke="#D5CCC0" strokeWidth="1.5" />
          <text x="235" y="230" fill="#6A7582" fontSize="9" fontWeight="bold">CENTRAL BUS</text>

          <rect x="720" y="240" width="100" height="60" rx="4" fill="#E8E2D6" stroke="#D5CCC0" strokeWidth="1.5" />
          <text x="740" y="275" fill="#6A7582" fontSize="9" fontWeight="bold">DISTRICT HOSPITAL</text>
        </svg>

        {/* Selected Location Marker in Picker Mode */}
        {isPickerMode && selectedLocation && (
          <div
            className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-150 z-30"
            style={{
              left: `${latLngToPercent(selectedLocation.lat, selectedLocation.lng).x}%`,
              top: `${latLngToPercent(selectedLocation.lat, selectedLocation.lng).y}%`,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-[#E05A47] text-white p-2 rounded-full shadow-xl ring-4 ring-white animate-bounce">
                <MapPinIcon size={20} />
              </div>
              <div className="w-2.5 h-1 bg-black/30 rounded-full blur-[1px] mt-0.5" />
            </div>
          </div>
        )}

        {/* Interactive Issue Pins (Authority / Landing / Citizen) */}
        {!isPickerMode &&
          filteredIssues.map((issue) => {
            const { x, y } = latLngToPercent(issue.latitude, issue.longitude);
            const isSelected = selectedIssueId === issue.id;
            const isCritical = issue.priority === "CRITICAL";

            return (
              <div
                key={issue.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectIssue?.(issue);
                }}
                onMouseEnter={() => setActiveHoverPin(issue)}
                onMouseLeave={() => setActiveHoverPin(null)}
              >
                {/* Pulse Ring for Critical Unresolved Issues */}
                {isCritical && issue.status !== "VERIFIED" && (
                  <span className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
                )}

                {/* Marker Button */}
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-150 shadow-md ${
                    isSelected
                      ? "scale-125 ring-3 ring-[#19382F] z-30"
                      : "hover:scale-115"
                  } ${
                    issue.status === "VERIFIED"
                      ? "bg-[#19382F] border-white text-white"
                      : issue.status === "RESOLVED"
                      ? "bg-emerald-600 border-white text-white"
                      : isCritical
                      ? "bg-rose-600 border-white text-white"
                      : issue.priority === "HIGH"
                      ? "bg-[#E05A47] border-white text-white"
                      : "bg-white border-[#182026] text-[#182026]"
                  }`}
                >
                  {renderCategoryIcon(issue.category)}
                </div>

                {/* Ticket ID Pill on hover/select */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-[#182026] text-white text-[10px] font-mono whitespace-nowrap pointer-events-none shadow-sm transition-opacity duration-150 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {issue.ticketNumber}
                </div>
              </div>
            );
          })}
      </div>

      {/* Selected Issue Preview Card Overlay */}
      {!isPickerMode && activeIssue && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm z-30 bg-white/95 backdrop-blur-md border border-[#E8E2D8] rounded-xl p-3.5 shadow-xl animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-[#182026]">
                {activeIssue.ticketNumber}
              </span>
              <StatusBadge status={activeIssue.status} />
            </div>
            <PriorityBadge priority={activeIssue.priority} />
          </div>

          <h4 className="font-semibold text-sm text-[#182026] line-clamp-1">
            {activeIssue.title}
          </h4>
          <p className="text-xs text-[#788290] mt-0.5">📍 {activeIssue.address}</p>

          <div className="mt-3 pt-2 border-t border-[#E8E2D8] flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#4B5563]">
              {activeIssue.ward || "Central Ward"}
            </span>
            {onSelectIssue && (
              <button
                onClick={() => onSelectIssue(activeIssue)}
                className="text-xs font-semibold text-[#E05A47] hover:underline cursor-pointer"
              >
                View Full Details →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Compass / Scale indicator in bottom right */}
      <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E8E2D8] text-[10px] font-mono text-[#788290]">
        <span>N ▲</span>
        <span>•</span>
        <span>METRO CARTOGRAPHY GRID</span>
      </div>
    </div>
  );
}
