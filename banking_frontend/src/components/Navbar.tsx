"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns, faArrowRight, faUserCheck } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user token exists in localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth?mode=signin");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* ApexBank Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2.5 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <FontAwesomeIcon icon={faBuildingColumns} className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Apex<span className="text-blue-500">Bank</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-300">
          <Link href="#services" className="hover:text-blue-500 transition-colors">
            Products & Services
          </Link>
          <Link href="#features" className="hover:text-blue-500 transition-colors">
            Features
          </Link>
          <Link href="#news" className="hover:text-blue-500 transition-colors">
            News & Events
          </Link>
          <Link href="#reviews" className="hover:text-blue-500 transition-colors">
            Reviews
          </Link>
          <Link href="#faq" className="hover:text-blue-500 transition-colors">
            FAQs
          </Link>
        </nav>

        {/* Single Header Action Button */}
        <button
          onClick={handleAuthAction}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
        >
          {isAuthenticated ? (
            <>
              <span>Dashboard</span>
              <FontAwesomeIcon icon={faUserCheck} className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>Get Started</span>
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
            </>
          )}
        </button>

      </div>
    </header>
  );
}