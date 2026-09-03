// src/components/Navbar.tsx

"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Apex<span className="text-blue-500">Bank</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <a href="/#services" className="hover:text-blue-400 transition-colors">Products & Services</a>
          <a href="/#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="/#news" className="hover:text-blue-400 transition-colors">News & Events</a>
          <a href="/#testimonials" className="hover:text-blue-400 transition-colors">Reviews</a>
          <a href="/#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
        </div>

        {/* Action Buttons (Sign In & Open Account) - Visible on ALL screens */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link
            href="/auth?mode=signin"
            className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth?mode=signup"
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/40 shrink-0"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}