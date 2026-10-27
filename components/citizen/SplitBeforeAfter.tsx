"use client";

import React, { useState, useRef } from "react";

interface SplitBeforeAfterProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function SplitBeforeAfter({
  beforeUrl,
  afterUrl,
  beforeLabel = "Original Defect Observed",
  afterLabel = "Field Crew Resolution Proof",
  className = "",
}: SplitBeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function updatePosition(clientX: number) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  }

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Before and after repair comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full overflow-hidden rounded-2xl border border-[#E6DFD4] bg-[#F3EFE8] select-none cursor-ew-resize aspect-video focus:outline-none focus:ring-2 focus:ring-[#14352B] ${className}`}
    >
      {/* After image (Base layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterUrl}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-lg bg-[#14352B]/95 text-[#FAF8F5] text-xs font-semibold backdrop-blur-md font-mono border border-white/10 shadow-sm">
        ✓ {afterLabel}
      </div>

      {/* Before image (Clipped with modern CSS clip-path) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt={beforeLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded-lg bg-[#12181F]/90 text-white text-xs font-semibold backdrop-blur-md font-mono border border-white/10 shadow-sm">
          ⚠ {beforeLabel}
        </div>
      </div>

      {/* Interactive Divider Bar */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl border border-[#D1C7B8] flex items-center justify-center text-[#12181F] text-xs font-bold transition-transform hover:scale-110 active:scale-95">
          <span className="text-[#D94532]">⇄</span>
        </div>
      </div>
    </div>
  );
}
