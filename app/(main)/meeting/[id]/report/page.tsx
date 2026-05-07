"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  BrainCircuit,
  MessageCircle,
  Mic,
  Sparkles,
} from "lucide-react";

interface ReportData {
  talkToListenRatio: number;
  speakingTimeSeconds?: number;
  listeningTimeSeconds?: number;
  clarityScore?: number;
  confidenceScore?: number;
  confidenceTrend?: string;
  fillerWordCount: number;
  fillerHeatmap?: { word: string; count: number; severity: string }[];
  pacingWpm: number;
  overallScore: number;
  summary?: string;
  transcript?: string;
  feedback: string;
  actionItems?: string[];
  tryNextTime?: string;
  badgesEarned?: string[];
  nextGoals?: string[];
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
        const response = await fetch(`/api/meetings/${id}/report`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to load report");
        }

        const data = await response.json();
        setReport(data.report);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const renderFeedback = (text: string) =>
    text.split("\n").map((paragraph, index) => {
      if (!paragraph.trim()) return <br key={index} />;

      const parts = paragraph.split(/(\*\*.*?\*\*)/g);

      if (paragraph.startsWith("### ")) {
        return (
          <h3 key={index} style={{ fontSize: 18, fontWeight: 700, margin: "24px 0 12px" }}>
            {paragraph.replace("### ", "")}
          </h3>
        );
      }

      if (paragraph.startsWith("---")) {
        return <hr key={index} style={{ borderTop: "1px solid var(--border-primary)", margin: "24px 0" }} />;
      }

      if (paragraph.startsWith("*") && paragraph.endsWith("*")) {
        return (
          <p key={index} style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: 13 }}>
            {paragraph.replace(/\*/g, "")}
          </p>
        );
      }

