"use client";

import React, { useEffect, useRef } from "react";
import { XIcon } from "../icons";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white border border-[#E8E2D8] rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#E8E2D8] mb-4">
          <div>
            <h2
              id="modal-title"
              className="font-display font-semibold text-xl text-[#182026]"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[#788290] mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#788290] hover:text-[#182026] hover:bg-[#F4EFEA] transition cursor-pointer"
            aria-label="Close dialog"
          >
            <XIcon size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
