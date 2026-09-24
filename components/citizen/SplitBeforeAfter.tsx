"use client";

import React, { useState } from "react";

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

  function handleMove(clientX: number, rect: DOMRect) {
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-[#E8E2D8] bg-[#F4EFEA] select-none cursor-ew-resize aspect-video ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After image (Base layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterUrl}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-md bg-[#19382F]/90 text-[#FBF9F5] text-xs font-semibold backdrop-blur-xs font-mono">
        ✓ {afterLabel}
      </div>

      {/* Before image (Clipped layer) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: "100%", height: "100%" }}
          draggable={false}
        />
        <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-[#182026]/90 text-white text-xs font-semibold backdrop-blur-xs font-mono">
          ⚠ {beforeLabel}
        </div>
      </div>

      {/* Interactive Divider Bar */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-[#D5CCC0] flex items-center justify-center text-[#182026] text-xs font-bold">
          ⇄
        </div>
      </div>
    </div>
  );
}
