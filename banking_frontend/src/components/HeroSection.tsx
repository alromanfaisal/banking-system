"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBuildingColumns, 
  faShieldHalved, 
  faArrowRight, 
  faBolt 
} from "@fortawesome/free-solid-svg-icons";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-16 pb-24 border-b border-slate-800">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold">
            <FontAwesomeIcon icon={faShieldHalved} className="h-3.5 w-3.5" />
            <span>Bank-Grade Encryption & Instant Transfers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Next-Gen Digital Banking with <span className="text-blue-500">ApexBank</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Manage your finances seamlessly with real-time transaction tracking, fast local transfers, and zero hidden fees—all protected by industry-standard security.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth?mode=signup"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/25 active:scale-95"
            >
              <span>Open an Account</span>
              <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
            </Link>

            <Link
              href="/auth?mode=signin"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Sign In to Portal</span>
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left">
            <div className="p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
              <div className="text-blue-500 mb-2">
                <FontAwesomeIcon icon={faBolt} className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Instant Ledger Updates</h3>
              <p className="text-xs text-slate-400 mt-1">Real-time balances and instant notification for every transaction.</p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
              <div className="text-blue-500 mb-2">
                <FontAwesomeIcon icon={faBuildingColumns} className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Atomic Transfers</h3>
              <p className="text-xs text-slate-400 mt-1">Secured database transactions that guarantee zero dropped funds.</p>
            </div>

            <div className="p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
              <div className="text-blue-500 mb-2">
                <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Protected JWT Auth</h3>
              <p className="text-xs text-slate-400 mt-1">Automatic session handling with encrypted token storage.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}