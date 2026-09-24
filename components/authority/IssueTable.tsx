"use client";

import React, { useState } from "react";
import { DrawerIssueData } from "./TriageDrawer";
import { StatusBadge, PriorityBadge, CategoryBadge } from "../ui/Badge";
import { SearchIcon, FilterIcon } from "../icons";

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
    <div className="bg-white border border-[#E8E2D8] rounded-2xl shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#E8E2D8] flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#FBF9F5]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#788290]">
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            placeholder="Search tickets, addresses, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#D5CCC0] bg-white text-[#182026] placeholder-[#788290] focus:border-[#19382F] focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#788290] font-mono">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-[#D5CCC0] bg-white text-[#182026] focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-[#E8E2D8] overflow-x-auto text-xs font-medium bg-[#FAF7F2]">
        {[
          { key: "ALL", label: "All Incidents" },
          { key: "REPORTED", label: "Reported" },
          { key: "IN_REVIEW", label: "In Review" },
          { key: "ASSIGNED", label: "Assigned" },
          { key: "IN_PROGRESS", label: "In Progress" },
          { key: "RESOLVED", label: "Awaiting Verification" },
          { key: "VERIFIED", label: "Verified" },
          { key: "REOPENED", label: "Reopened" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer font-semibold ${
              statusFilter === tab.key
                ? "bg-[#19382F] text-white shadow-2xs"
                : "text-[#4B5563] hover:bg-[#EBE4DC] hover:text-[#182026]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#182026]">
          <thead className="bg-[#F4EFEA] border-b border-[#E8E2D8] uppercase tracking-wider text-[10px] font-mono text-[#788290]">
            <tr>
              <th className="py-3 px-4">Ticket</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Issue Summary & Location</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Crew</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D8]">
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#788290]">
                  No civic tickets match the active search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="hover:bg-[#FBF9F5] transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#182026]">
                    {issue.ticketNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <CategoryBadge category={issue.category} />
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-semibold text-sm text-[#182026] group-hover:text-[#E05A47] transition line-clamp-1">
                      {issue.title}
                    </p>
                    <p className="text-[11px] text-[#788290] line-clamp-1 mt-0.5">
                      📍 {issue.address}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={issue.priority} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    {issue.crew ? (
                      <span className="font-medium text-[#19382F]">
                        {issue.crew.name}
                      </span>
                    ) : (
                      <span className="text-[#788290] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIssue(issue);
                      }}
                      className="px-2.5 py-1 rounded bg-[#F4EFEA] hover:bg-[#19382F] hover:text-white font-semibold transition text-xs border border-[#D5CCC0]"
                    >
                      Triage →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 border-t border-[#E8E2D8] bg-[#FBF9F5] flex items-center justify-between text-xs text-[#788290]">
        <span>Showing {filteredIssues.length} of {issues.length} incidents</span>
        <span className="font-mono text-[11px]">Real-time Database Sync Active</span>
      </div>
    </div>
  );
}
