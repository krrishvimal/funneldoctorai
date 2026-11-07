import React from 'react';

interface RealisticPhoneMockupProps {
  selectedIssue?: string;
  viewMode?: 'flawed' | 'fixed';
  onToggleViewMode?: (mode: 'flawed' | 'fixed') => void;
  storeName?: string;
  children?: React.ReactNode;
}

export default function RealisticPhoneMockup({
  selectedIssue = '01',
  viewMode = 'flawed',
  onToggleViewMode,
  storeName = 'QuickStyle Store',
  children
}: RealisticPhoneMockupProps) {
  return (
    <div className="relative mx-auto w-full max-w-[340px] select-none">
      
      {/* 1. PHYSICAL HARDWARE BUTTONS (Titanium Chassis) */}
      {/* Volume Up / Down */}
      <div className="absolute -left-[9px] top-[115px] w-[3px] h-[26px] bg-neutral-600 rounded-l-xs shadow-inner" />
      <div className="absolute -left-[9px] top-[150px] w-[3px] h-[45px] bg-neutral-600 rounded-l-xs shadow-inner" />
      <div className="absolute -left-[9px] top-[205px] w-[3px] h-[45px] bg-neutral-600 rounded-l-xs shadow-inner" />
      {/* Power Button */}
      <div className="absolute -right-[9px] top-[140px] w-[3px] h-[65px] bg-neutral-600 rounded-r-xs shadow-inner" />

      {/* 2. CHASSIS OUTER BEZEL & TITANIUM DEPTH SHADOWS */}
      <div className="relative rounded-[50px] p-[10px] bg-gradient-to-b from-neutral-700 via-neutral-900 to-black shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset,0_20px_50px_-10px_rgba(0,0,0,0.35),0_10px_20px_-5px_rgba(0,0,0,0.2)]">
        
        {/* 3. INNER SCREEN GLASS FRAME */}
        <div className="relative w-full rounded-[40px] bg-white overflow-hidden border border-black/80 flex flex-col min-h-[640px] shadow-inner">
          
          {/* Subtle Diagonal Glass Glare Reflection */}
          <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />

          {/* 4. REALISTIC DYNAMIC ISLAND + STATUS BAR */}
          <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md pt-3 pb-2 px-6 flex items-center justify-between">
            <span className="font-semibold text-[11px] font-sans tracking-tight text-neutral-900">9:41</span>

            {/* Dynamic Island Pill */}
            <div className="w-[88px] h-[24px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-xs">
              {/* Sensor Lens */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a1a] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#1e1b4b] opacity-80" />
              </div>
              {/* Privacy Indicator Light */}
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Cellular, Wi-Fi & Battery Icons */}
            <div className="flex items-center gap-1.5 text-neutral-900">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/>
              </svg>
              <div className="w-5 h-2.5 border border-neutral-900 rounded-[3px] p-[1px] flex items-center">
                <div className="w-full h-full bg-neutral-900 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* 5. LIVE APP SCREEN CONTENTS */}
          {children ? (
            <div className="flex-1 flex flex-col justify-between font-sans">
              {children}
            </div>
          ) : (
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between font-sans">
              
              {/* Store Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neutral-900" />
                  <span className="text-xs font-semibold tracking-tight text-neutral-800">{storeName}</span>
                </div>
                <div className="flex gap-1 text-[10px] font-mono">
                  <button
                    onClick={() => onToggleViewMode?.('flawed')}
                    className={`px-2 py-0.5 rounded-full font-semibold transition cursor-pointer ${
                      viewMode === 'flawed'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-neutral-50 text-neutral-400'
                    }`}
                  >
                    ● Problem
                  </button>
                  <button
                    onClick={() => onToggleViewMode?.('fixed')}
                    className={`px-2 py-0.5 rounded-full font-semibold transition cursor-pointer ${
                      viewMode === 'fixed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-neutral-50 text-neutral-400'
                    }`}
                  >
                    The Fix
                  </button>
                </div>
              </div>

              {viewMode === 'flawed' ? (
                <>
                  {/* Product Card */}
                  <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-100 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-medium text-neutral-800">Oversized Cotton Tee</div>
                      <div className="text-[10px] text-neutral-400">Size: L · Qty: 1</div>
                    </div>
                    <div className="font-semibold text-neutral-900">₹1,850</div>
                  </div>

                  {/* Shipping Line */}
                  <div className="flex justify-between items-center px-1 text-xs">
                    <span className="text-neutral-500">Shipping</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>

                  {/* THE PINNED FRICTION ISSUE (Highlighted Card) */}
                  {selectedIssue === '01' && (
                    <div className="p-4 bg-white rounded-2xl border-2 border-rose-500/80 shadow-[0_8px_20px_-6px_rgba(225,29,72,0.15)] space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🔐</span>
                        <span className="font-semibold text-xs text-neutral-900">Sign In to Continue</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Enter the 6-digit OTP sent to your phone before completing checkout.
                      </p>
                      
                      {/* OTP Input Boxes */}
                      <div className="flex justify-between gap-1">
                        {['4', '9', '•', '•', '•', '•'].map((digit, idx) => (
                          <div
                            key={idx}
                            className={`w-9 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-semibold border ${
                              idx < 2 
                                ? 'border-neutral-900 bg-neutral-50 text-neutral-900' 
                                : 'border-neutral-200 bg-white text-neutral-300'
                            }`}
                          >
                            {digit}
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-medium text-xs shadow-xs">
                        Verify & Proceed
                      </button>
                    </div>
                  )}

                  {selectedIssue === '02' && (
                    <div className="p-4 bg-white rounded-2xl border-2 border-rose-500/80 shadow-[0_8px_20px_-6px_rgba(225,29,72,0.15)] space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">⚠️</span>
                        <span className="font-semibold text-xs text-neutral-900">Surprise Surcharge Added</span>
                      </div>
                      <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs font-mono flex justify-between items-center text-rose-800">
                        <span>Courier & Handling Fee:</span>
                        <span className="font-bold text-rose-700">+₹149</span>
                      </div>
                      <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-xs text-neutral-900">
                        <span>New Total:</span>
                        <span className="text-rose-700">₹1,999</span>
                      </div>
                    </div>
                  )}

                  {selectedIssue === '03' && (
                    <div className="p-3 bg-white rounded-2xl border-2 border-rose-500/80 shadow-[0_8px_20px_-6px_rgba(225,29,72,0.15)] space-y-2.5">
                      <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-center">
                        <span className="font-bold text-[11px] text-amber-900 block">🎉 15% FESTIVE DISCOUNT</span>
                        <p className="text-[10px] text-amber-700">Orders above ₹5,000</p>
                      </div>
                      <div className="border-t-2 border-dashed border-rose-400 my-1 relative text-center">
                        <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase relative -top-2.5">
                          ── 6.1" Fold Line ──
                        </span>
                      </div>
                      <div className="opacity-40 p-2 bg-neutral-100 rounded-lg text-center text-[11px] font-mono text-neutral-500">
                        [ Pay via UPI (Off-screen) ]
                      </div>
                    </div>
                  )}

                  {/* Pinned Audit Banner */}
                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-200/80 flex items-start gap-2">
                    <span className="text-xs">⚠️</span>
                    <p className="text-[10px] font-mono text-rose-700 leading-tight">
                      <strong>ISSUE #{selectedIssue}:</strong>{' '}
                      {selectedIssue === '01'
                        ? 'Forced login popup blocks guest buyers. 41.2% exit within 6 seconds.'
                        : selectedIssue === '02'
                        ? 'Surprise fee reveals at final screen, causing 31.4% rage clicks.'
                        : 'Payment CTA pushed below 6.1" fold. 64% never scroll down.'}
                    </p>
                  </div>
                </>
              ) : (
                /* THE FIX VIEW */
                <div className="space-y-3 py-1">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-semibold flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      Free Express Delivery
                    </span>
                    <span className="font-mono font-bold text-emerald-700 text-xs">₹0.00</span>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200 rounded-xl text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Deliver To (Guest)</span>
                      <span className="text-[10px] text-emerald-700 font-medium">Pre-filled ✓</span>
                    </div>
                    <div className="font-medium text-neutral-800 text-[11px]">Flat 402, Indiranagar, Bengaluru</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Instant 1-Tap UPI</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Google Pay', 'PhonePe', 'Paytm'].map((app, i) => (
                        <div key={i} className={`p-1.5 rounded-lg border text-center text-[10px] font-mono font-medium ${i === 0 ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'}`}>
                          {app}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono uppercase font-bold tracking-wider shadow-sm transition active:scale-[0.98]">
                    ⚡ 1-Tap Pay ₹1,850 · No Sign-in
                  </button>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-mono text-emerald-900 flex items-center justify-between">
                    <span className="font-bold">✓ FRICTION ELIMINATED:</span>
                    <span className="font-bold text-emerald-700">+38% CR Lift</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 6. HOME INDICATOR BAR */}
          <div className="w-full py-2 flex justify-center bg-white">
            <div className="w-32 h-1 bg-neutral-900 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
}
