import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentNear AI | Hyper-Local P2P Daily & High-Utility Rental Marketplace",
  description:
    "AI-Native Hyper-Local Peer-to-Peer Daily & High-Utility Product Rental Marketplace built for Startup Buildathon India 2026. Powered by Google Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
