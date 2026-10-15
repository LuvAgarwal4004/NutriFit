import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Review from "@/models/Review";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ============================================================
// GET — list reviews, newest first. Public, no auth required.
// ============================================================

export async function GET() {
  try {
    await connectDb();

    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formatted = reviews.map((review) => ({
      _id: review._id.toString(),
      name: review.name || "",
      rating: review.rating,
      text: review.text,
      // usedProduct is stored under its own name, but the review page
      // reads it as "usedFor" — this is where the two meet.
      usedFor: review.usedProduct || undefined,
    }));

    return NextResponse.json({ reviews: formatted });
  } catch (error) {
    console.error("🔥 REVIEWS FETCH ERROR:", error);
    return NextResponse.json({ reviews: [] }, { status: 500 });
  }
}

// ============================================================
// POST — submit a review. Requires login.
// ============================================================

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please log in to submit a review" },
        { status: 401 }
      );
    }

    await connectDb();

    const body = await req.json();
    const { rating, name, usedProduct, text } = body;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please select a rating between 1 and 5" },
        { status: 400 }
      );
    }

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Please write a review" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      userId: session.user.id,
      // Falls back to their account name if they leave the field blank
      name: (name && name.trim()) || session.user.name || "",
      rating,
      usedProduct: usedProduct || "",
      text: text.trim(),
    });

    return NextResponse.json({
      review: {
        _id: review._id.toString(),
        name: review.name || "",
        rating: review.rating,
        text: review.text,
        usedFor: review.usedProduct || undefined,
      },
    });
  } catch (error) {
    console.error("🔥 REVIEW SUBMIT ERROR:", error);
    return NextResponse.json(
      { error: "Could not submit your review" },
      { status: 500 }
    );
  }
}