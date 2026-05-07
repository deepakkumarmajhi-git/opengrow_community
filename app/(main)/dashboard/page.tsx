import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Clock,
  Compass,
  Flame,
  Plus,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import DashboardGreeting from "@/app/components/DashboardGreeting";
import CalendarWidget from "@/app/components/CalendarWidget";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import Meeting from "@/lib/models/Meeting";
import User from "@/lib/models/User";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();
  const user = await User.findById(session.userId)
    .populate({ path: "joinedCommunities", model: Community })
    .populate({ path: "createdCommunity", model: Community });

  if (!user) redirect("/login");

  const communityIds = [
    ...(user.joinedCommunities?.map((community: { _id: string }) => community._id) || []),
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
      accent: "rgba(132, 240, 184, 0.18)",
      color: "var(--accent)",
    },
    {
      label: "Points",
      value: user.points || 0,
      icon: Trophy,
      accent: "rgba(245, 184, 109, 0.18)",
      color: "var(--accent-warm)",
    },
    {
      label: "Streak",
      value: `${user.streak || 0}d`,
      icon: Flame,
      accent: "rgba(255, 133, 116, 0.16)",
      color: "var(--danger)",
    },
    {
      label: "Meetings",
      value: user.meetingsAttended?.length || 0,
      icon: Calendar,
      accent: "rgba(109, 184, 255, 0.18)",
      color: "var(--info)",
    },
  ];

  return (
    <div className="page-container">
      <DashboardGreeting name={user.name.split(" ")[0]} />

      <div
        className="dashboard-stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 30,
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="card" style={{ minHeight: 170 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <span className="stat-label">{stat.label}</span>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: stat.accent,
                    border: "1px solid var(--border-primary)",
                  }}
                >
                  <Icon size={18} color={stat.color} />
                </div>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.95,
                  marginBottom: 10,
                }}
              >
                {stat.value}
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                Snapshot of your current activity.
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="dashboard-main-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(320px, 0.9fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 14,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <p className="stat-label" style={{ marginBottom: 8 }}>
                Upcoming
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 30,
                  letterSpacing: "-0.05em",
                }}
              >
                Your next live sessions
              </h2>
            </div>
            <Link href="/discover" className="btn btn-secondary btn-sm">
              Explore more communities
            </Link>
          </div>

          {upcomingMeetings.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "40px clamp(22px, 4vw, 34px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, rgba(132, 240, 184, 0.2), rgba(245, 184, 109, 0.16))",
                }}
              >
                <Video size={26} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  letterSpacing: "-0.04em",
                }}
              >
                Your calendar is open.
              </h3>
              <p style={{ maxWidth: 420, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Join a new community or schedule a room so your next practice
                session has a home.
              </p>
              <Link href="/discover" className="btn btn-primary">
                Discover communities
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {upcomingMeetings.map((meeting) => (
                <div
                  key={String(meeting._id)}
                  className="card dashboard-meeting-row"
                  style={{
                    padding: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 18,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p className="stat-label" style={{ marginBottom: 8 }}>
                      {(meeting.community as unknown as { name: string })?.name}
                    </p>
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        marginBottom: 8,
                      }}
                    >
                      {meeting.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        flexWrap: "wrap",
                        color: "var(--text-secondary)",
                        fontSize: 13,
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Clock size={14} />
                        {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>Hosted by {(meeting.host as unknown as { name: string })?.name}</span>
                    </div>
                  </div>
                  <Link href={`/meeting/${meeting._id}`} className="btn btn-primary btn-sm">
                    Join room
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside>
          <CalendarWidget meetingDates={upcomingMeetings.map((item) => new Date(item.scheduledAt))} />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/discover"
              className="card"
              style={{
                padding: 18,
                display: "flex",
                alignItems: "center",
                gap: 14,
                textDecoration: "none",
              }}
            >
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
                <Compass size={18} color="var(--accent)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>Discover communities</p>
                <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  Find your next room to join.
                </p>
              </div>
              <ArrowRight size={16} />
            </Link>

            {!user.createdCommunity && (
              <Link
                href="/discover?create=true"
                className="card"
                style={{
                  padding: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(245, 184, 109, 0.16)",
                  }}
                >
                  <Plus size={18} color="var(--accent-warm)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>Create a community</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                    Start your own growth space.
                  </p>
                </div>
                <ArrowRight size={16} />
              </Link>
            )}

            <Link
              href="/leaderboard"
              className="card"
              style={{
                padding: 18,
                display: "flex",
                alignItems: "center",
                gap: 14,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(109, 184, 255, 0.16)",
                }}
              >
                <Trophy size={18} color="var(--info)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>See the leaderboard</p>
                <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  Track the most active members.
                </p>
              </div>
              <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
