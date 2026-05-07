"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarWidgetProps {
  meetingDates: Date[];
}

export default function CalendarWidget({ meetingDates }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const hasMeeting = (day: number) =>
    meetingDates.some((date) => {
      const item = new Date(date);
      return (
        item.getDate() === day &&
        item.getMonth() === month &&
        item.getFullYear() === year
      );
    });

  return (
    <div className="card" style={{ padding: 18, marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <div>
          <p className="stat-label" style={{ marginBottom: 6 }}>
            Calendar
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              letterSpacing: "-0.04em",
            }}
          >
            {monthNames[month]} {year}
          </h3>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={prevMonth} className="btn btn-ghost btn-sm" type="button">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="btn btn-ghost btn-sm" type="button">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 6,
          marginBottom: 10,
        }}
      >
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 6,
        }}
      >
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const current = isToday(day);
          const meetingExists = hasMeeting(day);

          return (
            <div
              key={day}
              style={{
                minHeight: 38,
                borderRadius: 14,
                border: current
                  ? "1px solid var(--border-strong)"
                  : "1px solid transparent",
                background: current
                  ? "rgba(132, 240, 184, 0.12)"
                  : meetingExists
                    ? "rgba(255, 255, 255, 0.03)"
                    : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                color: current ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: 13,
                fontWeight: current || meetingExists ? 700 : 500,
              }}
            >
              {day}
              {meetingExists && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 6,
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "var(--accent-warm)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
