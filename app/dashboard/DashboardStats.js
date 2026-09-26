"use client";

import { useEffect, useState } from "react";

import {
  Activity,
  CalendarDays,
  Flame,
  TrendingUp,
  Trophy,
} from "lucide-react";

const LEVEL_COLORS = ["#edf2ef", "#c9e2d3", "#8fc7a8", "#4f9470", "#173d30"];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function DashboardStats() {
  const [data, setData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await fetch("/api/progress", {
          cache: "no-store",
        });

        const result = await response.json();

        if (response.ok && !cancelled) {
          setData(result);
        }
      } catch (error) {
        console.error("DASHBOARD STATS ERROR:", error);
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const streak = data?.streak?.current || 0;
  const weeklyActivity = data?.workout?.weeklyActivity || 0;
  const rank = data?.gamification?.rank || "Bronze";
  const xp = data?.gamification?.xp || 0;
  const dailyActivity = data?.analytics?.dailyActivity || [];

  const weeks = buildHeatmapWeeks(dailyActivity);
  const activeDays = dailyActivity.filter(
    (day) =>
      Math.max(day.workout?.completion || 0, day.nutrition?.completion || 0) >
      0
  ).length;

  return (
    <section className="mt-10">
      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Flame size={18} />}
          label="Current streak"
          value={`${streak} ${streak === 1 ? "day" : "days"}`}
          accent="#f59e0b"
        />

        <StatCard
          icon={<Activity size={18} />}
          label="Weekly activity"
          value={`${weeklyActivity}%`}
          accent="#397054"
        />

        <StatCard
          icon={<Trophy size={18} />}
          label="Rank"
          value={rank}
          accent="#5d9c7b"
        />

        <StatCard
          icon={<TrendingUp size={18} />}
          label="Points"
          value={`${xp} XP`}
          accent="#173d30"
        />
      </div>

      {/* CONSISTENCY HEATMAP */}
      <div className="mt-5 rounded-[2rem] border border-[#e1eae5] bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">
              <CalendarDays size={18} />
            </div>

            <div>
              <h3 className="font-bold text-[#24483a]">Your consistency</h3>
              <p className="text-xs text-[#8a9992]">
                {activeDays > 0
                  ? `Active ${activeDays} of the last ${dailyActivity.length} days`
                  : "Last 30 days"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#a2b0aa]">
            <span>Less</span>
            {LEVEL_COLORS.map((color, index) => (
              <span
                key={index}
                className="h-3 w-3 rounded-[4px]"
                style={{ backgroundColor: color }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {weeks.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-[#f7faf8] p-8 text-center">
            <p className="text-sm text-[#71817a]">
              Your consistency graph will show up here once you log a
              workout or meal.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
              <div className="flex shrink-0 flex-col justify-between py-px text-[9px] font-semibold text-[#a2b0aa]">
                {DAY_LABELS.map((label, index) => (
                  <span
                    key={index}
                    className="flex h-3.5 items-center leading-none"
                  >
                    {index % 2 === 1 ? label : ""}
                  </span>
                ))}
              </div>

              <div className="flex gap-[3px]">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {week.map((day, dayIndex) => {
                      if (!day) {
                        return (
                          <span
                            key={dayIndex}
                            className="h-3.5 w-3.5 rounded-[4px]"
                          />
                        );
                      }

                      const intensity = Math.max(
                        day.workout?.completion || 0,
                        day.nutrition?.completion || 0
                      );
                      const level = levelForCompletion(intensity);
                      const isSelected = selectedDay?.date === day.date;

                      return (
                        <button
                          key={dayIndex}
                          type="button"
                          onClick={() =>
                            setSelectedDay(isSelected ? null : day)
                          }
                          className={`h-3.5 w-3.5 rounded-[4px] transition-transform duration-150 hover:scale-125 ${
                            isSelected
                              ? "ring-2 ring-[#173d30] ring-offset-1"
                              : ""
                          }`}
                          style={{ backgroundColor: LEVEL_COLORS[level] }}
                          aria-label={`${day.date}: ${intensity}% activity`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 min-h-[20px] text-xs font-semibold text-[#397054]">
              {selectedDay ? (
                <span>
                  {formatHeatmapDate(selectedDay.date)} — Workout{" "}
                  {selectedDay.workout?.completion || 0}% · Nutrition{" "}
                  {selectedDay.nutrition?.completion || 0}%
                </span>
              ) : (
                <span className="font-medium text-[#a2b0aa]">
                  Tap a day to see workout and nutrition completion.
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// =========================================================
// HEATMAP HELPERS
// =========================================================

function buildHeatmapWeeks(days) {
  if (!days?.length) return [];

  const sorted = [...days].sort((a, b) => (a.date < b.date ? -1 : 1));
  const weeks = [];
  let currentWeek = new Array(7).fill(null);
  let hasFilledAny = false;

  sorted.forEach((day) => {
    const parsed = new Date(`${day.date}T00:00:00`);
    const dayOfWeek = parsed.getDay();
    currentWeek[dayOfWeek] = day;
    hasFilledAny = true;

    if (dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
      hasFilledAny = false;
    }
  });

  if (hasFilledAny) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function levelForCompletion(value) {
  if (!value || value <= 0) return 0;
  if (value < 25) return 1;
  if (value < 50) return 2;
  if (value < 75) return 3;
  return 4;
}

function formatHeatmapDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="group rounded-3xl border border-[#e1eae5] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${accent}1a`, color: accent }}
      >
        {icon}
      </div>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#8a9992]">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-[#173d30]">{value}</p>
    </div>
  );
}