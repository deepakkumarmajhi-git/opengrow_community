"use client";

import { useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";

type AvailabilityOption = {
  startsAt: string | Date;
  votes: string[];
};

export default function AvailabilityVoting({
  meetingId,
  options,
  currentUserId,
}: {
  meetingId: string;
  options: AvailabilityOption[];
  currentUserId: string;
}) {
  const [items, setItems] = useState(options);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  if (!items.length) return null;

  const vote = async (index: number) => {
    setLoadingIndex(index);
    try {
      const response = await fetch(`/api/meetings/${meetingId}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: index }),
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.availabilityOptions || items);
      }
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="card" style={{ padding: 14, marginTop: 12 }}>
      <p className="stat-label" style={{ marginBottom: 10 }}>
        Availability vote
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((option, index) => {
          const votes = option.votes.map(String);
          const selected = votes.includes(currentUserId);

          return (
            <button
              key={`${option.startsAt}-${index}`}
              type="button"
              onClick={() => vote(index)}
              disabled={loadingIndex === index}
              className={selected ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
              style={{ justifyContent: "space-between", width: "100%" }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {loadingIndex === index ? <Loader2 size={14} className="animate-spin" /> : <CalendarCheck size={14} />}
                {new Date(option.startsAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>{votes.length}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
