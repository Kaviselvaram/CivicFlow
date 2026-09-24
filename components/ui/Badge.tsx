import React from "react";
import { IssuePriority, IssueStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: IssueStatus | string }) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    REPORTED: {
      label: "Reported",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-300",
      dot: "bg-amber-500",
    },
    IN_REVIEW: {
      label: "In Review",
      bg: "bg-sky-50",
      text: "text-sky-800",
      border: "border-sky-300",
      dot: "bg-sky-500",
    },
    ASSIGNED: {
      label: "Assigned",
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-300",
      dot: "bg-purple-500",
    },
    IN_PROGRESS: {
      label: "In Progress",
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-300",
      dot: "bg-orange-500",
    },
    RESOLVED: {
      label: "Resolved",
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-300",
      dot: "bg-emerald-500",
    },
    VERIFIED: {
      label: "Verified",
      bg: "bg-[#19382F]",
      text: "text-[#FBF9F5]",
      border: "border-[#19382F]",
      dot: "bg-[#E05A47]",
    },
    REOPENED: {
      label: "Reopened",
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-300",
      dot: "bg-rose-500",
    },
  };

  const config = configs[status] || {
    label: status,
    bg: "bg-gray-50",
    text: "text-gray-800",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} tracking-wide select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: IssuePriority | string }) {
  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string }
  > = {
    CRITICAL: {
      label: "Critical",
      bg: "bg-rose-100",
      text: "text-rose-900 font-bold",
      border: "border-rose-300",
    },
    HIGH: {
      label: "High",
      bg: "bg-orange-100",
      text: "text-orange-900 font-semibold",
      border: "border-orange-300",
    },
    MEDIUM: {
      label: "Medium",
      bg: "bg-amber-50",
      text: "text-amber-800 font-medium",
      border: "border-amber-200",
    },
    LOW: {
      label: "Low",
      bg: "bg-slate-100",
      text: "text-slate-700 font-medium",
      border: "border-slate-200",
    },
  };

  const config = configs[priority] || {
    label: priority,
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
}

export function CategoryBadge({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#F4EFEA] text-[#182026] border border-[#E8E2D8] ${className}`}
    >
      {category.replace("_", " ")}
    </span>
  );
}
