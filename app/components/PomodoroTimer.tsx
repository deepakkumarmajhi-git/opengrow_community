"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap } from "lucide-react";

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMinutes(mode === "work" ? 25 : 5);
    setSeconds(0);
  }, [mode]);

  useEffect(() => {
    let interval: any = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          const nextMode = mode === "work" ? "break" : "work";
          setMode(nextMode);
          setMinutes(nextMode === "work" ? 25 : 5);
          setSeconds(0);
          // Play notification sound or alert
          alert(`${mode === "work" ? "Work" : "Break"} session complete!`);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode]);

  return (
    <div className="card" style={{ padding: 20, textAlign: "center", background: "var(--bg-secondary)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        {mode === "work" ? <Zap size={16} color="var(--accent)" /> : <Coffee size={16} color="var(--success)" />}
        <span className="stat-label" style={{ fontSize: 12 }}>
          {mode === "work" ? "Focus Session" : "Short Break"}
        </span>
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 42,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          marginBottom: 20,
          color: "var(--text-primary)",
        }}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <button
          onClick={toggleTimer}
          className={`btn ${isActive ? "btn-secondary" : "btn-primary"} btn-sm`}
          style={{ width: 40, height: 40, borderRadius: 12, padding: 0 }}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={resetTimer}
          className="btn btn-ghost btn-sm"
          style={{ width: 40, height: 40, borderRadius: 12, padding: 0 }}
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <button
          onClick={() => { setMode("work"); resetTimer(); }}
          style={{
            flex: 1,
            fontSize: 10,
            fontWeight: 700,
            padding: "6px 0",
            borderRadius: 6,
            border: "none",
            background: mode === "work" ? "rgba(132, 240, 184, 0.15)" : "transparent",
            color: mode === "work" ? "var(--accent)" : "var(--text-muted)",
            cursor: "pointer"
          }}
        >
          Focus
        </button>
        <button
          onClick={() => { setMode("break"); resetTimer(); }}
          style={{
            flex: 1,
            fontSize: 10,
            fontWeight: 700,
            padding: "6px 0",
            borderRadius: 6,
            border: "none",
            background: mode === "break" ? "rgba(132, 240, 184, 0.15)" : "transparent",
            color: mode === "break" ? "var(--accent)" : "var(--text-muted)",
            cursor: "pointer"
          }}
        >
          Break
        </button>
      </div>
    </div>
  );
}
