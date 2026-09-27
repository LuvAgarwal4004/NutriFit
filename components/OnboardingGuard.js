"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

export default function OnboardingGuard({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "signup" or "required"
  
  const isProfileCompleted = session?.user?.profileCompleted;

  useEffect(() => {
    if (status !== "authenticated" || isProfileCompleted === undefined || isProfileCompleted) {
      setTimeout(() => setShowModal(false), 0);
      return;
    }

    const requiresOnboarding = pathname?.startsWith("/dashboard/") && pathname !== "/dashboard";

    if (requiresOnboarding) {
      setModalType("required");
      setTimeout(() => setShowModal(true), 0);
    } else if (pathname === "/dashboard") {
      const alreadyAsked = sessionStorage.getItem("onboardingPromptShown");
      if (!alreadyAsked) {
        setModalType("signup");
        setTimeout(() => setShowModal(true), 0);
      }
    } else {
      setTimeout(() => setShowModal(false), 0);
    }
  }, [pathname, status, isProfileCompleted]);

  const handleClose = () => {
    setShowModal(false);
    if (modalType === "signup") {
      sessionStorage.setItem("onboardingPromptShown", "true");
    } else {
      // If it was required, redirect back to dashboard since they can't view this page
      router.push("/dashboard");
    }
  };

  const handleComplete = () => {
    setShowModal(false);
    sessionStorage.setItem("onboardingPromptShown", "true");
    router.push("/onboarding");
  };

  // If a page requires onboarding and they haven't completed it, block rendering children
  const isBlocking = pathname?.startsWith("/dashboard/") && pathname !== "/dashboard" && !isProfileCompleted && status === "authenticated";

  return (
    <>
      {isBlocking ? (
        <div className="min-h-screen bg-[#f7faf8]"></div>
      ) : (
        children
      )}

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf6f0] text-[#397054]">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#173d30]">
                  {modalType === "required" ? "Action Required" : "Welcome!"}
                </h3>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-[#53665e] mb-6">
              {modalType === "required" 
                ? "u have to complete your onboarding for this...COMPLETE ONBOARDING?"
                : "Would you like to complete your onboarding process now to personalize your experience?"}
            </p>
            
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleClose}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
              >
                Skip for now
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 rounded-xl bg-[#173d30] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#245543]"
              >
                {modalType === "required" ? "Yes, complete" : "Complete Onboarding"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
