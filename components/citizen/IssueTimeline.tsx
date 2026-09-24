import React from "react";
import { CheckCircleIcon, ClockIcon, AlertTriangleIcon, RotateCcwIcon, UserIcon } from "../icons";
import { StatusBadge } from "../ui/Badge";

export interface StatusHistoryItem {
  id: string;
  fromStatus: string;
  toStatus: string;
  note?: string | null;
  createdAt: string | Date;
  actor: {
    name: string;
    role: string;
  };
}

export function IssueTimeline({
  history = [],
  currentStatus,
}: {
  history: StatusHistoryItem[];
  currentStatus: string;
}) {
  function getIcon(status: string) {
    switch (status) {
      case "VERIFIED":
        return <CheckCircleIcon size={16} className="text-[#FBF9F5]" />;
      case "RESOLVED":
        return <CheckCircleIcon size={16} className="text-emerald-700" />;
      case "REOPENED":
        return <RotateCcwIcon size={16} className="text-rose-700" />;
      case "IN_PROGRESS":
      case "ASSIGNED":
        return <ClockIcon size={16} className="text-orange-700" />;
      default:
        return <ClockIcon size={16} className="text-amber-700" />;
    }
  }

  function getNodeBg(status: string) {
    switch (status) {
      case "VERIFIED":
        return "bg-[#19382F] border-[#19382F]";
      case "RESOLVED":
        return "bg-emerald-100 border-emerald-300";
      case "REOPENED":
        return "bg-rose-100 border-rose-300";
      case "IN_PROGRESS":
        return "bg-orange-100 border-orange-300";
      case "ASSIGNED":
        return "bg-purple-100 border-purple-300";
      default:
        return "bg-amber-100 border-amber-300";
    }
  }

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E2D8]">
      {history.map((entry, index) => {
        const isLatest = index === history.length - 1;
        const dateObj = new Date(entry.createdAt);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const formattedTime = dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={entry.id} className="relative group">
            {/* Timeline Node Point */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition ${getNodeBg(
                entry.toStatus
              )} ${isLatest ? "ring-4 ring-[#19382F]/10 scale-105" : ""}`}
            >
              {getIcon(entry.toStatus)}
            </div>

            {/* Content card */}
            <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <StatusBadge status={entry.toStatus} />
                  {isLatest && (
                    <span className="text-[10px] font-mono uppercase bg-[#19382F] text-white px-2 py-0.5 rounded font-bold">
                      Current State
                    </span>
                  )}
                </div>
                <time className="text-xs font-mono text-[#788290]">
                  {formattedDate} at {formattedTime}
                </time>
              </div>

              {entry.note && (
                <p className="text-sm text-[#182026] leading-relaxed mt-2">
                  {entry.note}
                </p>
              )}

              <div className="mt-3 pt-2 border-t border-[#F4EFEA] flex items-center gap-2 text-xs text-[#788290]">
                <UserIcon size={14} className="text-[#19382F]" />
                <span className="font-semibold text-[#182026]">
                  {entry.actor.name}
                </span>
                <span>•</span>
                <span className="uppercase text-[10px] font-mono tracking-wider">
                  {entry.actor.role}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Reopened Banner Notice if applicable */}
      {currentStatus === "REOPENED" && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-900">
          <AlertTriangleIcon size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Issue Flagged as Incomplete</p>
            <p className="mt-0.5 text-rose-700">
              The citizen observed that previous work was unsatisfactory. This ticket has been escalated back to the operations triage queue.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
