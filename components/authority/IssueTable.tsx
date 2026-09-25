"use client";

import React, { useState } from "react";
import { DrawerIssueData } from "./TriageDrawer";
import { StatusBadge, PriorityBadge, CategoryBadge } from "../ui/Badge";
import { SearchIcon } from "../icons";

interface IssueTableProps {
  issues: DrawerIssueData[];
  onSelectIssue: (issue: DrawerIssueData) => void;
}

export function IssueTable({ issues, onSelectIssue }: IssueTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const filteredIssues = issues.filter((issue) => {
    // Status filter
    if (statusFilter !== "ALL" && issue.status !== statusFilter) return false;

    // Priority filter
    if (priorityFilter !== "ALL" && issue.priority !== priorityFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTicket = issue.ticketNumber.toLowerCase().includes(q);
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchAddress = issue.address.toLowerCase().includes(q);
      const matchDesc = issue.description.toLowerCase().includes(q);
      if (!matchTicket && !matchTitle && !matchAddress && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="bg-white border border-[#E7E1D7] rounded-2xl shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#E7E1D7] flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 bg-[#FAF8F5]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#687584]">
            <SearchIcon size={15} />
          </div>
          <input
            type="text"
            placeholder="Search tickets, street names, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#D8D0C3] bg-white text-[#12181F] placeholder-[#687584] focus:border-[#14352B] focus:ring-1 focus:ring-[#14352B] focus:outline-none transition"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#687584] uppercase tracking-wider font-semibold">
            Priority:
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-[#D8D0C3] bg-white text-[#12181F] focus:border-[#14352B] focus:outline-none transition cursor-pointer"
          >
            <option value="ALL">All Urgencies</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="HIGH">🟠 High Urgency</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="LOW">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 p-2.5 border-b border-[#E7E1D7] overflow-x-auto text-xs bg-[#F7F4EE]">
        {[
          { key: "ALL", label: "All Incidents" },
          { key: "REPORTED", label: "Reported" },
          { key: "IN_REVIEW", label: "In Review" },
          { key: "ASSIGNED", label: "Assigned" },
          { key: "IN_PROGRESS", label: "In Progress" },
          { key: "RESOLVED", label: "Awaiting Signoff" },
          { key: "VERIFIED", label: "Verified" },
          { key: "REOPENED", label: "Reopened" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer text-xs font-semibold ${
              statusFilter === tab.key
                ? "bg-[#14352B] text-white shadow-2xs"
                : "text-[#4B5563] hover:bg-[#EDE7DC] hover:text-[#12181F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#12181F]">
          <thead className="bg-[#FAF8F5] border-b border-[#E7E1D7] uppercase tracking-wider text-[10px] font-mono text-[#687584]">
            <tr>
              <th className="py-3 px-4">Ticket</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Incident Title & Location</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Crew</th>
              <th className="py-3 px-4 text-right">Triage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E1D7]">
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center text-[#687584]">
                  <p className="font-serif italic text-base">No incidents match the active search or filter.</p>
                  <p className="text-[11px] font-mono mt-1 text-[#8C98A6]">Try resetting filters or adjusting search keywords</p>
                </td>
              </tr>
            ) : (
              filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className={`hover:bg-[#FAF8F5] transition cursor-pointer group ${
                    issue.priority === "CRITICAL" && issue.status !== "VERIFIED"
                      ? "bg-rose-50/30"
                      : ""
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#12181F] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {issue.priority === "CRITICAL" && issue.status !== "VERIFIED" && (
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                      )}
                      <span>{issue.ticketNumber}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <CategoryBadge category={issue.category} />
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-semibold text-xs sm:text-sm text-[#12181F] group-hover:text-[#D94532] transition line-clamp-1">
                      {issue.title}
                    </p>
                    <p className="text-[11px] text-[#687584] line-clamp-1 mt-0.5 font-mono">
                      📍 {issue.address}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={issue.priority} />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {issue.crew ? (
                      <span className="font-semibold text-xs text-[#14352B] bg-[#EBF3F0] px-2 py-0.5 rounded-md border border-[#C5DDD3]">
                        {issue.crew.name}
                      </span>
                    ) : (
                      <span className="text-[#8C98A6] italic text-xs font-mono">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIssue(issue);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] group-hover:bg-[#14352B] group-hover:text-white font-semibold transition text-xs border border-[#D8D0C3] group-hover:border-[#14352B]"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3.5 border-t border-[#E7E1D7] bg-[#FAF8F5] flex items-center justify-between text-xs text-[#687584]">
        <span className="font-mono text-[11px]">
          Showing <strong>{filteredIssues.length}</strong> of <strong>{issues.length}</strong> municipal incidents
        </span>
        <span className="font-mono text-[11px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Real-time Database Sync Active
        </span>
      </div>
    </div>
  );
}

