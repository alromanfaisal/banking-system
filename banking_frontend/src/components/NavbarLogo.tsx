// src/components/NavbarLogo.tsx
"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";

export default function NavbarLogo() {
  return (
    <div className="flex items-center space-x-3">
      {/* Icon Container with glowing theme background */}
      <div className="p-2.5 bg-blue-600/20 text-blue-500 rounded-2xl border border-blue-500/30 flex items-center justify-center">
        <FontAwesomeIcon icon={faBuildingColumns} className="h-6 w-6" />
      </div>

      <span className="text-xl font-bold tracking-tight text-white">
        Apex<span className="text-blue-500">Bank</span>
      </span>
    </div>
  );
}