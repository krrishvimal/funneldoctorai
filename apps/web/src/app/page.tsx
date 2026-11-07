"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, ScanEye, Code2, Zap, Play } from 'lucide-react';

export default function FunnelDoctorPremium() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-hidden selection:bg-indigo-500/30 font-sans">
      
      {/* 1. AMBIENT MESH BACKGROUND (The Premium Secret) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] top-[-20%] left-[-10%]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] bottom-[-10%] right-[-5%]"
        />
      </div>

      {/* 2. GLASSMORPHIC NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#030303]/70 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">FunnelDoctor<span className="text-white/50">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#how" className="hover:text-white transition-colors">Architecture</a>
            <a href="#bento" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <button className="px-5 py-2.5 text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/10 rounded-full backdrop-blur-md transition-all">
            Launch Workspace
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* 3. HERO SECTION (Linear Style Typography) */}
        <section className="relative pt-40 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Gemini 2.5 Vision Integrated</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
          >
            Diagnose drop-offs. <br/>
            <span className="bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent">
              Ship the fix in 60s.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed mb-12"
          >
            The world’s first multimodal RCA agent. We combine quantitative SQL telemetry with Gemini Vision UI X-Rays to tell you exactly why users churn—and write the React code to save them.
          </motion.p>

          {/* Floating URL Input Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-[#0A0A0A] border border-white/10 rounded-2xl p-2 shadow-2xl">
              <div className="pl-4 pr-2 text-white/40">https://</div>
              <input 
                type="text" 
                placeholder="your-startup.com/checkout" 
                className="w-full bg-transparent text-white focus:outline-none font-mono text-sm placeholder:text-white/20"
              />
              <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors whitespace-nowrap">
                Run AI Audit <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* 4. ASYMMETRIC BENTO GRID (The Modern SaaS Layout) */}
        <section id="bento" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Box 1: Large Span */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-2 relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-10 hover:bg-white/[0.04] transition-colors group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all" />
              <ScanEye className="w-10 h-10 text-indigo-400 mb-6" />
              <h3 className="text-3xl font-semibold tracking-tight mb-4">Multimodal Vision X-Ray</h3>
              <p className="text-white/50 text-lg max-w-md">Gemini 2.5 scans your mobile UI screenshots, identifying hidden fees, keyboard occlusions, and CTA layout flaws instantly.</p>
              {/* Fake UI Element inside the card */}
              <div className="mt-8 border border-white/10 rounded-xl bg-black/50 p-4 backdrop-blur-md w-full max-w-sm">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-rose-400 font-mono">🚨 Friction Detected</span>
                    <span className="text-xs text-white/30">Heuristic #4</span>
                 </div>
                 <p className="text-sm">"Apply Coupon" accordion pushes the primary checkout button below the fold on 6.1" displays.</p>
              </div>
            </motion.div>

            {/* Bento Box 2: Tall */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/[0.05] p-10 flex flex-col justify-between hover:bg-white/[0.04] transition-colors"
            >
              <div>
                <BarChart3 className="w-10 h-10 text-violet-400 mb-6" />
                <h3 className="text-2xl font-semibold tracking-tight mb-4">Autonomous SQL Lab</h3>
                <p className="text-white/50">Our agents write and execute segmented BigQuery SQL to prove if a drop-off is UI-driven or API latency-driven.</p>
              </div>
              <div className="mt-8 font-mono text-xs text-violet-300/70 bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed">
                SELECT device_os, <br/>
                AVG(api_latency) as ms <br/>
                FROM telemetry <br/>
                WHERE step = 'checkout'
              </div>
            </motion.div>

            {/* Bento Box 3: Wide Bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="md:col-span-3 relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-white/[0.02] to-indigo-500/[0.02] border border-white/[0.05] p-10 flex flex-col md:flex-row items-center gap-12"
            >
              <div className="flex-1">
                <Code2 className="w-10 h-10 text-emerald-400 mb-6" />
                <h3 className="text-3xl font-semibold tracking-tight mb-4">Ready-to-Ship React Code</h3>
                <p className="text-white/50 text-lg">We don't just diagnose the problem. Gemini Code Gen outputs a RICE-prioritized PRD alongside the copy-paste React + Tailwind components to fix it.</p>
              </div>
              <div className="flex-1 w-full h-48 bg-[#0A0A0A] rounded-2xl border border-white/10 p-6 flex flex-col justify-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="relative font-mono text-sm text-emerald-400/80">
                  <span className="text-white/30">{'// Auto-generated fix'}</span><br/>
                  export default function ExpressCheckout() {'{'}<br/>
                  &nbsp;&nbsp;return (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{'<UpiIntentButton />'}<br/>
                  &nbsp;&nbsp;);<br/>
                  {'}'}
                </div>
              </div>
            </motion.div>

          </div>
        </section>
      </main>
    </div>
  );
}
