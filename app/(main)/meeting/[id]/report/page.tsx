"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowLeft, 
  Loader2, 
  Activity, 
  MessageCircle, 
  Mic, 
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";

interface ReportData {
  talkToListenRatio: number;
  fillerWordCount: number;
  pacingWpm: number;
  overallScore: number;
  feedback: string;
  createdAt: string;
}

export default function MeetingReportPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/meetings/${id}/report`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load report");
        }
        const data = await res.json();
        setReport(data.report);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load report";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const renderFeedback = (text: string) => {
    return text.split('\n').map((paragraph, idx) => {
      if (!paragraph.trim()) return <br key={idx} />;
      
      // Simple bold parsing
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      
      if (paragraph.startsWith('### ')) {
        return <h3 key={idx} style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, marginTop: 24 }}>{paragraph.replace('### ', '')}</h3>;
      }
      if (paragraph.startsWith('---')) {
        return <hr key={idx} style={{ borderTop: "1px solid var(--border-secondary)", margin: "24px 0" }} />;
      }
      if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
        return <p key={idx} style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>{paragraph.replace(/\*/g, '')}</p>;
      }

      return (
        <p key={idx} style={{ marginBottom: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} style={{ color: "var(--text-primary)" }}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ position: "relative", marginBottom: 24 }}>
          <BrainCircuit size={48} color="var(--accent)" className="animate-pulse" />
          <div style={{ position: "absolute", inset: -20, background: "var(--accent-glow)", filter: "blur(20px)", borderRadius: "50%", zIndex: -1 }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Analyzing Communication Data...</h2>
        <p style={{ color: "var(--text-muted)" }}>Our AI is processing your speech patterns and generating insights.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 100 }}>
        <p style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</p>
        <button onClick={() => router.back()} className="btn btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <button 
        onClick={() => router.back()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--text-muted)",
          marginBottom: 32,
          transition: "color 0.2s",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={14} />
        Back to Meeting
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Sparkles size={24} color="var(--accent)" />
            <h1 style={{ fontSize: 32, fontWeight: 700 }}>AI Report Card</h1>
          </div>
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>
            Post-meeting communication analysis generated on {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Overall Score Circle */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Overall Score</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Based on 3 metrics</p>
          </div>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `conic-gradient(var(--accent) ${report.overallScore}%, var(--bg-tertiary) ${report.overallScore}%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--bg-card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
            }}>
              <span style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{report.overallScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24, marginBottom: 32 }}>
        
        {/* Talk Ratio Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: 8, borderRadius: 8, background: "rgba(59, 130, 246, 0.1)" }}>
              <MessageCircle size={18} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: 16 }}>Talk-to-Listen Ratio</h3>
          </div>
          
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              <span style={{ color: "var(--text-primary)" }}>Talking: {report.talkToListenRatio}%</span>
              <span style={{ color: "var(--text-secondary)" }}>Listening: {100 - report.talkToListenRatio}%</span>
            </div>
            <div style={{ height: 8, width: "100%", background: "var(--bg-tertiary)", borderRadius: 4, overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${report.talkToListenRatio}%`, background: "#3b82f6", height: "100%" }} />
              <div style={{ width: `${100 - report.talkToListenRatio}%`, background: "var(--bg-glass)", height: "100%" }} />
            </div>
          </div>
        </div>

        {/* Pacing Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: 8, borderRadius: 8, background: "rgba(245, 158, 11, 0.1)" }}>
              <Activity size={18} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: 16 }}>Speaking Pace (WPM)</h3>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{report.pacingWpm}</span>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>words / min</span>
          </div>
        </div>

        {/* Filler Words Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ padding: 8, borderRadius: 8, background: "rgba(239, 68, 68, 0.1)" }}>
              <Mic size={18} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 16 }}>Filler Words Used</h3>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{report.fillerWordCount}</span>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>detected</span>
          </div>
        </div>

      </div>

      {/* Detailed Feedback */}
      <div className="card" style={{ padding: "32px 40px" }}>
        {renderFeedback(report.feedback)}
      </div>

    </div>
  );
}
