import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  ChevronRight,
  Dumbbell,
  Play,
  Sparkles,
  TrendingUp,
  Utensils,
} from "lucide-react";

import DashboardStats from "./DashboardStats";
import CoachFAB from "./CoachFAB";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";

import FitnessProfile from "@/models/FitnessProfile";
import WorkoutLog from "@/models/WorkoutLog";
import NutritionLog from "@/models/NutritionLog";


// ============================================================
// DASHBOARD
// ============================================================

export default async function DashboardPage() {

  // ============================================================
  // 1. AUTHENTICATION
  // ============================================================

  const session =
    await getServerSession(authOptions);


  if (!session?.user?.id) {
    redirect("/login");
  }


  // ============================================================
  // 2. DATABASE
  // ============================================================

  await connectDB();


  // ============================================================
  // 3. FITNESS PROFILE
  // ============================================================

  const profile =
    await FitnessProfile.findOne({
      userId: session.user.id,
    }).lean();


  if (!profile || !profile.completed) {
    redirect("/onboarding");
  }


  // ============================================================
  // 4. LOAD TRACKING HISTORY
  // ============================================================

  const workoutLogs =
    await WorkoutLog.find({
      userId: session.user.id,
    })
      .sort({ date: -1 })
      .lean();


  const nutritionLogs =
    await NutritionLog.find({
      userId: session.user.id,
    })
      .sort({ date: -1 })
      .lean();


  // ============================================================
  // 5. CALCULATE DASHBOARD STATS
  // ============================================================

  const stats = calculateDashboardStats({
    workoutLogs,
    nutritionLogs,
    workoutDaysPerWeek:
      profile.workoutDays || 0,
  });


  // ============================================================
  // 6. USER
  // ============================================================

  const user = session.user;

  const firstName =
    user?.name?.split(" ")[0] || "there";


  // ============================================================
  // 7. RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-[#f7faf8] text-[#17231e]">
      <div
        className="group relative mx-auto w-[88%] max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4169e1] to-[#1e3a8a] shadow-2xl shadow-blue-500/30 ring-1 ring-black/5 max-h-[220px]
      sm:max-h-[320px]
      md:max-h-[420px]
      lg:max-h-[520px]"
        style={{ aspectRatio: heroRatio }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === index ?
              "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={src}
              alt={`Featured collection ${i + 1}`}
              fill
              priority={i === 0}
              quality={75}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
              onLoad={i === 0 ? handleHeroImageLoad : undefined}
            />
          </div>
        ))}

        {/* gradient overlay for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

        {/* arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white/30 group-hover:opacity-100 sm:left-6 sm:h-12 sm:w-12"
        >
          ❮
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white/30 group-hover:opacity-100 sm:right-6 sm:h-12 sm:w-12"
        >
          ❯
        </button>

        {/* dots */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                }`}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">


        {/* =====================================================
            GREETING + PLAN SHORTCUTS
        ===================================================== */}

        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
              Your dashboard
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#173d30] sm:text-5xl">
              Good to see you, {firstName}.
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-[#71817a]">
              Your fitness journey starts here. Train, fuel your body,
              track your progress and keep building momentum.
            </p>

          </div>

          <div className="flex flex-shrink-0 flex-wrap gap-3">

            <Link
              href="/dashboard/workout"
              className="group inline-flex items-center gap-2.5 rounded-full border border-[#d8e5de] bg-white px-5 py-3 text-sm font-bold text-[#245543] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#173d30] hover:shadow-md"
            >
              <Dumbbell size={16} />
              View Workout Plan
              <ChevronRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/dashboard/nutrition"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#173d30] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#173d30]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#245543]"
            >
              <Utensils size={16} />
              View Nutrition Plan
              <ChevronRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>

          </div>

        </section>


        {/* =====================================================
            STATS + CONSISTENCY GRAPH
        ===================================================== */}

        <DashboardStats />


        {/* =====================================================
            TODAY — HERO CARD
        ===================================================== */}

        <section className="mt-6">

          <Link
            href="/dashboard/today"
            className="group relative block overflow-hidden rounded-[2.5rem] border border-[#e1eae5] bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:p-10"
          >

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#dceee3] opacity-60 blur-3xl transition-transform duration-700 group-hover:scale-110" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-xl">

                <div className="inline-flex items-center gap-2 rounded-full bg-[#edf6f0] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#397054]">
                  <span
                    className={`h-2 w-2 rounded-full ${stats.workoutCompletedToday
                        ? "bg-[#397054]"
                        : "animate-pulse bg-[#f59e0b]"
                      }`}
                  />
                  {stats.workoutCompletedToday
                    ? "Completed"
                    : "Ready for you"}
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#173d30] sm:text-3xl">
                  {stats.workoutCompletedToday
                    ? "Nice work — today's workout is done."
                    : "Today's workout is ready."}
                </h2>

                <p className="mt-3 leading-7 text-[#71817a]">
                  {stats.workoutCompletedToday
                    ? "Your progress has been logged. Come back tomorrow to keep the streak alive."
                    : "Jump in and complete today's exercises, one step at a time."}
                </p>

                <span className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#173d30] px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 group-hover:gap-4 group-hover:bg-[#245543]">
                  {stats.workoutCompletedToday ? (
                    <>
                      View today's activity
                      <ChevronRight size={16} />
                    </>
                  ) : (
                    <>
                      <Play size={15} fill="currentColor" />
                      Start today's workout
                    </>
                  )}
                </span>

              </div>

              <div className="flex shrink-0 items-center justify-center">
                <ProgressRing
                  percent={
                    stats.workoutCompletedToday ? 100 : stats.weeklyActivity
                  }
                  label={
                    stats.workoutCompletedToday
                      ? "Done"
                      : `${stats.weeklyActivity}%`
                  }
                  sublabel="this week"
                />
              </div>

            </div>

          </Link>

        </section>


        {/* =====================================================
            AI COACH FEATURE
        ===================================================== */}

        <section className="mt-6 overflow-hidden rounded-[2rem] bg-[#173d30] text-white">

          <div className="grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:p-12">

            <div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles size={23} />
              </div>

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-[#a8cbb7]">
                NutriFit AI
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Your fitness journey,
                <br />
                powered by AI.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-[#c1d6ca]">
                Tell NutriFit what you're trying to achieve and we'll use
                the information you provide to help create a more
                personalized fitness experience.
              </p>

              <Link
                href="/dashboard/coach"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#173d30] transition hover:-translate-y-0.5 hover:bg-[#edf6f0]"
              >
                Talk to my AI coach
                <ChevronRight size={17} />
              </Link>

            </div>


            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">

              <p className="text-xs font-bold uppercase tracking-wider text-[#9fc2ad]">
                Your AI workspace
              </p>

              <div className="mt-5 space-y-3">

                {[
                  [
                    "Goal",
                    formatProfileValue(profile.primaryGoal),
                  ],

                  [
                    "Experience",
                    formatProfileValue(profile.experienceLevel),
                  ],

                  [
                    "Workout frequency",
                    `${profile.workoutDays || 0} days/week`,
                  ],

                  [
                    "Equipment",
                    profile.equipment?.length
                      ? profile.equipment.join(", ")
                      : "No equipment",
                  ],

                ].map(([label, value]) => (

                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4"
                  >

                    <span className="text-sm text-[#c7d9cf]">
                      {label}
                    </span>

                    <span className="text-sm font-semibold text-[#a8cbb7]">
                      {value}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            QUICK LINKS
        ===================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2">

          <QuickLinkCard
            href="/dashboard/insights"
            icon={<Sparkles size={20} />}
            title="AI Insights"
            description="See patterns in your training and nutrition."
          />

          <QuickLinkCard
            href="/dashboard/progress"
            icon={<TrendingUp size={20} />}
            title="My Progress"
            description="Streaks, XP and your full fitness history."
          />

        </section>

      </div>

      <CoachFAB />

    </main>
  );
}



// ============================================================
// PROGRESS RING
// ============================================================

function ProgressRing({ percent, label, sublabel }) {

  const clamped =
    Math.min(100, Math.max(0, percent || 0));

  const radius = 50;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (clamped / 100) * circumference;

  return (

    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">

      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e1eee7"
          strokeWidth="10"
        />

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#173d30"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />

      </svg>

      <div className="absolute flex flex-col items-center">

        <span className="text-xl font-bold text-[#173d30]">
          {label}
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8a9992]">
          {sublabel}
        </span>

      </div>

    </div>

  );

}



// ============================================================
// QUICK LINK CARD
// ============================================================

function QuickLinkCard({ href, icon, title, description }) {

  return (

    <Link
      href={href}
      className="group flex items-center gap-4 rounded-3xl border border-[#e1eae5] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c5ddd0] hover:shadow-md"
    >

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <div className="flex-1">
        <p className="font-bold text-[#24483a]">{title}</p>
        <p className="mt-0.5 text-xs text-[#82918a]">{description}</p>
      </div>

      <ChevronRight
        size={16}
        className="text-[#b6c4bd] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#397054]"
      />

    </Link>

  );

}



// ============================================================
// DASHBOARD STAT CALCULATOR
// ============================================================

function calculateDashboardStats({
  workoutLogs,
  nutritionLogs,
  workoutDaysPerWeek,
}) {

  // ==========================================================
  // TODAY
  // ==========================================================

  const today =
    getDateString(new Date());


  // ==========================================================
  // WORKOUTS COMPLETED
  // ==========================================================

  const completedWorkoutLogs =
    workoutLogs.filter(
      (log) =>
        log.status === "completed"
    );


  // ==========================================================
  // NUTRITION ACTIVITY
  // ==========================================================

  const nutritionActivity =
    nutritionLogs.filter(
      (log) =>
        Array.isArray(log.meals) &&
        log.meals.some(
          (meal) => meal.completed
        )
    );


  // ==========================================================
  // CURRENT STREAK
  // ==========================================================

  /*
    A day counts toward the streak if the user:

    1. completed a workout
       OR
    2. completed at least one nutrition item

    This means the streak represents overall consistency,
    not only gym sessions.
  */

  const activityDates =
    new Set();


  completedWorkoutLogs.forEach(
    (log) => {
      if (log.date) {
        activityDates.add(log.date);
      }
    }
  );


  nutritionActivity.forEach(
    (log) => {
      if (log.date) {
        activityDates.add(log.date);
      }
    }
  );


  const currentStreak =
    calculateCurrentStreak(
      activityDates,
      today
    );


  // ==========================================================
  // WEEKLY ACTIVITY
  // ==========================================================

  const lastSevenDays =
    getLastSevenDates(today);


  const workoutDatesThisWeek =
    new Set(
      completedWorkoutLogs
        .filter(
          (log) =>
            lastSevenDays.includes(log.date)
        )
        .map(
          (log) => log.date
        )
    );


  const workoutsCompletedThisWeek =
    workoutDatesThisWeek.size;


  /*
    Example:

    User requested 4 workouts/week.

    Completed 2 workouts:

    2 / 4 = 50%

    We cap this at 100%.
  */

  let weeklyActivity = 0;


  if (workoutDaysPerWeek > 0) {

    weeklyActivity =
      Math.round(
        Math.min(
          workoutsCompletedThisWeek /
          workoutDaysPerWeek *
          100,
          100
        )
      );

  }


  // ==========================================================
  // XP
  // ==========================================================

  let xp = 0;


  // ----------------------------------------------------------
  // COMPLETED EXERCISES
  // ----------------------------------------------------------

  workoutLogs.forEach(
    (log) => {

      if (!Array.isArray(log.exercises)) {
        return;
      }

      log.exercises.forEach(
        (exercise) => {

          if (exercise.completed) {
            xp += 10;
          }

        }
      );

    }
  );


  // ----------------------------------------------------------
  // COMPLETED MEALS
  // ----------------------------------------------------------

  nutritionLogs.forEach(
    (log) => {

      if (!Array.isArray(log.meals)) {
        return;
      }

      log.meals.forEach(
        (meal) => {

          if (meal.completed) {
            xp += 5;
          }

        }
      );

    }
  );


  // ----------------------------------------------------------
  // WORKOUT COMPLETION BONUS
  // ----------------------------------------------------------

  completedWorkoutLogs.forEach(
    () => {
      xp += 25;
    }
  );


  // ----------------------------------------------------------
  // FULL NUTRITION DAY BONUS
  // ----------------------------------------------------------

  nutritionLogs.forEach(
    (log) => {

      if (!Array.isArray(log.meals)) {
        return;
      }

      if (
        log.meals.length > 0 &&
        log.meals.every(
          (meal) => meal.completed
        )
      ) {
        xp += 25;
      }

    }
  );


  // ==========================================================
  // RANK
  // ==========================================================

  const rankInfo =
    calculateRank(xp);


  // ==========================================================
  // TODAY'S WORKOUT
  // ==========================================================

  const todayWorkout =
    workoutLogs.find(
      (log) =>
        log.date === today
    );


  const workoutCompletedToday =
    todayWorkout?.status ===
    "completed";


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    currentStreak,

    weeklyActivity,

    workoutsCompletedThisWeek,

    xp,

    rank:
      rankInfo.rank,

    pointsToNextRank:
      rankInfo.pointsToNextRank,

    workoutCompletedToday,

  };

}



// ============================================================
// STREAK CALCULATOR
// ============================================================

function calculateCurrentStreak(
  activityDates,
  today
) {

  let streak = 0;


  let cursor =
    parseDateString(today);


  /*
    If today has no activity yet, allow the streak
    to continue from yesterday.

    Example:

    Mon = activity
    Tue = activity
    Wed = no activity

    On Wednesday the user still has a 2-day streak.
  */

  if (
    !activityDates.has(today)
  ) {

    cursor.setDate(
      cursor.getDate() - 1
    );

  }


  while (true) {

    const date =
      formatDate(cursor);


    if (
      !activityDates.has(date)
    ) {
      break;
    }


    streak++;


    cursor.setDate(
      cursor.getDate() - 1
    );

  }


  return streak;

}



// ============================================================
// LAST 7 DAYS
// ============================================================

function getLastSevenDates(today) {

  const dates = [];

  const cursor =
    parseDateString(today);


  for (
    let i = 0;
    i < 7;
    i++
  ) {

    dates.push(
      formatDate(cursor)
    );


    cursor.setDate(
      cursor.getDate() - 1
    );

  }


  return dates;

}



// ============================================================
// RANK SYSTEM
// ============================================================

function calculateRank(xp) {

  if (xp >= 5000) {

    return {
      rank: "Diamond",
      pointsToNextRank: 0,
    };

  }


  if (xp >= 2500) {

    return {
      rank: "Platinum",
      pointsToNextRank: 5000 - xp,
    };

  }


  if (xp >= 1000) {

    return {
      rank: "Gold",
      pointsToNextRank: 2500 - xp,
    };

  }


  if (xp >= 500) {

    return {
      rank: "Silver",
      pointsToNextRank: 1000 - xp,
    };

  }


  return {
    rank: "Bronze",
    pointsToNextRank: 500 - xp,
  };

}



// ============================================================
// DATE HELPERS
// ============================================================

function getDateString(date) {

  return date
    .toISOString()
    .split("T")[0];

}


function parseDateString(dateString) {

  const [
    year,
    month,
    day,
  ] = dateString
    .split("-")
    .map(Number);


  return new Date(
    year,
    month - 1,
    day
  );

}


function formatDate(date) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      date.getDate()
    ).padStart(2, "0");


  return `${year}-${month}-${day}`;

}



// ============================================================
// PROFILE FORMATTER
// ============================================================

function formatProfileValue(value) {

  if (!value) {
    return "Not specified";
  }


  return String(value)
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );

}