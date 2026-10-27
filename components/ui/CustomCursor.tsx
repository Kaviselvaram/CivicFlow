"use client";

import React, { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTouch] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });

  useEffect(() => {
    if (hasTouch) return;

    function onMouseMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("button") ||
            target.closest("a") ||
            target.closest("input") ||
            target.closest("select") ||
            target.closest("textarea") ||
            target.closest('[role="button"]') ||
            window.getComputedStyle(target).cursor === "pointer"
        );
        setIsPointer(isInteractive);
      }
    }

    function onMouseLeave() {
      setIsVisible(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [hasTouch]);

  if (hasTouch || !isVisible) return null;

  return (
    <>
      {/* Outer Follower Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div
          className={`rounded-full border border-[#D94532]/60 transition-all duration-200 ${
            isPointer
              ? "w-10 h-10 bg-[#D94532]/10 scale-110 border-[#D94532]"
              : "w-7 h-7"
          }`}
        />
      </div>

      {/* Inner Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div
          className={`rounded-full bg-[#12181F] transition-transform duration-150 ${
            isPointer ? "w-1.5 h-1.5 bg-[#D94532]" : "w-1 h-1"
          }`}
        />
      </div>
    </>
  );
}
