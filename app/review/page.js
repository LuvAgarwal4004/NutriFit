"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  Star,
} from "lucide-react";
import Image from "next/image";

const DRAFT_KEY = "nutrifit_review_draft";

// Fill these in with your two real before/after stories.
// The photo slots are intentionally left empty — see SuccessCard below
// for exactly where to drop in <Image> / <img> tags.
const SUCCESS_STORIES = [
  {
    id: 1,
    name: "Rahul",
    subtitle: "Lost 8 kg in 3 months",
    rating: 5,
    image:"/rahul.jpg",
    quote: "Add this person's quote here.",
  },
  {
    id: 2,
    name: "Sakshi",
    subtitle: "Built 5 kg of lean muscle",
    rating: 5,
    image:"/Sakshi.jpg",
    quote: "Add this person's quote here.",
  },
];

const USE_OPTIONS = [
  "AI Workout Plan",
  "AI Nutrition Plan",
  "AI Coach Chat",
  "Protein & Snacks",
  "Equipment",
  "Something else",
];

export default function ReviewPage() {
  const { status } = useSession();
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [usedProduct, setUsedProduct] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ============================================================
  // LOAD REVIEWS — public, no auth needed
  // ============================================================

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoadingReviews(true);

      const res = await fetch("/api/reviews");
      const data = await res.json();

      if (res.ok) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  }

  // ============================================================
  // RESTORE A DRAFT LEFT BEHIND BY A LOGIN REDIRECT
  // ============================================================

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (!saved) return;

      const draft = JSON.parse(saved);
      setRating(draft.rating || 0);
      setName(draft.name || "");
      setUsedProduct(draft.usedProduct || "");
      setText(draft.text || "");

      sessionStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      // no draft, or it was malformed — nothing to restore
    }
  }, []);

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "loading") {
      return;
    }

    // Not logged in — save what they've written so it isn't lost,
    // then send them to log in and come straight back here.
    if (status !== "authenticated") {
      try {
        sessionStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ rating, name, usedProduct, text })
        );
      } catch (error) {
        // sessionStorage unavailable — not fatal, just means no draft restore
      }

      router.push(`/login?callbackUrl=${encodeURIComponent("/review")}`);
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!text.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          name: name.trim(),
          usedProduct,
          text: text.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not submit your review");
      }

      toast.success("Thanks for your review!");

      setReviews((prev) => [data.review, ...prev]);
      setRating(0);
      setName("");
      setUsedProduct("");
      setText("");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-white text-[#17231e]">

      {/* ============================================================
          SEE HOW NUTRIFIT MAKES A DIFFERENCE
      ============================================================ */}

      <section className="bg-[#eef6f1] px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center lg:gap-14">

          {/* Left copy */}
          <div>
            <span className="inline-flex items-center rounded-full bg-[#dceee3] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#397054]">
              Real people, real results
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#173d30] sm:text-4xl">
              See How NutriFit Makes a Difference
            </h2>

            <p className="mt-4 max-w-md leading-7 text-[#5f7268]">
              With personalized AI coaching, customized nutrition plans and
              affordable products, our users are achieving their health and
              fitness goals — and loving the journey!
            </p>
          </div>

          {/* Right: before/after cards */}
          <div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {SUCCESS_STORIES.map((story) => (
                <SuccessCard key={story.id} story={story} />
              ))}
            </div>

            {/* Carousel chrome — decorative to match the design;
                with only two fixed stories there's nothing to page through */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#a8bab0] shadow-sm ring-1 ring-[#dce8e1]">
                <ChevronLeft size={16} />
              </span>

              <div className="flex items-center gap-1.5">
                {SUCCESS_STORIES.map((story, i) => (
                  <span
                    key={story.id}
                    className={`h-2 rounded-full ${
                      i === 0 ? "w-5 bg-[#397054]" : "w-2 bg-[#c9ddd1]"
                    }`}
                  />
                ))}
              </div>

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#a8bab0] shadow-sm ring-1 ring-[#dce8e1]">
                <ChevronRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT OUR COMMUNITY SAYS
      ============================================================ */}

      <section className="px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">

          <span className="inline-flex items-center rounded-full bg-[#edf6f0] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#397054]">
            User reviews
          </span>

          <h2 className="mt-4 text-3xl font-bold text-[#173d30] sm:text-4xl">
            What Our Community Says
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-[#5f7268]">
            Real feedback from real people who are building healthier,
            happier lives with NutriFit.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">

            {/* Review list — visible to everyone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {loadingReviews ? (
                <p className="text-sm text-[#8a9992] sm:col-span-2">
                  Loading reviews...
                </p>
              ) : reviews.length === 0 ? (
                <div className="rounded-3xl border border-[#e1eae5] bg-[#f7faf8] p-6 text-center sm:col-span-2">
                  <p className="text-sm text-[#71817a]">
                    No reviews yet — be the first to share your experience.
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))
              )}
            </div>

            {/* Share experience form — submitting requires login */}
            <div className="rounded-3xl border border-[#dfe9e3] bg-[#f3faf6] p-6 sm:p-7">

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#397054] text-white">
                  <MessageSquare size={18} />
                </span>
                <h3 className="text-lg font-bold text-[#173d30]">
                  Share Your Experience
                </h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#5f7268]">
                Your feedback helps us improve and helps others make better
                choices. Tell us what you think!
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">

                <div>
                  <p className="text-sm font-semibold text-[#315047]">
                    Your Rating
                  </p>

                  <div className="mt-2 flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = (hoverRating || rating) >= star;

                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            size={24}
                            className={
                              filled
                                ? "fill-[#f5b400] text-[#f5b400]"
                                : "fill-transparent text-[#c9d6cf]"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (optional)"
                  className="w-full rounded-2xl border border-[#dfe9e3] bg-white px-4 py-3 text-sm text-[#17231e] outline-none transition focus:border-[#397054] focus:ring-2 focus:ring-[#397054]/20"
                />

                <select
                  value={usedProduct}
                  onChange={(e) => setUsedProduct(e.target.value)}
                  className="w-full rounded-2xl border border-[#dfe9e3] bg-white px-4 py-3 text-sm text-[#17231e] outline-none transition focus:border-[#397054] focus:ring-2 focus:ring-[#397054]/20"
                >
                  <option value="">What did you use? (optional)</option>
                  {USE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write your review..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-[#dfe9e3] bg-white px-4 py-3 text-sm text-[#17231e] outline-none transition focus:border-[#397054] focus:ring-2 focus:ring-[#397054]/20"
                />

                <button
                  type="submit"
                  disabled={submitting || status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#173d30] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#245543] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} />
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

// ================================================================
// SUCCESS CARD (before / after)
// ================================================================

function SuccessCard({ story }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e1eae5] bg-white shadow-sm">
      
      <div className="grid">        
        <div className="relative aspect-[3/4] bg-[#e7ede9]">  
         <Image src={story.image} fill className="object-cover" />
        </div>
      </div>

      <div className="p-4">
        <p className="font-bold text-[#173d30]">{story.name}</p>
        <p className="mt-0.5 text-xs text-[#71817a]">{story.subtitle}</p>

        <div className="mt-2 flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= story.rating
                  ? "fill-[#f5b400] text-[#f5b400]"
                  : "fill-transparent text-[#dbe6e0]"
              }
            />
          ))}
        </div>

        <p className="mt-2.5 text-sm leading-6 text-[#52665d]">
          "{story.quote}"
        </p>
      </div>

    </div>
  );
}

// ================================================================
// REVIEW CARD
// ================================================================

function ReviewCard({ review }) {
  const initial = review.name?.[0]?.toUpperCase() || "?";

  return (
    <div className="rounded-3xl border border-[#e1eae5] bg-[#f7faf8] p-5">

      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dceee3] font-bold text-[#397054]">
          {initial}
        </span>

        <div>
          <p className="font-bold text-[#24483a]">
            {review.name || "Anonymous"}
          </p>

          <div className="mt-0.5 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={13}
                className={
                  star <= (review.rating || 0)
                    ? "fill-[#f5b400] text-[#f5b400]"
                    : "fill-transparent text-[#dbe6e0]"
                }
              />
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-[#52665d]">
        "{review.text}"
      </p>

      {review.usedFor && (
        <p className="mt-3 text-xs text-[#8a9992]">{review.usedFor}</p>
      )}

    </div>
  );
}