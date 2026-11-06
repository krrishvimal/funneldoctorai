import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FunnelDoctor AI | Autonomous CRO & Multimodal Root-Cause Analysis",
  description:
    "Autonomous AI Product Manager and UX Auditor diagnosing funnel drop-offs using quantitative event logs and Gemini Multimodal Vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
