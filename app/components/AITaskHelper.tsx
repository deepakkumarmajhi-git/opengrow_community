"use client";

import { useState } from "react";
import { Sparkles, Loader2, Wand2, ChevronRight } from "lucide-react";

export default function AITaskHelper({ workspaceId }: { workspaceId: string }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = async () => {
    setLoading(true);
    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const demos = [
      "Break down 'Optimize UI' into: Redesign sidebar, Add micro-animations, Fix color contrast.",
      "Priority Suggestion: Move 'Fix Auth Bug' to High priority.",
      "Group tasks: 'Add Login' and 'Update Signup' into 'Auth Module'.",
    ];
    
    setSuggestions(demos);
    setLoading(false);
  };

  return (
    <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, rgba(132, 240, 184, 0.05), rgba(245, 184, 109, 0.03))", border: "1px solid rgba(132, 240, 184, 0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: 10, 
          background: "rgba(132, 240, 184, 0.15)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <Sparkles size={16} color="var(--accent)" />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700 }}>AI Task Helper</h3>
          <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>Optimize your workflow</p>
        </div>
      </div>

      {suggestions.length > 0 ? (
        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{ 
              fontSize: 12, 
              padding: "10px 12px", 
              background: "var(--bg-secondary)", 
              borderRadius: 8, 
              color: "var(--text-secondary)",
              display: "flex",
              gap: 8,
              lineHeight: 1.5
            }}>
              <ChevronRight size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              {s}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
          Get AI-driven suggestions to break down tasks or prioritize your day.
        </p>
      )}

      <button 
        onClick={generateSuggestions} 
        disabled={loading}
        className="btn btn-primary btn-sm w-full"
        style={{ gap: 8 }}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Wand2 size={14} />
        )}
        {loading ? "Analyzing..." : "Analyze Workspace"}
      </button>
    </div>
  );
}
