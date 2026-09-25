"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CivicLogo, RoadIcon, ShieldCheckIcon, UserIcon } from "../icons";
import { UserSession } from "@/lib/types";

export function Navbar({ currentUser }: { currentUser?: UserSession | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      window.location.href = "/";
    }
  }

  const isAuthority = currentUser?.role === "AUTHORITY" || currentUser?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E7E1D7] bg-[#FAF8F5]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <CivicLogo size={32} />
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl tracking-tight text-[#12181F] group-hover:text-[#D94532] transition">
                CivicFlow
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#687584] font-mono -mt-1 font-bold">
                Verified Civic Lifecycle
              </span>
            </div>
          </Link>

          {/* Live City Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E1D7] text-[11px] font-mono font-medium text-[#4B5563] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Wards: 12 Active</span>
            <span className="text-[#D8D0C3]">•</span>
            <span>Avg SLA: 26.4h</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-semibold text-[#4B5563]">
          <Link
            href="/#how-it-works"
            className="hover:text-[#12181F] transition py-1"
          >
            How it Works
          </Link>
          <Link
            href="/#live-map"
            className="hover:text-[#12181F] transition py-1"
          >
            City Map
          </Link>
          <Link
            href="/#transparency"
            className="hover:text-[#12181F] transition py-1"
          >
            Transparency
          </Link>

          {currentUser && (
            <>
              <span className="h-4 w-px bg-[#E7E1D7]" />
              {isAuthority ? (
                <>
                  <Link
                    href="/authority/dashboard"
                    className={`hover:text-[#12181F] transition py-1 flex items-center gap-1.5 ${
                      pathname.startsWith("/authority")
                        ? "text-[#14352B] font-bold"
                        : ""
                    }`}
                  >
                    <ShieldCheckIcon size={15} />
                    Operations Command
                  </Link>
                </>
              ) : (
                <Link
                  href="/citizen/dashboard"
                  className={`hover:text-[#12181F] transition py-1 flex items-center gap-1.5 ${
                    pathname.startsWith("/citizen")
                      ? "text-[#D94532] font-bold"
                      : ""
                  }`}
                >
                  <UserIcon size={15} />
                  My Reports
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-2">
                {currentUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#D8D0C3]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#14352B] text-[#FAF8F5] flex items-center justify-center text-xs font-bold font-mono">
                    {currentUser.name[0]}
                  </div>
                )}
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-bold text-[#12181F] leading-none">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-[#687584] mt-0.5 uppercase tracking-wider font-mono">
                    {currentUser.role}
                  </p>
                </div>
              </div>

              {!isAuthority && (
                <Link
                  href="/report"
                  className="bg-[#D94532] hover:bg-[#B83827] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RoadIcon size={14} />
                  Report Issue
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-xs font-mono text-[#687584] hover:text-[#12181F] px-2.5 py-1.5 rounded-lg hover:bg-white transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-mono font-semibold text-[#12181F] hover:text-[#D94532] px-3.5 py-2 rounded-xl hover:bg-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/report"
                className="bg-[#D94532] hover:bg-[#B83827] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <RoadIcon size={14} />
                Report an Issue
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger button */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/report"
            className="bg-[#E05A47] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md"
          >
            Report
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#12181F] hover:bg-[#FAF8F5] transition cursor-pointer border border-[#E7E1D7]"
            aria-label="Toggle Navigation Menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E1D7] bg-[#FAF8F5] px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#12181F]"
          >
            How it Works
          </Link>
          <Link
            href="/#live-map"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#12181F]"
          >
            City Map
          </Link>
          <Link
            href="/#transparency"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#12181F]"
          >
            Transparency
          </Link>

          {currentUser ? (
            <div className="pt-3 border-t border-[#E7E1D7] space-y-2">
              <p className="text-xs font-bold text-[#687584] uppercase tracking-wider font-mono">
                Signed in as {currentUser.name} ({currentUser.role})
              </p>
              {isAuthority ? (
                <Link
                  href="/authority/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-bold text-[#14352B]"
                >
                  Authority Operations Center
                </Link>
              ) : (
                <Link
                  href="/citizen/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-bold text-[#D94532]"
                >
                  My Citizen Reports
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-sm text-rose-700 font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#E7E1D7] flex gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 text-xs font-bold font-mono border border-[#D8D0C3] rounded-xl bg-white text-[#12181F]"
              >
                Sign In
              </Link>
              <Link
                href="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 text-xs font-bold font-mono bg-[#D94532] text-white rounded-xl shadow-xs"
              >
                Report Issue
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
