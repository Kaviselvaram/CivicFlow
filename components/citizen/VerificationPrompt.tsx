"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircleIcon, RotateCcwIcon, StarIcon, ShieldCheckIcon } from "../icons";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Input";
import { Modal } from "../ui/Modal";

interface VerificationPromptProps {
  issueId: string;
  ticketNumber: string;
  status: string;
  citizenRating?: number | null;
  citizenFeedback?: string | null;
  reopenReason?: string | null;
  verifiedAt?: string | Date | null;
  onStatusUpdated?: () => void;
  showToast?: (type: "success" | "error" | "info", title: string, message?: string) => void;
}

export function VerificationPrompt({
  issueId,
  ticketNumber,
  status,
  citizenRating,
  citizenFeedback,
  reopenReason,
  verifiedAt,
  onStatusUpdated,
  showToast,
}: VerificationPromptProps) {
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>("");
  const [reopenText, setReopenText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleVerify() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/issues/${issueId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenRating: rating,
          citizenFeedback: feedback || "Verified in good physical condition.",
        }),
      });

      if (!res.ok) throw new Error("Failed to verify resolution");

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#19382F", "#E05A47", "#15803D", "#D97706"],
      });

      showToast?.("success", "Resolution Verified!", "Thank you for confirming the repair.");
      setIsVerifyModalOpen(false);
      onStatusUpdated?.();
    } catch {
      showToast?.("error", "Error", "Could not verify resolution. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReopen() {
    if (!reopenText.trim()) {
      showToast?.("error", "Reason required", "Please describe what defect remains.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/issues/${issueId}/reopen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reopenReason: reopenText,
        }),
      });

      if (!res.ok) throw new Error("Failed to reopen issue");

      showToast?.("info", "Issue Reopened", "Ticket has been escalated back to Operations.");
      setIsReopenModalOpen(false);
      onStatusUpdated?.();
    } catch {
      showToast?.("error", "Error", "Could not reopen ticket.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // State 1: Verified Seal
  if (status === "VERIFIED") {
    return (
      <div className="bg-[#19382F] text-[#FBF9F5] rounded-2xl p-6 shadow-md border border-[#19382F] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-[#E05A47] shrink-0">
              <ShieldCheckIcon size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#E05A47] font-bold">
                  Official Verification Seal
                </span>
                <span className="text-white/40">•</span>
                <span className="text-xs font-mono text-white/70">
                  {verifiedAt
                    ? new Date(verifiedAt).toLocaleDateString()
                    : "Verified"}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mt-0.5">
                Resolution Verified by Citizen
              </h3>
              {citizenFeedback && (
                <p className="text-xs text-white/80 mt-1 italic max-w-lg">
                  &ldquo;{citizenFeedback}&rdquo;
                </p>
              )}
            </div>
          </div>

          {citizenRating && (
            <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 self-start sm:self-auto">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  size={16}
                  className={s <= citizenRating ? "text-amber-400" : "text-white/30"}
                  fill={s <= citizenRating ? "#FBBF24" : "none"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // State 2: Awaiting Citizen Verification (Status === RESOLVED)
  if (status === "RESOLVED") {
    return (
      <>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                  Action Required: Confirm Physical Repair
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#182026]">
                Municipal Crew Marked This Issue Resolved
              </h3>
              <p className="text-xs text-[#4B5563] max-w-xl">
                Please inspect the site or review the resolution proof photo. Does
                the repair satisfy the civic expectation?
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Button
                variant="pine"
                size="md"
                onClick={() => setIsVerifyModalOpen(true)}
                icon={<CheckCircleIcon size={16} />}
                className="flex-1 lg:flex-initial"
              >
                Confirm Resolution
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => setIsReopenModalOpen(true)}
                icon={<RotateCcwIcon size={16} />}
                className="flex-1 lg:flex-initial"
              >
                Issue Persists (Reopen)
              </Button>
            </div>
          </div>
        </div>

        {/* Modal 1: Confirm Verification */}
        <Modal
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          title="Confirm Resolution"
          subtitle={`Ticket #${ticketNumber} — Mark as physically resolved`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#182026] uppercase tracking-wider mb-2">
                Rate Work Quality (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1.5 rounded-lg hover:bg-[#F4EFEA] transition cursor-pointer"
                  >
                    <StarIcon
                      size={28}
                      className={s <= rating ? "text-amber-500" : "text-gray-300"}
                      fill={s <= rating ? "#F59E0B" : "none"}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#182026] ml-2 font-mono">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <Textarea
              label="Citizen Verification Remarks (Optional)"
              placeholder="e.g., Inspected on my way home. Smooth asphalt patch with no residual gravel."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />

            <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsVerifyModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="pine"
                onClick={handleVerify}
                isLoading={isSubmitting}
                icon={<CheckCircleIcon size={16} />}
              >
                Confirm & Seal Resolution
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal 2: Reopen Issue */}
        <Modal
          isOpen={isReopenModalOpen}
          onClose={() => setIsReopenModalOpen(false)}
          title="Flag Defect as Incomplete"
          subtitle={`Ticket #${ticketNumber} — Reopen for department re-triage`}
        >
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800">
              Please explain why the repair was insufficient. Your note will be
              dispatched immediately to the supervisor.
            </div>

            <Textarea
              label="What remains unresolved? *"
              placeholder="e.g., The crew only poured loose gravel which washed away after rain. The cavity is still active and hazard persists."
              value={reopenText}
              onChange={(e) => setReopenText(e.target.value)}
              rows={4}
              required
            />

            <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsReopenModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReopen}
                isLoading={isSubmitting}
                icon={<RotateCcwIcon size={16} />}
              >
                Escalate & Reopen Ticket
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  // State 3: Reopened status notice
  if (status === "REOPENED") {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-xs text-rose-900 flex items-start gap-3">
        <RotateCcwIcon size={20} className="text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm">Ticket Reopened by Resident</p>
          <p className="text-rose-700">
            {reopenReason ||
              "The citizen noted that physical work was incomplete. Operations supervisor has been alerted for re-assignment."}
          </p>
        </div>
      </div>
    );
  }

  // State 4: Default ongoing work
  return null;
}
