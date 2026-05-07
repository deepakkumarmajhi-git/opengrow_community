import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarPlus,
  Clock,
  ExternalLink,
  Shield,
  Users,
  Video,
} from "lucide-react";
import CommunitySettings from "@/app/(main)/community/[id]/CommunitySettings";
import CommunityWorkspace from "@/app/(main)/community/[id]/CommunityWorkspace";
import CommunityAnalytics from "@/app/(main)/community/[id]/CommunityAnalytics";
import CommunityFeed from "@/app/(main)/community/[id]/CommunityFeed";
import ScheduleMeetingForm from "@/app/(main)/community/[id]/ScheduleMeetingForm";
import AvailabilityVoting from "@/app/components/AvailabilityVoting";
import JoinButton from "@/app/components/JoinButton";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import Meeting from "@/lib/models/Meeting";
import User from "@/lib/models/User";

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
      <div className="page-container" style={{ paddingTop: 90, textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>Community not found.</p>
        <Link href="/discover" className="btn btn-secondary">
          Back to discover
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
    (member) => member._id?.toString() === session.userId
  );

  const upcomingMeetings = meetings.filter(
    (meeting) => new Date(meeting.scheduledAt) >= new Date() && meeting.status !== "completed"
  );
  const pastMeetings = meetings.filter(
    (meeting) => new Date(meeting.scheduledAt) < new Date() || meeting.status === "completed"
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

  const workspace = {
    pinnedNotes: (community.pinnedNotes || []).map((note: { title: string; body: string }) => ({
      title: note.title,
      body: note.body,
    })),
    resources: (community.resources || []).map(
      (resource: { title: string; url: string; description?: string }) => ({
        title: resource.title,
        url: resource.url,
        description: resource.description || "",
      })
    ),
    announcements: (community.announcements || []).map((announcement: { body: string }) => ({
      body: announcement.body,
    })),
    weeklyGoals: (community.weeklyGoals || []).map((goal: { text: string; done: boolean }) => ({
      text: goal.text,
      done: goal.done,
    })),
  };

  return (
    <div className="page-container">
      <Link
        href="/discover"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          color: "var(--text-secondary)",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <ArrowLeft size={14} />
        Back to discover
      </Link>

      <div
        className="card"
        style={{
          marginBottom: 24,
          padding: "28px clamp(22px, 4vw, 34px)",
          background:
            "linear-gradient(135deg, rgba(132, 240, 184, 0.14), rgba(245, 184, 109, 0.08)), var(--bg-card)",
        }}
      >
        <div
          className="community-hero-row"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <span className="badge-outline">{community.category}</span>
              {isCreator && (
                <span className="badge" style={{ background: "rgba(132, 240, 184, 0.12)", color: "var(--accent)" }}>
                  <Shield size={12} />
                  Host
                </span>
              )}
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 10,
              }}
            >
              {community.name}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.8 }}>
              {community.description}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {!isCreator && !isMember && <JoinButton communityId={id} />}
            {isCreator && (
              <CommunitySettings
                community={{
                  _id: String(community._id),
                  name: community.name,
                  description: community.description,
                  category: community.category,
                  maxMembers: community.maxMembers,
                }}
                members={members.filter((member) => member._id.toString() !== session.userId)}
              />
            )}
          </div>
        </div>

        <div
          className="community-stat-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 14,
            marginTop: 24,
          }}
        >
          <div className="card stat-card" style={{ padding: "16px 20px", minHeight: 100 }}>
            <span className="stat-label">Members</span>
            <span className="stat-value" style={{ fontSize: 22, fontWeight: 600 }}>
              {members.length}
              <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 8 }}>
                / {community.maxMembers}
              </span>
            </span>
          </div>
          <div className="card stat-card" style={{ padding: "16px 20px", minHeight: 100 }}>
            <span className="stat-label">Upcoming Sessions</span>
            <span className="stat-value" style={{ fontSize: 22, fontWeight: 600 }}>{upcomingMeetings.length}</span>
          </div>
          <div className="card stat-card" style={{ padding: "16px 20px", minHeight: 100 }}>
            <span className="stat-label">Host</span>
            <span className="stat-value" style={{ fontSize: 22, fontWeight: 600 }}>
              {creator?.name.split(" ")[0]}
            </span>
          </div>
          <div className="card stat-card" style={{ padding: "16px 20px", minHeight: 100 }}>
            <span className="stat-label">Energy</span>
            <span className="stat-value" style={{ fontSize: 22, fontWeight: 600 }}>
              Active
            </span>
          </div>
        </div>
      </div>

      <div
        className="community-content-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.45fr) minmax(300px, 0.85fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <main>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 14,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            {isCreator && <CommunityAnalytics communityId={id} />}

            <div>
              <p className="stat-label" style={{ marginBottom: 8 }}>
                Sessions
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Live rooms for this community
              </h2>
            </div>
            {isCreator && <ScheduleMeetingForm communityId={id} />}
          </div>

          {!isMember && !isCreator && (
            <div className="card" style={{ marginBottom: 18, textAlign: "center", padding: 30 }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  letterSpacing: "-0.04em",
                  marginBottom: 10,
                }}
              >
                Unlock live sessions
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 20px" }}>
                Join to practice speaking, attend live meetings, and receive AI-driven feedback.
              </p>
              <JoinButton communityId={id} />
            </div>
          )}

          <section style={{ marginBottom: 24 }}>
            <p className="stat-label" style={{ marginBottom: 12 }}>
              Upcoming
            </p>
            {upcomingMeetings.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={String(meeting._id)}
                    className="card community-meeting-card"
                    style={{
                      padding: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 18,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p className="stat-label" style={{ marginBottom: 8 }}>
                        {meeting.template ? String(meeting.template).replace(/-/g, " ") : "Scheduled Session"}
                      </p>
                      <h3
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          letterSpacing: "-0.03em",
                          marginBottom: 8,
                        }}
                      >
                        {meeting.title}
                      </h3>
                      <div className="community-meeting-meta" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", color: "var(--text-secondary)", fontSize: 13 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Clock size={14} />
                          {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Users size={14} />
                          {meeting.attendees?.length || 0} attending
                        </span>
                      </div>
                    </div>

                    {(isMember || isCreator) && (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <a href={`/api/meetings/${meeting._id}/calendar`} className="btn btn-secondary btn-sm">
                          <CalendarPlus size={14} />
                          Calendar
                        </a>
                        <Link href={`/meeting/${meeting._id}`} className="btn btn-primary btn-sm">
                          Join room
                        </Link>
                      </div>
                    )}

                    {(isMember || isCreator) && (
                      <AvailabilityVoting
                        meetingId={String(meeting._id)}
                        currentUserId={session.userId}
                        options={(meeting.availabilityOptions || []).map(
                          (option: { startsAt: Date; votes: unknown[] }) => ({
                            startsAt: option.startsAt,
                            votes: option.votes.map(String),
                          })
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ padding: 30, color: "var(--text-secondary)" }}>
                No upcoming sessions yet. {isCreator ? "Schedule the next one to keep momentum alive." : "Check back soon."}
              </div>
            )}
          </section>

          {pastMeetings.length > 0 && (
            <section>
              <p className="stat-label" style={{ marginBottom: 12 }}>
                Archive
              </p>
              <div className="community-archive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                {pastMeetings.slice(0, 4).map((meeting) => {
                  const didAttend =
                    (meeting.attendees as unknown as Array<{ toString(): string }> | undefined)?.some(
                      (attendee) => attendee.toString() === session.userId
                    ) ||
                    String((meeting.host as unknown as { _id?: unknown })?._id ?? meeting.host) === session.userId;

                  return (
                    <div key={String(meeting._id)} className="card" style={{ padding: 18 }}>
                      <h4 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{meeting.title}</h4>
                      <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: didAttend ? 16 : 0 }}>
                        {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {didAttend && (
                        <Link
                          href={`/meeting/${meeting._id}/report`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          View report
                          <ExternalLink size={13} />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <CommunityWorkspace
            communityId={id}
            isCreator={isCreator}
            workspace={workspace}
          />

          <CommunityFeed communityId={id} />

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(132, 240, 184, 0.16)",
                }}
              >
                <Video size={18} color="var(--accent)" />
              </div>
              <div>
                <p className="stat-label" style={{ marginBottom: 6 }}>
                  Community rhythm
                </p>
                <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.04em" }}>
                  Real-time growth
                </h3>
              </div>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
              This room is designed for regular discussion, reflection, and shared accountability.
            </p>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  letterSpacing: "-0.05em",
                }}
              >
                Members
              </h2>
              <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 700 }}>
                {members.length} total
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {members.map((member) => (
                <div
                  key={member._id}
                  className="card"
                  style={{
                    padding: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        member._id === creator?._id
                          ? "linear-gradient(135deg, rgba(132, 240, 184, 0.18), rgba(245, 184, 109, 0.16))"
                          : "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--border-primary)",
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 700,
                        marginBottom: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {member.name}
                    </p>
                    <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                      {member._id === creator?._id ? "Community host" : member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
