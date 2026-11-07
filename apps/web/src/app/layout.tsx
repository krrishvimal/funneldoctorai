import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FunnelDoctor AI — Autonomous Multimodal Conversion & RCA Platform",
  description:
    "Clinical Swiss Diagnostic Telemetry for Multimodal Conversion Friction. Built for Startup Buildathon India 2026. Powered by Google DeepMind & Google Cloud Gemini 2.5.",
  keywords: ["conversion rate optimization", "cro", "funnel analysis", "gemini vision", "bigquery telemetry", "startup buildathon india"],
  authors: [{ name: "FunnelDoctor Team" }],
  openGraph: {
    title: "FunnelDoctor AI — Autonomous Multimodal Conversion & RCA Platform",
    description: "Diagnose conversion churn. Synthesize the fix in 60s. Powered by Google DeepMind & Gemini 2.5.",
    url: "https://funneldoctor.ai",
    siteName: "FunnelDoctor AI",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FunnelDoctor AI — Autonomous Multimodal Conversion & RCA Platform",
    description: "Diagnose conversion churn. Synthesize the fix in 60s with Gemini 2.5 Multimodal RCA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#FBFBFB] text-[#09090B] antialiased selection:bg-emerald-500/20 selection:text-emerald-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
