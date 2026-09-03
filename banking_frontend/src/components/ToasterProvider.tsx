// src/components/ToasterProvider.tsx

"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0f172a", // Slate-900 background matching your design
          color: "#f8fafc",     // Slate-50 text
          border: "1px solid #1e293b",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#0f172a",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#0f172a",
          },
        },
      }}
    />
  );
}