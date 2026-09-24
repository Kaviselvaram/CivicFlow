"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CivicLogo, ShieldCheckIcon, UserIcon, ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToastProvider, useToast } from "@/components/ui/Toast";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-switch to demo persona if query param provided
  useEffect(() => {
    const persona = searchParams.get("persona");
    if (persona === "citizen") {
      handleDemoLogin("citizen");
    } else if (persona === "authority") {
      handleDemoLogin("authority");
    }
  }, [searchParams]);

  async function handleDemoLogin(persona: "citizen" | "authority") {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona }),
      });

      if (!res.ok) throw new Error("Demo login failed");
      const data = await res.json();

      showToast("success", `Signed in as ${data.user.name}`, `Role: ${data.user.role}`);

      if (data.user.role === "AUTHORITY" || data.user.role === "ADMIN") {
        router.push("/authority/dashboard");
      } else {
        router.push("/citizen/dashboard");
      }
      router.refresh();
    } catch {
      showToast("error", "Error", "Could not sign in with demo account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister
        ? { name, email, password, phone }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      showToast("success", `Welcome back, ${data.user.name}`);
      if (data.user.role === "AUTHORITY" || data.user.role === "ADMIN") {
        router.push("/authority/dashboard");
      } else {
        router.push("/citizen/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication error";
      showToast("error", "Authentication Failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FBF9F5] text-[#182026]">
      {/* Left Column: Editorial Civic Showcase Panel */}
      <div className="md:w-5/12 bg-[#19382F] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background urban image overlay with low opacity */}
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80')",
          }}
        />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <CivicLogo size={32} />
            <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-[#E05A47] transition">
              CivicFlow
            </span>
          </Link>

          <div className="mt-16 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E05A47] font-bold">
              Autonomous Municipal Operations
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
              One unified portal for citizens & city dispatch.
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-sm">
              Whether you are documenting a localized defect or assigning a 10-person
              patching crew, CivicFlow ensures radical visibility at every turn.
            </p>
          </div>
        </div>

        {/* Quick Demo Access Switchers */}
        <div className="relative z-10 pt-12 space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-white/60">
            Instant 1-Click Evaluation Switch:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin("citizen")}
              disabled={loading}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-xs text-[#E05A47] font-mono font-bold">
                <UserIcon size={14} />
                <span>Demo Resident</span>
              </div>
              <p className="text-xs font-bold text-white mt-1 group-hover:text-[#E05A47]">
                Maya Chen
              </p>
              <p className="text-[10px] text-white/60">Active reporter in Ward 4</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("authority")}
              disabled={loading}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                <ShieldCheckIcon size={14} />
                <span>Demo Supervisor</span>
              </div>
              <p className="text-xs font-bold text-white mt-1 group-hover:text-emerald-300">
                David O&apos;Connor
              </p>
              <p className="text-[10px] text-white/60">Public Works Superintendent</p>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="md:w-7/12 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-display font-bold text-3xl text-[#182026]">
                {isRegister ? "Create Citizen Account" : "Sign In to CivicFlow"}
              </h1>
            </div>
            <p className="text-xs text-[#788290]">
              {isRegister
                ? "Join your neighborhood to track and verify civic resolutions."
                : "Enter your registered credentials or select a demo role above."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <Input
                  label="Full Name"
                  placeholder="e.g. Maya Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number (Optional)"
                  placeholder="+1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. citizen@civicflow.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              icon={<ArrowRightIcon size={18} />}
            >
              {isRegister ? "Register & Enter Dashboard" : "Sign In"}
            </Button>
          </form>

          {/* Switch Tab */}
          <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
            <span className="text-[#788290]">
              {isRegister
                ? "Already have an account?"
                : "Need a new resident account?"}
            </span>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="font-bold text-[#E05A47] hover:underline cursor-pointer"
            >
              {isRegister ? "Sign in here →" : "Register as citizen →"}
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-[#788290] hover:text-[#182026] transition"
            >
              ← Return to CivicFlow Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="p-8 text-center">Loading portal...</div>}>
        <LoginFormInner />
      </Suspense>
    </ToastProvider>
  );
}
