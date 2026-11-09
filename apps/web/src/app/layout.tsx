import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FunnelDoctor AI — Autonomous Multimodal Conversion & RCA Platform",
  description:
    "Open-source diagnostic telemetry and code remediation engine for web funnels. Diagnose conversion churn and synthesize clean code fixes in 60s.",
  keywords: ["conversion rate optimization", "cro", "funnel analysis", "code remediation", "react components", "web analytics"],
  authors: [{ name: "FunnelDoctor Team" }],
  openGraph: {
    title: "FunnelDoctor AI — Autonomous Multimodal Conversion & RCA Platform",
    description: "Diagnose conversion churn. Synthesize the clean code fix in 60s.",
    url: "https://funneldoctor.ai",
    siteName: "FunnelDoctor AI",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FunnelDoctor AI — Autonomous Multimodal Conversion & RCA Platform",
    description: "Diagnose conversion churn. Synthesize the clean code fix in 60s.",
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
