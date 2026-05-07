import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Community from "@/lib/models/Community";
import Meeting from "@/lib/models/Meeting";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardGreeting from "@/app/components/DashboardGreeting";
import CalendarWidget from "@/app/components/CalendarWidget";
import {
  Users,
  Trophy,
  Flame,
  Calendar,
  ArrowRight,
  Compass,
  Plus,
  Video,
  Clock,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();
  const user = await User.findById(session.userId)
    .populate({ path: "joinedCommunities", model: Community })
    .populate({ path: "createdCommunity", model: Community });

  if (!user) redirect("/login");

  // Get upcoming meetings for user's communities
  const communityIds = [
    ...(user.joinedCommunities?.map((c: { _id: string }) => c._id) || []),
    ...(user.createdCommunity ? [user.createdCommunity._id] : []),
  ];

  const upcomingMeetings = await Meeting.find({
    community: { $in: communityIds },
    scheduledAt: { $gte: new Date() },
    status: "upcoming",
  })
    .populate("community", "name")
    .populate("host", "name")
    .sort({ scheduledAt: 1 })
    .limit(5)
    .lean();

  const totalCommunities =
    (user.joinedCommunities?.length || 0) + (user.createdCommunity ? 1 : 0);

  const stats = [
    {
      label: "Communities",
      value: totalCommunities,
      icon: Users,
      color: "var(--accent)",
    },
    {
      label: "Points",
      value: user.points || 0,
      icon: Trophy,
      color: "#f59e0b",
    },
    {
      label: "Streak",
      value: `${user.streak || 0}d`,
      icon: Flame,
      color: "#ef4444",
    },
    {
      label: "Meetings",
      value: user.meetingsAttended?.length || 0,
      icon: Calendar,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <DashboardGreeting name={user.name.split(" ")[0]} />

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card" style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{ fontSize: 13, color: "var(--text-muted)" }}
                >
                  {stat.label}
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--radius-md)",
                    background: `radial-gradient(circle at 50% 0%, ${stat.color}40, ${stat.color}10)`,
                    border: `1px solid ${stat.color}30`,
                    boxShadow: `0 4px 12px ${stat.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} color={stat.color} style={{ filter: `drop-shadow(0 2px 4px ${stat.color}50)` }} />
                </div>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700 }}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
        }}
      >
        {/* Upcoming Meetings */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>
              Upcoming Meetings
            </h2>
          </div>

          {upcomingMeetings.length === 0 ? (
            <div
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "64px 24px",
                background: "rgba(255,255,255,0.01)",
              }}
            >
              <div style={{ position: "relative", marginBottom: 20 }}>
                <Video size={48} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                <div style={{ position: "absolute", inset: -20, background: "var(--accent-glow)", filter: "blur(20px)", borderRadius: "50%", zIndex: -1 }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                Your Calendar is Clear
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, maxWidth: 300 }}>
                You don&apos;t have any upcoming meetings. Join a new community to start practicing!
              </p>
              <Link href="/discover" className="btn btn-secondary">
                <Compass size={16} />
                Discover Communities
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
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
                    <p style={{ fontSize: 14, fontWeight: 500 }}>
                      {meeting.title}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Clock size={12} />
                        {new Date(meeting.scheduledAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        {(meeting.community as unknown as { name: string })?.name}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/meeting/${meeting._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Join
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Calendar & Quick Actions */}
        <div>
          <h2
            style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}
          >
            Calendar
          </h2>
          <CalendarWidget meetingDates={upcomingMeetings.map((m) => new Date(m.scheduledAt))} />

          <h2
            style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}
          >
            Quick Actions
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Link
              href="/discover"
              className="card"
              style={{
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  background: "var(--accent-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Compass size={18} color="var(--accent)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  Discover Communities
                </p>
                <p
                  style={{ fontSize: 12, color: "var(--text-muted)" }}
                >
                  Find and join new groups
                </p>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </Link>

            {!user.createdCommunity && (
              <Link
                href="/discover?create=true"
                className="card"
                style={{
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-md)",
                    background: "rgba(59, 130, 246, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={18} color="#3b82f6" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>
                    Create Community
                  </p>
                  <p
                    style={{ fontSize: 12, color: "var(--text-muted)" }}
                  >
                    Start your own group
                  </p>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" />
              </Link>
            )}

            <Link
              href="/leaderboard"
              className="card"
              style={{
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(245, 158, 11, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Trophy size={18} color="#f59e0b" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  Leaderboard
                </p>
                <p
                  style={{ fontSize: 12, color: "var(--text-muted)" }}
                >
                  See top contributors
                </p>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
