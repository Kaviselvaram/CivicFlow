"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MetricsRibbon } from "./MetricsRibbon";
import { IssueTable } from "./IssueTable";
import { TriageDrawer, DrawerIssueData } from "./TriageDrawer";
import { InteractiveCityMap } from "../map/InteractiveCityMap";
import { ToastProvider, useToast } from "../ui/Toast";
import { ShieldCheckIcon, TruckIcon } from "../icons";

interface DepartmentData {
  id: string;
  name: string;
  slug: string;
}

interface CrewData {
  id: string;
  name: string;
  leadName: string;
  departmentId: string;
}

export function AuthorityDashboardClient({
  initialIssues,
  departments,
  crews,
}: {
  initialIssues: DrawerIssueData[];
  departments: DepartmentData[];
  crews: CrewData[];
}) {
  const { showToast } = useToast();
  const [issues, setIssues] = useState<DrawerIssueData[]>(initialIssues);
  const [selectedIssue, setSelectedIssue] = useState<DrawerIssueData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"split" | "table" | "map">("split");

  const refreshIssues = useCallback(async () => {
    try {
      const res = await fetch("/api/issues");
      if (res.ok) {
        const data = await res.json();
        setIssues(data.issues);
        // If an issue is selected, update it
        if (selectedIssue) {
          const updated = data.issues.find(
            (i: DrawerIssueData) => i.id === selectedIssue.id
          );
          if (updated) setSelectedIssue(updated);
        }
      }
    } catch {
      // Silent refresh
    }
  }, [selectedIssue]);

  useEffect(() => {
    const interval = setInterval(refreshIssues, 15000); // 15s poll
    return () => clearInterval(interval);
  }, [refreshIssues]);

  function handleSelectIssue(issue: DrawerIssueData) {
    setSelectedIssue(issue);
    setIsDrawerOpen(true);
  }

  // Calculate metrics
  const total = issues.length;
  const criticalCount = issues.filter((i) => i.priority === "CRITICAL").length;
  const inProgressCount = issues.filter((i) => i.status === "IN_PROGRESS").length;
  const resolvedCount = issues.filter((i) => i.status === "RESOLVED").length;
  const verifiedCount = issues.filter((i) => i.status === "VERIFIED").length;

  return (
    <div className="space-y-6">
      {/* Top Operations Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7E1D7]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#14352B] text-white shadow-xs">
              <ShieldCheckIcon size={20} />
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#12181F] tracking-tight">
              Municipal Operations Center
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Incident Stream
            </span>
          </div>
          <p className="text-xs text-[#687584] mt-1.5 font-mono">
            Autonomous triage, field crew telemetry dispatch, and citizen resolution proof signoff ledger.
          </p>
        </div>

        {/* View Switcher & Analytics Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-[#D8D0C3] bg-white p-1 text-xs shadow-2xs">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === "split"
                  ? "bg-[#14352B] text-white shadow-xs"
                  : "text-[#4B5563] hover:text-[#12181F]"
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === "map"
                  ? "bg-[#14352B] text-white shadow-xs"
                  : "text-[#4B5563] hover:text-[#12181F]"
              }`}
            >
              Full Map
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#14352B] text-white shadow-xs"
                  : "text-[#4B5563] hover:text-[#12181F]"
              }`}
            >
              Triage Grid
            </button>
          </div>

          <Link
            href="/authority/analytics"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFE8] border border-[#D8D0C3] text-[#12181F] transition flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <span>📊</span>
            District Analytics
          </Link>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <MetricsRibbon
        total={total}
        criticalCount={criticalCount}
        inProgressCount={inProgressCount}
        resolvedCount={resolvedCount}
        verifiedCount={verifiedCount}
      />

      {/* Main Body According to View Mode */}
      {viewMode === "split" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Geospatial Map */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#687584]">
              <span className="font-bold text-[#12181F] uppercase tracking-wider text-[11px]">
                Geospatial Incident Map
              </span>
              <span>Click pin to inspect</span>
            </div>
            <InteractiveCityMap
              issues={issues}
              selectedIssueId={selectedIssue?.id}
              onSelectIssue={(issue) => {
                const fullIssue = issues.find((i) => i.id === issue?.id);
                if (fullIssue) handleSelectIssue(fullIssue);
              }}
              heightClass="h-[560px]"
            />
          </div>

          {/* High-Density Triage Table */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#687584]">
              <span className="font-bold text-[#12181F] uppercase tracking-wider text-[11px]">
                Active Triage Queue
              </span>
              <span>Sorted by recent observation</span>
            </div>
            <IssueTable
              issues={issues}
              onSelectIssue={handleSelectIssue}
            />
          </div>
        </div>
      )}

      {viewMode === "map" && (
        <div className="space-y-3">
          <InteractiveCityMap
            issues={issues}
            selectedIssueId={selectedIssue?.id}
            onSelectIssue={(issue) => {
              const fullIssue = issues.find((i) => i.id === issue?.id);
              if (fullIssue) handleSelectIssue(fullIssue);
            }}
            heightClass="h-[700px]"
          />
        </div>
      )}

      {viewMode === "table" && (
        <div className="space-y-3">
          <IssueTable
            issues={issues}
            onSelectIssue={handleSelectIssue}
          />
        </div>
      )}

      {/* Slide-over Triage Drawer */}
      <TriageDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        issue={selectedIssue}
        departments={departments}
        crews={crews}
        onUpdated={refreshIssues}
        showToast={showToast}
      />
    </div>
  );
}

export function AuthorityDashboardWrapper(props: {
  initialIssues: DrawerIssueData[];
  departments: DepartmentData[];
  crews: CrewData[];
}) {
  return (
    <ToastProvider>
      <AuthorityDashboardClient {...props} />
    </ToastProvider>
  );
}
