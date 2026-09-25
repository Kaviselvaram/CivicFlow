import React from "react";
import Link from "next/link";
import { CivicLogo } from "../icons";

export function Footer() {
  return (
    <footer className="border-t border-[#E7E1D7] bg-[#FAF8F5] text-[#12181F] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Editorial Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <CivicLogo size={30} />
              <span className="font-serif font-black text-2xl text-[#12181F] tracking-tight">
                CivicFlow
              </span>
            </div>
            <p className="font-serif text-sm sm:text-base text-[#4B5563] max-w-md leading-relaxed italic">
              &ldquo;Civic problems must not disappear into an administrative
              black hole. Every pothole, dark crosswalk, and flooded curb deserves
              a transparent path to verified physical resolution.&rdquo;
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#687584]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Civic Core Engine v1.0.4 • Public Operational Ledger</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-[11px] font-bold text-[#12181F] uppercase tracking-widest font-mono mb-3.5">
              Civic Observations
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#4B5563]">
              <li>
                <Link href="/report?cat=ROADS" className="hover:text-[#D94532] transition">
                  Road Cavities & Asphalt
                </Link>
              </li>
              <li>
                <Link href="/report?cat=WATER" className="hover:text-[#D94532] transition">
                  Water Main & Drainage
                </Link>
              </li>
              <li>
                <Link href="/report?cat=ELECTRICAL" className="hover:text-[#D94532] transition">
                  Streetlight Outages
                </Link>
              </li>
              <li>
                <Link href="/report?cat=SANITATION" className="hover:text-[#D94532] transition">
                  Commercial Dumping & Waste
                </Link>
              </li>
              <li>
                <Link href="/report?cat=INFRASTRUCTURE" className="hover:text-[#D94532] transition">
                  Park Benches & Guardrails
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Trust */}
          <div>
            <h4 className="text-[11px] font-bold text-[#12181F] uppercase tracking-widest font-mono mb-3.5">
              Radical Transparency
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#4B5563]">
              <li>
                <Link href="/#how-it-works" className="hover:text-[#12181F] transition">
                  The 5-Stage Lifecycle
                </Link>
              </li>
              <li>
                <Link href="/#live-map" className="hover:text-[#12181F] transition">
                  Geospatial Triage Map
                </Link>
              </li>
              <li>
                <Link href="/#transparency" className="hover:text-[#12181F] transition">
                  District Resolution SLA
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#12181F] transition">
                  Operations Command Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#E7E1D7] flex flex-col sm:flex-row items-center justify-between text-xs text-[#687584]">
          <p>© {new Date().getFullYear()} CivicFlow. Designed for open municipal collaboration.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">
            WCAG 2.1 AA Compliant • 100% Verified Signoff
          </p>
        </div>
      </div>
    </footer>
  );
}

