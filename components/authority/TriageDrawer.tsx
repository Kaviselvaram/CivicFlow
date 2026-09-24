"use client";

import React, { useState } from "react";
import {
  XIcon,
  CheckCircleIcon,
  TruckIcon,
  BuildingIcon,
  SparklesIcon,
  CameraIcon,
  AlertTriangleIcon,
} from "../icons";
import { Button } from "../ui/Button";
import { StatusBadge, PriorityBadge } from "../ui/Badge";
import { Textarea } from "../ui/Input";

export interface DrawerIssueData {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string | null;
  priority: string;
  status: string;
  address: string;
  ward?: string | null;
  latitude: number;
  longitude: number;
  photoUrl: string;
  resolutionPhotoUrl?: string | null;
  resolutionNotes?: string | null;
  reporter?: { name: string; email: string; phone?: string | null } | null;
  department?: { id: string; name: string } | null;
  crew?: { id: string; name: string; leadName?: string } | null;
  createdAt: string | Date;
}

interface DepartmentOption {
  id: string;
  name: string;
  slug: string;
}

interface CrewOption {
  id: string;
  name: string;
  leadName: string;
  departmentId: string;
}

// Preset resolution proof photos for quick supervisor demo testing
const RESOLUTION_PHOTO_PRESETS = [
  {
    label: "Fresh Asphalt Patch",
    url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "Cleaned Sidewalk & Bins",
    url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "Illuminated LED Luminaire",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80",
  },
  {
    label: "Repaired Valve & Drainage",
    url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1000&q=80",
  },
];

