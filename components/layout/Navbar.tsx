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
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E2D8] bg-[#FBF9F5]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <CivicLogo size={32} />
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-[#182026] group-hover:text-[#E05A47] transition">
                CivicFlow
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#788290] font-mono -mt-1 font-semibold">
                Verified Civic Lifecycle
              </span>
            </div>
          </Link>

          {/* Live City Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F4EFEA] border border-[#E8E2D8] text-[11px] font-medium text-[#4B5563]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Wards Active: 12</span>
            <span className="text-[#D5CCC0]">•</span>
            <span>Avg SLA: 26.4h</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4B5563]">
          <Link
            href="/#how-it-works"
            className="hover:text-[#182026] transition py-1"
          >
            How it Works
          </Link>
          <Link
            href="/#live-map"
            className="hover:text-[#182026] transition py-1"
          >
            City Map
          </Link>
          <Link
            href="/#transparency"
            className="hover:text-[#182026] transition py-1"
          >
            Transparency
          </Link>

          {currentUser && (
            <>
              <span className="h-4 w-px bg-[#E8E2D8]" />
              {isAuthority ? (
                <>
                  <Link
                    href="/authority/dashboard"
                    className={`hover:text-[#182026] transition py-1 flex items-center gap-1.5 ${
                      pathname.startsWith("/authority")
                        ? "text-[#19382F] font-semibold"
                        : ""
                    }`}
                  >
                    <ShieldCheckIcon size={16} />
                    Operations Command
                  </Link>
                </>
              ) : (
                <Link
                  href="/citizen/dashboard"
                  className={`hover:text-[#182026] transition py-1 flex items-center gap-1.5 ${
                    pathname.startsWith("/citizen")
                      ? "text-[#E05A47] font-semibold"
                      : ""
                  }`}
                >
                  <UserIcon size={16} />
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
                    className="w-8 h-8 rounded-full object-cover border border-[#D5CCC0]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#19382F] text-[#FBF9F5] flex items-center justify-center text-xs font-bold">
                    {currentUser.name[0]}
                  </div>
                )}
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-semibold text-[#182026] leading-none">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-[#788290] mt-0.5 uppercase tracking-wider font-mono">
                    {currentUser.role}
                  </p>
                </div>
              </div>

              {!isAuthority && (
                <Link
                  href="/report"
                  className="bg-[#E05A47] hover:bg-[#CC4836] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs hover:shadow transition flex items-center gap-1.5"
                >
                  <RoadIcon size={14} />
                  Report Issue
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-xs text-[#788290] hover:text-[#182026] px-2 py-1.5 rounded hover:bg-[#F4EFEA] transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-[#182026] hover:text-[#E05A47] px-3 py-2 rounded-lg hover:bg-[#F4EFEA] transition"
              >
                Sign In
              </Link>
              <Link
                href="/report"
                className="bg-[#E05A47] hover:bg-[#CC4836] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs hover:shadow transition flex items-center gap-1.5"
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
            className="p-2 rounded-lg text-[#182026] hover:bg-[#F4EFEA] transition cursor-pointer"
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
        <div className="md:hidden border-t border-[#E8E2D8] bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#182026]"
          >
            How it Works
          </Link>
          <Link
            href="/#live-map"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#182026]"
          >
            City Map
          </Link>
          <Link
            href="/#transparency"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#182026]"
          >
            Transparency
          </Link>

          {currentUser ? (
            <div className="pt-3 border-t border-[#E8E2D8] space-y-2">
              <p className="text-xs font-bold text-[#788290] uppercase tracking-wider font-mono">
                Signed in as {currentUser.name} ({currentUser.role})
              </p>
              {isAuthority ? (
                <Link
                  href="/authority/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-[#19382F]"
                >
                  Authority Operations Center
                </Link>
              ) : (
                <Link
                  href="/citizen/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-[#E05A47]"
                >
                  My Citizen Reports
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-sm text-rose-700 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#E8E2D8] flex gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium border border-[#D5CCC0] rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-semibold bg-[#E05A47] text-white rounded-lg"
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
