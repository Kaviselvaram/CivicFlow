import React from "react";
import Link from "next/link";
import { CivicLogo } from "../icons";

export function Footer() {
  return (
    <footer className="border-t border-[#E8E2D8] bg-[#F4EFEA] text-[#182026] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Editorial Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <CivicLogo size={28} />
              <span className="font-display font-bold text-xl text-[#182026]">
                CivicFlow
              </span>
            </div>
            <p className="font-display text-sm text-[#4B5563] max-w-md leading-relaxed italic">
              &ldquo;Civic problems should not disappear into an administrative
              black hole. Every pothole, dark crosswalk, and flooded curb deserves
              a transparent path to verified physical resolution.&rdquo;
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#788290]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
              <span>Civic Core Engine v1.0.4 • Public Operational Ledger</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold text-[#182026] uppercase tracking-wider font-mono mb-3">
              Civic Observations
            </h4>
            <ul className="space-y-2 text-xs text-[#4B5563]">
              <li>
                <Link href="/report?cat=ROADS" className="hover:text-[#E05A47] transition">
                  Road Cavities & Asphalt
                </Link>
              </li>
              <li>
                <Link href="/report?cat=WATER" className="hover:text-[#E05A47] transition">
                  Water Main & Drainage
                </Link>
              </li>
              <li>
                <Link href="/report?cat=ELECTRICAL" className="hover:text-[#E05A47] transition">
                  Streetlight Outages
                </Link>
              </li>
              <li>
                <Link href="/report?cat=SANITATION" className="hover:text-[#E05A47] transition">
                  Commercial Dumping & Waste
                </Link>
              </li>
              <li>
                <Link href="/report?cat=INFRASTRUCTURE" className="hover:text-[#E05A47] transition">
                  Park Benches & Guardrails
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Trust */}
          <div>
            <h4 className="text-xs font-bold text-[#182026] uppercase tracking-wider font-mono mb-3">
              Transparency
            </h4>
            <ul className="space-y-2 text-xs text-[#4B5563]">
              <li>
                <Link href="/#how-it-works" className="hover:text-[#182026] transition">
                  The 5-Stage Lifecycle
                </Link>
              </li>
              <li>
                <Link href="/#live-map" className="hover:text-[#182026] transition">
                  Geospatial Triage Map
                </Link>
              </li>
              <li>
                <Link href="/#transparency" className="hover:text-[#182026] transition">
                  District Resolution SLA
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#182026] transition">
                  Operations Command Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#788290]">
          <p>© {new Date().getFullYear()} CivicFlow. Designed for open municipal collaboration.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">
            WCAG 2.1 AA Compliant • Zero Dark Patterns
          </p>
        </div>
      </div>
    </footer>
  );
}