export function TriageDrawer({
  isOpen,
  onClose,
  issue,
  departments = [],
  crews = [],
  onUpdated,
  showToast,
}: {
  isOpen: boolean;
  onClose: () => void;
  issue: DrawerIssueData | null;
  departments: DepartmentOption[];
  crews: CrewOption[];
  onUpdated?: () => void;
  showToast?: (type: "success" | "error" | "info", title: string, message?: string) => void;
}) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedCrewId, setSelectedCrewId] = useState<string>("");
  const [triageNote, setTriageNote] = useState<string>("");
  const [isSavingTriage, setIsSavingTriage] = useState<boolean>(false);

  // Status transition state
  const [isResolveModalOpen, setIsResolveModalOpen] = useState<boolean>(false);
  const [resolutionNotes, setResolutionNotes] = useState<string>("");
  const [resolutionPhotoUrl, setResolutionPhotoUrl] = useState<string>("");
  const [isSubmittingStatus, setIsSubmittingStatus] = useState<boolean>(false);

  // Sync state when issue changes
  React.useEffect(() => {
    if (issue) {
      setSelectedDeptId(issue.department?.id || departments[0]?.id || "");
      setSelectedPriority(issue.priority || "MEDIUM");
      setSelectedCrewId(issue.crew?.id || "");
      setTriageNote("");
      setResolutionNotes(
        issue.resolutionNotes ||
          "Defect inspected and physical repair executed according to municipal standard specifications."
      );
      setResolutionPhotoUrl(
        issue.resolutionPhotoUrl || RESOLUTION_PHOTO_PRESETS[0].url
      );
    }
  }, [issue, departments]);

  if (!isOpen || !issue) return null;

  const availableCrews = crews.filter(
    (c) => !selectedDeptId || c.departmentId === selectedDeptId
  );

  async function handleSaveTriage() {
    setIsSavingTriage(true);
    try {
      const res = await fetch(`/api/issues/${issue?.id}/triage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId: selectedDeptId,
          priority: selectedPriority,
          crewId: selectedCrewId || null,
          note: triageNote || `Triage updated by operations supervisor. Priority: ${selectedPriority}.`,
        }),
      });

      if (!res.ok) throw new Error("Failed to update triage");

      showToast?.("success", "Triage Updated", "Department, priority, and crew assignment saved.");
      onUpdated?.();
      onClose();
    } catch {
      showToast?.("error", "Error", "Could not save triage changes.");
    } finally {
      setIsSavingTriage(false);
    }
  }

  async function handleAdvanceStatus(targetStatus: string) {
    if (targetStatus === "RESOLVED") {
      setIsResolveModalOpen(true);
      return;
    }

    setIsSubmittingStatus(true);
    try {
      const res = await fetch(`/api/issues/${issue?.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toStatus: targetStatus,
          note: `Supervisor advanced work order to ${targetStatus}.`,
        }),
      });

      if (!res.ok) throw new Error("Status transition failed");

      showToast?.("success", "Status Updated", `Issue transitioned to ${targetStatus}`);
      onUpdated?.();
      onClose();
    } catch {
      showToast?.("error", "Error", "Could not advance status.");
    } finally {
      setIsSubmittingStatus(false);
    }
  }

  async function handleConfirmResolve() {
    if (!resolutionNotes.trim()) {
      showToast?.("error", "Resolution notes required", "Please describe work performed.");
      return;
    }

    setIsSubmittingStatus(true);
    try {
      const res = await fetch(`/api/issues/${issue?.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toStatus: "RESOLVED",
          note: resolutionNotes,
          resolutionPhotoUrl: resolutionPhotoUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to mark resolved");

      showToast?.("success", "Issue Marked Resolved", "Notice dispatched to citizen for verification.");
      setIsResolveModalOpen(false);
      onUpdated?.();
      onClose();
    } catch {
      showToast?.("error", "Error", "Could not mark as resolved.");
    } finally {
      setIsSubmittingStatus(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-xl bg-white border-l border-[#E8E2D8] shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex items-start justify-between bg-[#FBF9F5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#182026]">
                {issue.ticketNumber}
              </span>
              <StatusBadge status={issue.status} />
              <PriorityBadge priority={issue.priority} />
            </div>
            <h2 className="font-display font-bold text-xl text-[#182026] mt-1 line-clamp-1">
              {issue.title}
            </h2>
            <p className="text-xs text-[#788290] mt-0.5">📍 {issue.address}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#788290] hover:text-[#182026] hover:bg-[#F4EFEA] transition cursor-pointer"
            aria-label="Close triage panel"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Defect Photo View */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-[#788290] uppercase tracking-wider">
              Citizen Photo Evidence
            </span>
            <div className="relative rounded-xl overflow-hidden border border-[#E8E2D8] aspect-video bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={issue.photoUrl}
                alt="Defect evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                Captured {new Date(issue.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#FBF9F5] border border-[#E8E2D8] rounded-xl p-4 space-y-1">
            <span className="text-xs font-mono font-semibold text-[#788290] uppercase tracking-wider">
              Citizen Description
            </span>
            <p className="text-sm text-[#182026] leading-relaxed">
              {issue.description}
            </p>
            {issue.reporter && (
              <div className="pt-2 mt-2 border-t border-[#E8E2D8] flex items-center justify-between text-xs text-[#788290]">
                <span>Reported by: <strong>{issue.reporter.name}</strong></span>
                {issue.reporter.phone && <span>{issue.reporter.phone}</span>}
              </div>
            )}
          </div>

          {/* Supervisor Triage Controls */}
          <div className="border border-[#E8E2D8] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-[#182026] flex items-center gap-2">
                <BuildingIcon size={18} className="text-[#19382F]" />
                Department & Crew Dispatch
              </h3>
              <span className="text-[11px] font-mono text-[#788290]">
                Supervisor Override
              </span>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-[#182026] uppercase tracking-wider mb-1.5">
                Responsible Department
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full text-sm rounded-lg border border-[#D5CCC0] py-2 px-3 bg-white text-[#182026] focus:border-[#19382F] focus:outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-[#182026] uppercase tracking-wider mb-1.5">
                Priority Urgency Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      selectedPriority === p
                        ? "bg-[#182026] text-white border-[#182026]"
                        : "bg-[#FBF9F5] text-[#4B5563] border-[#E8E2D8] hover:bg-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Field Crew Assignment */}
            <div>
              <label className="block text-xs font-semibold text-[#182026] uppercase tracking-wider mb-1.5">
                Dispatch Specific Field Crew
              </label>
              <select
                value={selectedCrewId}
                onChange={(e) => setSelectedCrewId(e.target.value)}
                className="w-full text-sm rounded-lg border border-[#D5CCC0] py-2 px-3 bg-white text-[#182026] focus:border-[#19382F] focus:outline-none"
              >
                <option value="">-- No specific crew assigned --</option>
                {availableCrews.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Lead: {c.leadName})
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Triage / Dispatch Remarks"
              placeholder="e.g., Confirmed cavity depth > 35cm. Asphalt hot-mix compaction team routed."
              value={triageNote}
              onChange={(e) => setTriageNote(e.target.value)}
              rows={2}
            />

            <Button
              variant="pine"
              size="sm"
              onClick={handleSaveTriage}
              isLoading={isSavingTriage}
              className="w-full"
            >
              Save Triage & Assignment
            </Button>
          </div>

          {/* Quick Lifecycle Advancement Engine */}
          <div className="border border-[#E8E2D8] rounded-xl p-5 space-y-3">
            <h3 className="font-display font-semibold text-base text-[#182026] flex items-center gap-2">
              <TruckIcon size={18} className="text-[#E05A47]" />
              Work Order Status Engine
            </h3>
            <p className="text-xs text-[#788290]">
              Advance the physical lifecycle of this ticket as field work progresses:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {issue.status === "REPORTED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAdvanceStatus("IN_REVIEW")}
                  isLoading={isSubmittingStatus}
                >
                  Move to In Review →
                </Button>
              )}

              {(issue.status === "REPORTED" || issue.status === "IN_REVIEW") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAdvanceStatus("ASSIGNED")}
                  isLoading={isSubmittingStatus}
                >
                  Mark as Assigned →
                </Button>
              )}

              {(issue.status === "ASSIGNED" || issue.status === "IN_REVIEW") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAdvanceStatus("IN_PROGRESS")}
                  isLoading={isSubmittingStatus}
                >
                  Mark In Progress 🚜
                </Button>
              )}

              {issue.status !== "RESOLVED" && issue.status !== "VERIFIED" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAdvanceStatus("RESOLVED")}
                  isLoading={isSubmittingStatus}
                  icon={<CheckCircleIcon size={16} />}
                >
                  Mark as Resolved & Attach Proof ✓
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#E8E2D8] bg-[#FBF9F5] flex items-center justify-between">
          <span className="text-xs font-mono text-[#788290]">
            Target Ward: {issue.ward || "Ward 4"}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Drawer
          </Button>
        </div>
      </div>

      {/* MODAL: Attach Resolution Evidence & Mark RESOLVED */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D8] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="font-display font-bold text-xl text-[#182026]">
                Mark Ticket #{issue.ticketNumber} Resolved
              </h3>
              <p className="text-xs text-[#788290] mt-1">
                Provide field resolution evidence so the citizen can inspect and verify.
              </p>
            </div>

            {/* Resolution Photo Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#182026] uppercase tracking-wider mb-2">
                Resolution Proof Photo *
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {RESOLUTION_PHOTO_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setResolutionPhotoUrl(preset.url)}
                    className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer flex items-center gap-2 ${
                      resolutionPhotoUrl === preset.url
                        ? "border-[#19382F] bg-[#EBF3F0] font-bold text-[#19382F]"
                        : "border-[#E8E2D8] hover:bg-[#FBF9F5] text-[#4B5563]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#19382F]" />
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>

              {resolutionPhotoUrl && (
                <div className="relative rounded-xl overflow-hidden border border-[#E8E2D8] aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolutionPhotoUrl}
                    alt="Resolution preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#19382F] text-white text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                    ✓ Resolution Proof
                  </div>
                </div>
              )}
            </div>

            <Textarea
              label="Field Crew Resolution Notes *"
              placeholder="e.g., Road Patching Crew Bravo filled cavity with hot-mix asphalt, leveled with tamping roller, and cleared traffic barriers."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={3}
              required
            />

            <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsResolveModalOpen(false)}
                disabled={isSubmittingStatus}
              >
                Cancel
              </Button>
              <Button
                variant="pine"
                onClick={handleConfirmResolve}
                isLoading={isSubmittingStatus}
                icon={<CheckCircleIcon size={16} />}
              >
                Confirm Resolution
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
