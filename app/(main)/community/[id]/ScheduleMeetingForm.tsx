"use client";

import { useState } from "react";
import { Calendar, Clock, Layers3, MessageSquare, Plus, Repeat2, X } from "lucide-react";

const templates = [
  { value: "custom", label: "Custom" },
  { value: "mock-interview", label: "Mock Interview" },
  { value: "debate", label: "Debate" },
  { value: "group-discussion", label: "Group Discussion" },
  { value: "english-speaking", label: "English Speaking Practice" },
  { value: "product-pitch", label: "Product Pitch" },
  { value: "leadership-circle", label: "Leadership Circle" },
];

export default function ScheduleMeetingForm({
  communityId,
}: {
  communityId: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId,
          title: form.get("title"),
          topic: form.get("topic"),
          scheduledAt: form.get("scheduledAt"),
          durationMinutes: Number(form.get("durationMinutes")) || 30,
          template: form.get("template"),
          timezone: form.get("timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone,
          recurrence: form.get("recurrence"),
          recurrenceCount: Number(form.get("recurrenceCount")) || 1,
          reminderMinutes: [Number(form.get("reminderOne")) || 60, Number(form.get("reminderTwo")) || 10],
          availabilityOptions: ["availabilityOne", "availabilityTwo", "availabilityThree"]
            .map((key) => form.get(key)?.toString())
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        setShowForm(false);
        window.location.reload();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <button type="button" onClick={() => setShowForm(true)} className="btn btn-primary">
        <Plus size={16} />
        Schedule a session
      </button>
    );
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <p className="stat-label" style={{ marginBottom: 8 }}>
            Host Tools
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              letterSpacing: "-0.05em",
            }}
          >
            Configure a new live session
          </h3>
        </div>
        <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost btn-sm">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label className="label">Session Title</label>
          <input
            name="title"
            className="input"
            placeholder="Weekly communication practice"
            required
          />
        </div>

        <div>
          <label className="label">Discussion Topic</label>
          <div style={{ position: "relative" }}>
            <MessageSquare
              size={16}
              style={{
                position: "absolute",
                top: 18,
                left: 14,
                color: "var(--text-muted)",
              }}
            />
            <input
              name="topic"
              className="input"
              placeholder="What should everyone prepare to talk about?"
              style={{ paddingLeft: 40 }}
              required
            />
          </div>
        </div>

        <div
          className="schedule-fields-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <div>
            <label className="label">Session Template</label>
            <div style={{ position: "relative" }}>
              <Layers3
                size={16}
                style={{
                  position: "absolute",
                  top: 18,
                  left: 14,
                  color: "var(--text-muted)",
                }}
              />
              <select name="template" className="input" defaultValue="english-speaking" style={{ paddingLeft: 40 }}>
                {templates.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Start Time</label>
            <div style={{ position: "relative" }}>
              <Calendar
                size={16}
                style={{
                  position: "absolute",
                  top: 18,
                  left: 14,
                  color: "var(--text-muted)",
                }}
              />
              <input
                name="scheduledAt"
                type="datetime-local"
                className="input"
                required
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>
          <div>
            <label className="label">Duration</label>
            <div style={{ position: "relative" }}>
              <Clock
                size={16}
                style={{
                  position: "absolute",
                  top: 18,
                  left: 14,
                  color: "var(--text-muted)",
                }}
              />
              <select
                name="durationMinutes"
                className="input"
                defaultValue="30"
                style={{ paddingLeft: 40 }}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Timezone</label>
            <input
              name="timezone"
              className="input"
              defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
              placeholder="Asia/Calcutta"
            />
          </div>

          <div>
            <label className="label">Repeat</label>
            <div style={{ position: "relative" }}>
              <Repeat2
                size={16}
                style={{
                  position: "absolute",
                  top: 18,
                  left: 14,
                  color: "var(--text-muted)",
                }}
              />
              <select name="recurrence" className="input" defaultValue="none" style={{ paddingLeft: 40 }}>
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Occurrences</label>
            <input name="recurrenceCount" type="number" min={1} max={12} defaultValue={1} className="input" />
          </div>

          <div>
            <label className="label">Reminder Minutes</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input name="reminderOne" type="number" min={0} defaultValue={60} className="input" />
              <input name="reminderTwo" type="number" min={0} defaultValue={10} className="input" />
            </div>
          </div>
        </div>

        <div>
          <label className="label">Availability Options</label>
          <div className="schedule-fields-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
            <input name="availabilityOne" type="datetime-local" className="input" />
            <input name="availabilityTwo" type="datetime-local" className="input" />
            <input name="availabilityThree" type="datetime-local" className="input" />
          </div>
        </div>

        <div className="schedule-actions" style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? "Scheduling..." : "Publish session"}
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