      return (
        <p key={index} style={{ marginBottom: 12, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          {parts.map((part, partIndex) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={partIndex} style={{ color: "var(--text-primary)" }}>
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });

  if (loading) {
    return (
      <div className="page-container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card" style={{ padding: 36, textAlign: "center" }}>
          <BrainCircuit size={36} style={{ margin: "0 auto 12px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 30, letterSpacing: "-0.05em", marginBottom: 8 }}>
            Preparing your report
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            The AI is organizing the communication signals from your meeting.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ paddingTop: 90 }}>
        <div className="card" style={{ textAlign: "center", padding: 36 }}>
          <p style={{ color: "var(--danger)", marginBottom: 16 }}>{error}</p>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="page-container" style={{ maxWidth: 980 }}>
      <button
        type="button"
        onClick={() => router.back()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 18,
          background: "transparent",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <ArrowLeft size={14} />
        Back to meeting
      </button>

      <div
        className="card report-header"
        style={{
          marginBottom: 24,
          padding: "28px clamp(22px, 4vw, 34px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          background:
            "linear-gradient(135deg, rgba(132, 240, 184, 0.14), rgba(245, 184, 109, 0.08)), var(--bg-card)",
        }}
      >
        <div>
          <span className="eyebrow" style={{ marginBottom: 14 }}>
            AI Report
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              marginBottom: 12,
            }}
          >
            Communication debrief for this session
          </h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
            Generated on {new Date(report.createdAt).toLocaleDateString("en-US")}
          </p>
        </div>

        <div className="report-score" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <p className="stat-label" style={{ marginBottom: 8 }}>
              Overall score
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Based on your speaking metrics</p>
          </div>
          <div
            style={{
              width: 94,
              height: 94,
              borderRadius: "50%",
              background: `conic-gradient(var(--accent) ${report.overallScore}%, rgba(255,255,255,0.08) ${report.overallScore}%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 78,
                height: 78,
                borderRadius: "50%",
                background: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {report.overallScore}
            </div>
          </div>
        </div>
      </div>

      <div
        className="report-metrics-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <MetricCard
          icon={<MessageCircle size={18} color="var(--info)" />}
          title="Talk to listen ratio"
          accent="rgba(109, 184, 255, 0.14)"
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, color: "var(--text-secondary)" }}>
            <span>Talking {report.talkToListenRatio}%</span>
            <span>Listening {100 - report.talkToListenRatio}%</span>
          </div>
          <div style={{ display: "flex", width: "100%", height: 10, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.04)" }}>
            <div style={{ width: `${report.talkToListenRatio}%`, background: "var(--info)" }} />
            <div style={{ width: `${100 - report.talkToListenRatio}%`, background: "rgba(255,255,255,0.12)" }} />
          </div>
        </MetricCard>

        <MetricCard
          icon={<Activity size={18} color="var(--accent-warm)" />}
          title="Speaking pace"
          accent="rgba(245, 184, 109, 0.14)"
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 44, lineHeight: 0.95 }}>
              {report.pacingWpm}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>words/min</span>
          </div>
        </MetricCard>

        <MetricCard
          icon={<Mic size={18} color="var(--danger)" />}
          title="Filler words"
          accent="rgba(255, 133, 116, 0.14)"
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 44, lineHeight: 0.95 }}>
              {report.fillerWordCount}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>detected</span>
          </div>
        </MetricCard>

        <MetricCard
          icon={<BrainCircuit size={18} color="var(--accent)" />}
          title="Clarity score"
          accent="rgba(132, 240, 184, 0.14)"
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 44, lineHeight: 0.95 }}>
              {report.clarityScore || report.overallScore}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>/100</span>
          </div>
        </MetricCard>
      </div>

      <div
        className="report-metrics-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card" style={{ padding: 22 }}>
          <p className="stat-label" style={{ marginBottom: 12 }}>
            Speaking time
          </p>
          <h3 style={{ fontSize: 34, letterSpacing: "-0.03em", marginBottom: 8 }}>
            {Math.round((report.speakingTimeSeconds || 0) / 60)}m
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            Listening time: {Math.round((report.listeningTimeSeconds || 0) / 60)}m
          </p>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <p className="stat-label" style={{ marginBottom: 12 }}>
            Confidence trend
          </p>
          <h3 style={{ fontSize: 34, letterSpacing: "-0.03em", marginBottom: 8, textTransform: "capitalize" }}>
            {report.confidenceTrend || "steady"}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            Confidence score: {report.confidenceScore || report.overallScore}/100
          </p>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <p className="stat-label" style={{ marginBottom: 12 }}>
            Filler heatmap
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(report.fillerHeatmap || []).map((item) => (
              <span key={item.word} className="badge-outline">
                {item.word}: {item.count}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card report-feedback" style={{ padding: "28px clamp(22px, 4vw, 34px)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Sparkles size={18} color="var(--accent)" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "-0.05em" }}>
            Coach plan
          </h2>
        </div>
        {report.summary && (
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 16 }}>
            {report.summary}
          </p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
          <div>
            <p className="stat-label" style={{ marginBottom: 10 }}>
              Action items
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {(report.actionItems || []).map((item) => (
                <p key={item} style={{ color: "var(--text-secondary)" }}>
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="stat-label" style={{ marginBottom: 10 }}>
              Try this next time
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {report.tryNextTime || "Set one concrete speaking goal before the next room."}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
          {(report.badgesEarned || []).map((badge) => (
            <span key={badge} className="badge">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="card report-feedback" style={{ padding: "28px clamp(22px, 4vw, 34px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Sparkles size={18} color="var(--accent)" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              letterSpacing: "-0.05em",
            }}
          >
            Detailed feedback
          </h2>
        </div>
        {renderFeedback(report.feedback)}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  accent,
  children,
}: {
  icon: ReactNode;
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: accent,
          }}
        >
          {icon}
        </div>
        <div>
          <p className="stat-label" style={{ marginBottom: 6 }}>
            Metric
          </p>
          <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );
}
