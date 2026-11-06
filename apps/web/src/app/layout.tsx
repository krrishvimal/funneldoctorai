import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FunnelDoctor AI — Autonomous Multimodal Conversion, UX Vision & RCA Platform",
  description:
    "Autonomous Multimodal Conversion & Root-Cause-Analysis SaaS built for Startup Buildathon India 2026. Powered by Google DeepMind & Google Cloud Gemini 2.5.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-indigo-600 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
