"use client";

import { useState } from "react";
import { Plus, Calendar, MessageSquare, Clock, X } from "lucide-react";

export default function ScheduleMeetingForm({
  communityId,
}: {
  communityId: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communityId,
          title: form.get("title"),
          topic: form.get("topic"),
          scheduledAt: form.get("scheduledAt"),
          durationMinutes: Number(form.get("durationMinutes")) || 30,
        }),
      });

      if (res.ok) {
        setShowForm(false);
        window.location.reload();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="btn btn-primary"
        style={{ 
          marginBottom: 32, 
          width: "100%", 
          height: 48, 
          borderRadius: "var(--radius-md)",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10
        }}
      >
        <Plus size={18} />
        Initialize New Meeting
      </button>
    );
  }

  return (
    <div
      className="card"
      style={{ 
        marginBottom: 32, 
        padding: 28, 
        border: "1px solid var(--border-secondary)",
        background: "var(--bg-glass)",
        backdropFilter: "blur(20px)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Calendar size={20} color="var(--accent)" />
          <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Session Configuration</h3>
        </div>
        <button 
          onClick={() => setShowForm(false)} 
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div>
          <label className="label-minimal">Session Title</label>
          <input
            name="title"
            className="input-minimal"
            placeholder="e.g. Strategic Planning Sync"
            required
          />
        </div>
        
        <div>
          <label className="label-minimal">Discussion Topic</label>
          <div style={{ position: "relative" }}>
            <MessageSquare size={14} style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              name="topic"
              className="input-minimal"
              placeholder="What specific focus area should members prepare for?"
              style={{ paddingLeft: 24 }}
              required
            />
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>This will be highlighted to all members upon joining.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <label className="label-minimal">Scheduled Commencement</label>
            <input
              name="scheduledAt"
              type="datetime-local"
              className="input-minimal"
              required
              style={{ colorScheme: "dark" }}
            />
          </div>
          <div>
            <label className="label-minimal">Time Allocation</label>
            <div style={{ position: "relative" }}>
              <Clock size={14} style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <select name="durationMinutes" className="input-minimal" defaultValue="30" style={{ paddingLeft: 24 }}>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="90">90 Minutes</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ flex: 1, height: 48 }}
          >
            {submitting ? "Finalizing..." : "Finalize & Schedule"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="btn btn-secondary"
            style={{ padding: "0 24px" }}
          >
            Discard
          </button>
        </div>
      </form>

      <style jsx>{`
        .label-minimal {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .input-minimal {
          width: 100%;
          background: none;
          border: none;
          border-bottom: 1px solid var(--border-primary);
          padding: 8px 0;
          color: var(--text-primary);
          font-size: 15px;
          outline: none;
          transition: border-color 0.3s;
        }
        .input-minimal:focus {
          border-color: var(--accent);
        }
        select.input-minimal {
          cursor: pointer;
          appearance: none;
        }
      `}</style>
    </div>
  );
}
