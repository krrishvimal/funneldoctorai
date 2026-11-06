import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FunnelDoctor AI | Autonomous Multimodal Conversion, UX Vision & RCA Platform",
  description:
    "Autonomous Multimodal Conversion & Root-Cause-Analysis SaaS built for Startup Buildathon India 2026. Powered by Google DeepMind & Google Cloud Gemini 2.5.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#030712] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
