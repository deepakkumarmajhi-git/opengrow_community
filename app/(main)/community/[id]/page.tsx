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
} from "lucide-react";
import ScheduleMeetingForm from "@/app/(main)/community/[id]/ScheduleMeetingForm";
import JoinButton from "@/app/components/JoinButton";

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
    <div className="page-container">
      {/* Back link */}
      <Link
        href="/discover"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--text-muted)",
          marginBottom: 24,
          transition: "color 0.2s",
        }}
      >
        <ArrowLeft size={14} />
        Back to Discover
      </Link>

      {/* Community Header */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>
                {community.name}
              </h1>
              <span className="badge">{community.category}</span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 600,
                marginBottom: 12,
              }}
            >
              {community.description}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={14} />
                {members.length}/{community.maxMembers} members
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <UserIcon size={14} />
                Created by {creator?.name}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Calendar size={14} />
                {upcomingMeetings.length} upcoming
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {isCreator ? (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  fontWeight: 500,
                  padding: "4px 10px",
                  background: "var(--accent-muted)",
                  borderRadius: 9999,
                }}
              >
                Your community
              </span>
            ) : !isMember && (
              <JoinButton communityId={id} />
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Meetings */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Meetings</h2>
          </div>

          {/* Schedule form (only for creator) */}
          {isCreator && <ScheduleMeetingForm communityId={id} />}

          {/* Non-member welcome */}
          {!isMember && !isCreator && (
            <div
              className="card"
              style={{
                padding: 32,
                textAlign: "center",
                background: "var(--bg-glass)",
                border: "1px solid var(--border-primary)",
                marginBottom: 24
              }}
            >
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>Unlock this Community</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
                Join this community to participate in meetings, view AI reports, and connect with other members.
              </p>
              <JoinButton communityId={id} />
            </div>
          )}

          {/* Upcoming */}
          {upcomingMeetings.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 12,
                }}
              >
                Upcoming
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={String(meeting._id)}
                    className="card"
                    style={{
                      padding: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                        {meeting.title}
                      </p>
                      {meeting.topic && (
                        <p style={{ fontSize: 12, color: "var(--accent)", marginBottom: 4 }}>
                          Topic: {meeting.topic}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={12} />
                          {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>{meeting.durationMinutes}min</span>
                      </div>
                    </div>
                    {(isMember || isCreator) && (
                      <Link
                        href={`/meeting/${meeting._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        <Video size={14} />
                        Join
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {pastMeetings.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 12,
                }}
              >
                Past Meetings
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pastMeetings.slice(0, 5).map((meeting) => {
                  const didAttend = meeting.attendees?.some((a: any) => String(a) === session.userId) || String(meeting.host?._id || meeting.host) === session.userId;
                  return (
                    <div
                      key={String(meeting._id)}
                      className="card"
                      style={{ padding: 16, opacity: 0.7, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                          {meeting.title}
                        </p>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" · "}
                          {meeting.attendees?.length || 0} attended
                        </span>
                      </div>
                      {didAttend && (
                        <Link
                          href={`/meeting/${meeting._id}/report`}
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: "var(--accent)",
                            background: "var(--accent-muted)",
                            padding: "6px 12px",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                          }}
                        >
                          <Video size={14} />
                          View AI Report
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {upcomingMeetings.length === 0 && pastMeetings.length === 0 && (
            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "40px 24px",
                color: "var(--text-muted)",
              }}
            >
              <Video size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p style={{ fontSize: 14 }}>No meetings scheduled yet</p>
            </div>
          )}
        </div>

        {/* Members */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            Members ({members.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {members.map((member) => (
              <div
                key={member._id}
                className="card"
                style={{
                  padding: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--radius-md)",
                    background:
                      member._id === creator?._id
                        ? "var(--accent-muted)"
                        : "var(--bg-tertiary)",
                    color:
                      member._id === creator?._id
                        ? "var(--accent)"
                        : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>
                    {member.name}
                    {member._id === creator?._id && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--accent)",
                          marginLeft: 6,
                        }}
                      >
                        Admin
                      </span>
                    )}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {member.role} · {member.points} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
