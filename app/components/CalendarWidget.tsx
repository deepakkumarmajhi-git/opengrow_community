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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const hasMeeting = (day: number) => {
    return meetingDates.some((d) => {
      const date = new Date(d);
      return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
    });
  };

  return (
    <div className="card" style={{ padding: 16, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600 }}>
          {monthNames[month]} {year}
        </h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={prevMonth} className="btn btn-ghost" style={{ padding: 4 }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="btn btn-ghost" style={{ padding: 4 }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center", marginBottom: 8 }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)" }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const meetingExists = hasMeeting(day);
          const current = isToday(day);

          return (
            <div
              key={day}
              style={{
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                borderRadius: "var(--radius-sm)",
                background: current ? "var(--bg-tertiary)" : "transparent",
                color: current ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: current || meetingExists ? 600 : 400,
                border: current ? "1px solid var(--border-secondary)" : "1px solid transparent",
                position: "relative",
              }}
            >
              {day}
              {meetingExists && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 2,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--accent)",
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
