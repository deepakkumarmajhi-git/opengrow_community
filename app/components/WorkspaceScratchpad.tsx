"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Edit3, Save, Loader2 } from "lucide-react";

export default function WorkspaceScratchpad({ 
  workspaceId, 
  initialValue 
}: { 
  workspaceId: string; 
  initialValue: string 
}) {
  const [content, setContent] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveContent = useCallback(async (newContent: string) => {
    setIsSaving(true);
    try {
      await fetch(`/api/workspaces/${workspaceId}/scratchpad`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scratchpad: newContent }),
      });
    } catch (error) {
      console.error("Failed to save scratchpad:", error);
    } finally {
      setIsSaving(false);
    }
  }, [workspaceId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      saveContent(value);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, background: "var(--bg-secondary)", minHeight: 300 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Edit3 size={16} color="var(--accent)" />
          <span className="stat-label" style={{ fontSize: 12 }}>Scratchpad</span>
        </div>
        {isSaving ? (
          <Loader2 size={14} className="animate-spin" color="var(--text-muted)" />
        ) : (
          <Save size={14} color="var(--text-muted)" style={{ opacity: 0.5 }} />
        )}
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Quick notes, ideas, or links..."
        style={{
          flex: 1,
          width: "100%",
          background: "transparent",
          border: "none",
          color: "var(--text-primary)",
          fontSize: 14,
          lineHeight: 1.6,
          resize: "none",
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      
      <div style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "right", marginTop: "auto" }}>
        Auto-saves as you type
      </div>
    </div>
  );
}
