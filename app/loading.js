"use client";

import { Dumbbell, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b2119] via-[#102f24] to-[#173d30]">

      {/* Ambient teal and mint glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#5d9c7b]/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#8ed6ae]/10 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5d9c7b]/10 blur-[90px]" />

      {/* Subtle decorative circles */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />

      {/* Main loader */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">

        {/* Icon assembly */}
        <div className="relative flex h-28 w-28 items-center justify-center">

          {/* Slow outer ring */}
          <div className="absolute inset-0 animate-spin rounded-full border border-[#8ed6ae]/15 border-t-[#8ed6ae] border-r-[#5d9c7b]/70" style={{ animationDuration: "3s" }} />

          {/* Inner ring */}
          <div className="absolute inset-[9px] rounded-full border border-white/[0.08]" />

          {/* Icon background */}
          <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[26px] border border-[#a9e8c2]/20 bg-gradient-to-br from-[#376c52]/80 to-[#173d30]/90 shadow-[0_0_45px_rgba(93,156,123,0.20)] backdrop-blur-xl">

            {/* Fixed-size centered icon */}
            <Dumbbell
              size={34}
              strokeWidth={1.8}
              className="block shrink-0 text-[#a9e8c2]"
              aria-hidden="true"
            />

          </div>

          {/* Small decorative sparkle */}
          <div className="absolute -right-1 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#a9e8c2]/20 bg-[#214c38] text-[#a9e8c2] shadow-lg">
            <Sparkles size={13} strokeWidth={1.8} />
          </div>

        </div>

        {/* Brand name */}
        <h2 className="mt-8 text-[30px] font-bold tracking-[-0.8px] text-white">
          Nutri<span className="text-[#8ed6ae]">Fit</span>
        </h2>

        {/* Brand tagline */}
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a9cbb7]">
          Train. Fuel. Level Up.
        </p>

        {/* Minimal loading indicator */}
        <div className="mt-8 h-[3px] w-36 overflow-hidden rounded-full bg-white/[0.08]">
          <div 
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#5d9c7b] via-[#a9e8c2] to-[#5d9c7b] animate-[loading_1.6s_ease-in-out_infinite]" style={{ transformOrigin: "left" }} />
        </div>

        {/* Loading message */}
        <p className="mt-4 text-xs font-medium tracking-wide text-[#a9cbb7]/80">
          Preparing your fitness journey
        </p>

      </div>

      {/* Local animation definition */}
      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%) scaleX(0.7);
          }
          50% {
            transform: translateX(100%) scaleX(1);
          }
          100% {
            transform: translateX(300%) scaleX(0.7);
          }
        }
      `}</style>

    </div>
  );
}