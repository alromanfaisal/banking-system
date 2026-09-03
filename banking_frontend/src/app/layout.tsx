// src/app/layout.tsx

import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "ApexBank - Smart Digital Banking",
  description: "Next-Gen Digital Banking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add suppressHydrationWarning here 👇
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}