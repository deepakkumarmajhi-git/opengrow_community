import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import Meeting from "@/lib/models/Meeting";
import User from "@/lib/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Video,
  Calendar,
  ArrowLeft,
  Clock,
  User as UserIcon,
  Shield,
  Layout,
  ExternalLink,
} from "lucide-react";
import ScheduleMeetingForm from "@/app/(main)/community/[id]/ScheduleMeetingForm";
import JoinButton from "@/app/components/JoinButton";
import CommunitySettings from "@/app/(main)/community/[id]/CommunitySettings";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();

  const community = await Community.findById(id)
    .populate({ path: "creator", model: User, select: "name email role" })
    .populate({ path: "members", model: User, select: "name email role points" })
    .lean();

  if (!community) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 100 }}>
        <p style={{ color: "var(--text-muted)" }}>Community not found</p>
        <Link href="/discover" className="btn btn-secondary" style={{ marginTop: 16 }}>
          Back to Discover
        </Link>
      </div>
    );
  }

  const meetings = await Meeting.find({ community: id })
    .populate({ path: "host", model: User, select: "name" })
    .sort({ scheduledAt: -1 })
    .lean();

  const isCreator =
    (community.creator as unknown as { _id: string })?._id?.toString() === session.userId;
  const isMember = (community.members as unknown as { _id: string }[])?.some(
    (m) => m._id?.toString() === session.userId
  );

  const upcomingMeetings = meetings.filter(
    (m) => new Date(m.scheduledAt) >= new Date() && m.status !== "completed"
  );
  const pastMeetings = meetings.filter(
    (m) => new Date(m.scheduledAt) < new Date() || m.status === "completed"
  );

  const creator = community.creator as unknown as {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  const members = community.members as unknown as {
    _id: string;
    name: string;
    role: string;
    points: number;
  }[];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Hero Header */}
      <div className="hero-gradient" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <div className="page-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Link
            href="/discover"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 32,
              transition: "color 0.2s",
            }}
            className="hover-white"
          >
            <ArrowLeft size={14} />
            Back to Communities
          </Link>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span className="badge-outline">{community.category}</span>
                {isCreator && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "var(--accent)", background: "var(--accent-muted)", padding: "4px 10px", borderRadius: 9999 }}>
                    <Shield size={10} />
                    ADMIN
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, marginBottom: 16, letterSpacing: "-0.04em" }}>
                {community.name}
              </h1>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 700, marginBottom: 0 }}>
                {community.description}
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", paddingBottom: 8 }}>
              {!isCreator && !isMember && <JoinButton communityId={id} />}
              {isCreator && (
                <CommunitySettings 
                  community={{
                    _id: String(community._id),
                    name: community.name,
                    description: community.description,
                    category: community.category,
                    maxMembers: community.maxMembers
                  }} 
                  members={members.filter(m => m._id.toString() !== session.userId)}
                />
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
            gap: 1, 
            background: "var(--border-primary)",
            marginTop: 48,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--border-primary)"
          }}>
            <div className="stat-card" style={{ background: "var(--bg-tertiary)" }}>
              <span className="stat-label">Members</span>
              <span className="stat-value">{members.length} <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 400 }}>/ {community.maxMembers}</span></span>
            </div>
            <div className="stat-card" style={{ background: "var(--bg-tertiary)" }}>
              <span className="stat-label">Upcoming</span>
              <span className="stat-value">{upcomingMeetings.length}</span>
            </div>
            <div className="stat-card" style={{ background: "var(--bg-tertiary)" }}>
              <span className="stat-label">Host</span>
              <span className="stat-value" style={{ fontSize: 16 }}>{creator?.name.split(" ")[0]}</span>
            </div>
            <div className="stat-card" style={{ background: "var(--bg-tertiary)" }}>
              <span className="stat-label">Activity</span>
              <span className="stat-value" style={{ fontSize: 16, color: "#10b981" }}>High</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }}>
          {/* Main Content */}
          <main>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <Video size={20} />
                Live Sessions
              </h2>
            </div>

            {/* Schedule form (only for creator) */}
            {isCreator && (
              <div style={{ marginBottom: 32 }}>
                <ScheduleMeetingForm communityId={id} />
              </div>
            )}

            {/* Non-member welcome */}
            {!isMember && !isCreator && (
              <div
                className="glass-panel"
                style={{
                  padding: 40,
                  textAlign: "center",
                  marginBottom: 32
                }}
              >
                <Layout size={40} style={{ margin: "0 auto 16px", color: "var(--accent)", opacity: 0.8 }} />
                <h3 style={{ fontSize: 22, marginBottom: 12 }}>Join the Conversation</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: 24, maxWidth: 450, margin: "0 auto 24px" }}>
                  Connect with experts, participate in live meetings, and access exclusive AI-generated session reports.
                </p>
                <JoinButton communityId={id} />
              </div>
            )}

            {/* Upcoming Meetings */}
            <section style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                Upcoming Meetings
              </h3>
              
              {upcomingMeetings.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {upcomingMeetings.map((meeting) => (
                    <div
                      key={String(meeting._id)}
                      className="glass-panel"
                      style={{
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{meeting.title}</h4>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--text-muted)" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Clock size={14} />
                            {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Users size={14} />
                            {meeting.attendees?.length || 0} attending
                          </span>
                        </div>
                      </div>
                      
                      {(isMember || isCreator) && (
                        <Link
                          href={`/meeting/${meeting._id}`}
                          className="btn btn-primary"
                          style={{ padding: "8px 20px" }}
                        >
                          Join Now
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ fontSize: 14 }}>No upcoming sessions scheduled.</p>
                </div>
              )}
            </section>

            {/* Past Meetings */}
            {pastMeetings.length > 0 && (
              <section>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                  Archive
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {pastMeetings.slice(0, 4).map((meeting) => {
                    const didAttend = meeting.attendees?.some((a: any) => String(a) === session.userId) || String(meeting.host?._id || meeting.host) === session.userId;
                    return (
                      <div
                        key={String(meeting._id)}
                        className="glass-panel"
                        style={{ padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                      >
                        <div style={{ marginBottom: 12 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{meeting.title}</h4>
                          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                            {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        {didAttend && (
                          <Link
                            href={`/meeting/${meeting._id}/report`}
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              display: "flex",
                              alignItems: "center",
                              gap: 6
                            }}
                            className="hover-underline"
                          >
                            View Summary
                            <ExternalLink size={12} />
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside>
            <div style={{ position: "sticky", top: 40 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Members</h2>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{members.length} TOTAL</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {members.map((member) => (
                  <div
                    key={member._id}
                    className="glass-panel"
                    style={{
                      padding: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      border: "none",
                      background: "rgba(255,255,255,0.02)"
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        background: member._id === creator?._id ? "var(--accent-muted)" : "var(--bg-tertiary)",
                        color: member._id === creator?._id ? "var(--accent)" : "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 12,
                        border: "1px solid var(--border-primary)"
                      }}
                    >
                      {member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {member.name}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {member._id === creator?._id ? "Community Admin" : member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {members.length > 10 && (
                <button style={{ width: "100%", marginTop: 12, background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  View all members
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}
