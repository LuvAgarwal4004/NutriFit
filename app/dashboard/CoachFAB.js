"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function CoachFAB() {
  return (
    <Link
      href="/dashboard/coach"
      className="group fixed bottom-6 right-5 z-40 flex items-center gap-3 rounded-full bg-[#173d30] py-3.5 pl-4 pr-5 text-white shadow-xl shadow-[#173d30]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#245543] hover:shadow-2xl sm:bottom-8 sm:right-8"
      aria-label="Chat with your AI fitness coach"
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/20" />
        <Sparkles size={17} className="relative" />
      </span>

      <span className="hidden text-sm font-bold sm:block">
        Ask NutriFit AI
      </span>
    </Link>
  );
}