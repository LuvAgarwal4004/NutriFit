import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import connectDb from "@/db/connectDb";
import Review from "@/models/Review";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ============================================================
// GET — list reviews, newest first. Public, no auth required.
// If the viewer is logged in, their own reviews are flagged
// with isMine so the page can show a delete button.
// ============================================================

export async function GET() {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id ? String(session.user.id) : null;

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
      isMine:
        !!currentUserId &&
        !!review.userId &&
        String(review.userId) === currentUserId,
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
        isMine: true,
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

// ============================================================
// DELETE — remove a review. Requires login, and the review
// must belong to the logged-in user.
// ============================================================

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please log in to delete a review" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { id } = body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid review id" },
        { status: 400 }
      );
    }

    await connectDb();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    if (String(review.userId) !== String(session.user.id)) {
      return NextResponse.json(
        { error: "You can only delete your own review" },
        { status: 403 }
      );
    }

    await Review.deleteOne({ _id: review._id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 REVIEW DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Could not delete your review" },
      { status: 500 }
    );
  }
}