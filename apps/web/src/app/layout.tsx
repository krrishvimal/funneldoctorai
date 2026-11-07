import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FunnelDoctor AI — Autonomous Multimodal Conversion & RCA Platform",
  description:
    "Clinical Swiss Diagnostic Telemetry for Multimodal Conversion Friction. Built for Startup Buildathon India 2026. Powered by Google DeepMind & Google Cloud Gemini 2.5.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#F7F7F8] text-[#0A0A0A] antialiased selection:bg-black selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
