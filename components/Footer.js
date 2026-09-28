import { Instagram, Linkedin, Sparkles } from "lucide-react";

import SmartLink from "@/components/SmartLink";


// ============================================================
// FOOTER LINK STYLE (shared)
// ============================================================

const linkClass =
  "text-sm text-[#c1d6ca] transition-colors duration-300 hover:text-white";


// ============================================================
// FOOTER
// ============================================================

export default function Footer() {

  return (

    <footer className="relative overflow-hidden bg-[#173d30] text-white">

      {/* Background decoration */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#245543]/60 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-[#245543]/40 blur-3xl" />


      <div className="relative mx-auto max-w-7xl px-4 pt-12 sm:px-8 sm:pt-16">


        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-12 lg:gap-x-10">


          {/* -------------------------------------------------
              1. BRAND
          ------------------------------------------------- */}

          <div className="col-span-2 lg:col-span-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles size={19} />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                NutriFit
              </span>

            </div>

            <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#a8cbb7]">
              Train. Fuel. Level Up.
            </p>

            <p className="mt-3 max-w-sm text-sm leading-7 text-[#c1d6ca]">
              AI-powered fitness coaching and affordable protein, all in one
              place — so you can train smarter and fuel better without
              overspending.
            </p>

          </div>


          {/* -------------------------------------------------
              2. EXPLORE
          ------------------------------------------------- */}

          <div className="col-span-1 lg:col-span-3">

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9fc2ad]">
              Explore
            </h3>

            <ul className="mt-4 space-y-3 sm:mt-5">

              <li>
                <SmartLink href="/coach" className={linkClass}>
                  AI Coach
                </SmartLink>
              </li>

              <li>
                <SmartLink href="/market" className={linkClass}>
                  Protein Market
                </SmartLink>
              </li>

              <li>
                <SmartLink href="/game" className={linkClass}>
                  Challenge
                </SmartLink>
              </li>

              <li>
                <span className="text-sm font-medium text-[#c1d6ca]">
                  How It Works
                </span>

                <p className="mt-1 max-w-[15rem] text-xs leading-5 text-[#8fb09f]">
                  Tell us your goal, get an AI-built workout and nutrition
                  plan, track your progress, and earn streaks, XP and ranks
                  as you go.
                </p>
              </li>

            </ul>

          </div>


          {/* -------------------------------------------------
              3. SUPPORT
          ------------------------------------------------- */}

          <div className="col-span-1 lg:col-span-2">

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9fc2ad]">
              Support
            </h3>

            <ul className="mt-4 space-y-3 sm:mt-5">

              <li>
                {/* Change href if your FAQ page lives somewhere else */}
                <SmartLink href="/faqs" className={linkClass}>
                  FAQs
                </SmartLink>
              </li>

              <li>
                <SmartLink href="/contact" className={linkClass}>
                  Contact Us
                </SmartLink>
              </li>

              <li>
                <SmartLink href="/my-orders" className={linkClass}>
                  My Orders
                </SmartLink>
              </li>

            </ul>

          </div>


          {/* -------------------------------------------------
              4. CONNECT
          ------------------------------------------------- */}

          <div className="col-span-2 sm:col-span-1 lg:col-span-2">

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9fc2ad]">
              Connect
            </h3>

            <ul className="mt-4 space-y-3 sm:mt-5">

              <li>
                {/* TODO: replace "#" with your Instagram profile link */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 ${linkClass}`}
                >
                  <Instagram size={16} />
                  Instagram
                </a>
              </li>

              <li>
                {/* TODO: replace "#" with your LinkedIn profile link */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2.5 ${linkClass}`}
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </li>

            </ul>

          </div>

        </div>


        {/* =====================================================
            5. BOTTOM / TRUST BAR
        ===================================================== */}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 py-6 sm:mt-14 sm:py-8 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#a8cbb7] sm:gap-x-6">

            {/* Change these hrefs if your pages use different paths */}

            <SmartLink
              href="/privacy-policy"
              className="transition-colors duration-300 hover:text-white"
            >
              Privacy Policy
            </SmartLink>

            <SmartLink
              href="/terms"
              className="transition-colors duration-300 hover:text-white"
            >
              Terms & Conditions
            </SmartLink>

            <SmartLink
              href="/disclaimer"
              className="transition-colors duration-300 hover:text-white"
            >
              Disclaimer
            </SmartLink>

          </div>

          <p className="text-xs text-[#8fb09f]">
            © {new Date().getFullYear()} NutriFit
          </p>

        </div>

      </div>

    </footer>

  );

}