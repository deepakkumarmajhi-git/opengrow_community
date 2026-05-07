import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Meeting from "@/lib/models/Meeting";
import MeetingReport from "@/lib/models/MeetingReport";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  MessageSquare,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { generateCoachReport } from "@/lib/coach";

export default async function MeetingReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();

  const meeting = await Meeting.findById(id).populate("community", "name").lean();
  if (!meeting) redirect("/dashboard");

  // Ensure the user attended or hosted
  const isHost = String(meeting.host) === session.userId;
  const attended = (meeting.attendees as unknown as Array<{ toString(): string }>).some(
    (a) => a.toString() === session.userId
  );
  if (!isHost && !attended) redirect("/dashboard");

  // Fetch or generate report
  let reportDoc = await MeetingReport.findOne({
    meetingId: id,
    userId: session.userId,
  }).lean();

  if (!reportDoc) {
    const coachReport = generateCoachReport(`${id}:${session.userId}:${meeting.title}`);
    reportDoc = await MeetingReport.create({
      meetingId: id,
      userId: session.userId,
      ...coachReport,
    });
  }

  const r = reportDoc as typeof reportDoc & {
    overallScore: number;
    clarityScore: number;
    confidenceScore: number;
    confidenceTrend: string;
    talkToListenRatio: number;
    speakingTimeSeconds: number;
    listeningTimeSeconds: number;
    pacingWpm: number;
    fillerWordCount: number;
    fillerHeatmap: { word: string; count: number; severity: string }[];
    summary: string;
    actionItems: string[];
    tryNextTime: string;
    badgesEarned: string[];
    nextGoals: string[];
  };

  const speakingMin = Math.round(r.speakingTimeSeconds / 60);
  const listeningMin = Math.round(r.listeningTimeSeconds / 60);
  const trendColor =
    r.confidenceTrend === "rising"
      ? "var(--success)"
      : r.confidenceTrend === "dipping"
        ? "var(--danger)"
        : "var(--accent-warm)";

  const scoreColor = (s: number) =>
    s >= 85 ? "var(--success)" : s >= 70 ? "var(--accent-warm)" : "var(--danger)";

  const communityName =
    (meeting.community as unknown as { name: string })?.name ?? "Community";

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link
          href={`/community/${String((meeting.community as unknown as { _id: string })?._id ?? "")}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-secondary)",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 22,
          }}
        >
          <ArrowLeft size={14} />
          Back to {communityName}
        </Link>

        <div
          className="card"
          style={{
            padding: "28px clamp(22px, 4vw, 36px)",
            background:
              "linear-gradient(135deg, rgba(132, 240, 184, 0.12), rgba(35, 131, 226, 0.08)), var(--bg-card)",
          }}
        >
          <p className="stat-label" style={{ marginBottom: 10 }}>
            AI Coach Report · {communityName}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
              marginBottom: 14,
            }}
          >
            {meeting.title}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.75, maxWidth: 640 }}>
            {r.summary}
          </p>
        </div>
      </div>

      {/* Score Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          { label: "Overall", value: r.overallScore, icon: BarChart3 },
          { label: "Clarity", value: r.clarityScore, icon: MessageSquare },
          { label: "Confidence", value: r.confidenceScore, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="card"
            style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="stat-label">{label}</span>
              <Icon size={16} color={scoreColor(value)} />
            </div>
            {/* Score bar */}
            <div style={{ background: "var(--border-primary)", borderRadius: 6, height: 6, overflow: "hidden" }}>
              <div
                style={{
                  width: `${value}%`,
                  height: "100%",
                  background: scoreColor(value),
                  transition: "width 1s ease",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                color: scoreColor(value),
              }}
            >
              {value}
              <span style={{ fontSize: 16, color: "var(--text-muted)", fontFamily: "inherit" }}>/100</span>
            </p>
          </div>
        ))}

        {/* Talk/Listen ratio card */}
        <div className="card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="stat-label">Talk / Listen</span>
            <Clock size={16} color="var(--text-muted)" />
          </div>
          <div style={{ display: "flex", gap: 4, height: 6, borderRadius: 6, overflow: "hidden" }}>
            <div
              style={{
                width: `${r.talkToListenRatio}%`,
                background: "var(--accent)",
              }}
            />
            <div
              style={{
                flex: 1,
                background: "var(--border-primary)",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>
              {speakingMin}m speaking
            </span>
            <span style={{ color: "var(--text-muted)" }}>{listeningMin}m listening</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, 0.85fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Pacing + Confidence trend */}
          <div className="card" style={{ padding: 24 }}>
            <p className="stat-label" style={{ marginBottom: 18 }}>Speaking Dynamics</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Pacing</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em" }}>
                  {r.pacingWpm}
                  <span style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: "inherit" }}> wpm</span>
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  {r.pacingWpm > 155 ? "A touch fast — pause more." : r.pacingWpm < 115 ? "Bit slow — build energy." : "Solid rhythm."}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>Confidence Trend</p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: trendColor,
                    textTransform: "capitalize",
                  }}
                >
                  {r.confidenceTrend}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  {r.confidenceTrend === "rising" ? "Great momentum." : r.confidenceTrend === "dipping" ? "Keep your posture and breathe." : "Consistent presence."}
                </p>
              </div>
            </div>
          </div>

          {/* Filler words */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <p className="stat-label">Filler Words</p>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 8,
                  background: r.fillerWordCount <= 7 ? "rgba(46,160,67,0.1)" : "rgba(212,76,71,0.1)",
                  color: r.fillerWordCount <= 7 ? "var(--success)" : "var(--danger)",
                }}
              >
                {r.fillerWordCount} detected
              </span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {r.fillerHeatmap.map(({ word, count, severity }: { word: string; count: number; severity: string }) => (
                <div key={word} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: 13,
                      background: "var(--bg-tertiary)",
                      padding: "2px 8px",
                      borderRadius: 6,
                      minWidth: 60,
                    }}
                  >
                    &quot;{word}&quot;
                  </span>
                  <div style={{ flex: 1, background: "var(--border-primary)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${Math.min(count * 10, 100)}%`,
                        height: "100%",
                        background:
                          severity === "high"
                            ? "var(--danger)"
                            : severity === "medium"
                              ? "var(--accent-warm)"
                              : "var(--accent)",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 20, textAlign: "right" }}>
                    {count}×
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action items */}
          <div className="card" style={{ padding: 24 }}>
            <p className="stat-label" style={{ marginBottom: 16 }}>
              <Target size={14} style={{ display: "inline", marginRight: 6 }} />
              Your Action Items
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {r.actionItems.map((item: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <CheckCircle2 size={16} color="var(--accent)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text-soft)" }}>{item}</p>
                </div>
              ))}
            </div>
            {r.tryNextTime && (
              <div
                style={{
                  marginTop: 18,
                  padding: 16,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(132, 240, 184, 0.07)",
                  border: "1px solid rgba(132, 240, 184, 0.18)",
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: "var(--accent)" }}>
                  Try this next time
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>
                  {r.tryNextTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Badges */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Award size={18} color="var(--accent-warm)" />
              <p className="stat-label">Badges Earned</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {r.badgesEarned.map((badge: string) => (
                <div
                  key={badge}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(245, 184, 109, 0.08)",
                    border: "1px solid rgba(245, 184, 109, 0.2)",
                  }}
                >
                  <Zap size={14} color="var(--accent-warm)" />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next goals */}
          <div className="card" style={{ padding: 22 }}>
            <p className="stat-label" style={{ marginBottom: 16 }}>Next Session Goals</p>
            <div style={{ display: "grid", gap: 10 }}>
              {r.nextGoals.map((goal: string, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontSize: 14,
                    color: "var(--text-soft)",
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 8,
                      background: "var(--bg-tertiary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                  {goal}
                </div>
              ))}
            </div>
          </div>

          {/* Meeting meta */}
          <div className="card" style={{ padding: 22 }}>
            <p className="stat-label" style={{ marginBottom: 14 }}>Session Info</p>
            <div style={{ display: "grid", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>Community</span>
                <strong style={{ color: "var(--text-primary)" }}>{communityName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>Date</span>
                <strong style={{ color: "var(--text-primary)" }}>
                  {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </div>
              {meeting.template && meeting.template !== "custom" && (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>Format</span>
                  <strong style={{ color: "var(--text-primary)", textTransform: "capitalize" }}>
                    {meeting.template.replace(/-/g, " ")}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
