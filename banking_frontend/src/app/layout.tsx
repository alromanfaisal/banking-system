import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexBank - Smart Digital Banking",
  description: "Next-Gen Digital Banking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}