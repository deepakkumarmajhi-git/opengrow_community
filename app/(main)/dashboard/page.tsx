import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Calendar,
  Flame,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import DashboardGreeting from "@/app/components/DashboardGreeting";
import CalendarWidget from "@/app/components/CalendarWidget";
import OnboardingChecklist from "@/app/components/OnboardingChecklist";
import SparklineChart from "@/app/components/SparklineChart";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import Meeting from "@/lib/models/Meeting";
import MeetingReport from "@/lib/models/MeetingReport";
import User from "@/lib/models/User";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();
  const user = await User.findById(session.userId)
    .populate({ path: "joinedCommunities", model: Community, select: "name _id" })
    .populate({ path: "createdCommunity", model: Community, select: "name _id" })
    .lean();

  if (!user) redirect("/login");

  const hasReport = await MeetingReport.exists({ userId: session.userId });

  const onboardingSteps = [
    {
      id: "role",
      label: "Set your identity",
      completed: !!user.role,
      href: "/profile",
    },
    {
      id: "community",
      label: "Join a community",
      completed: (user.joinedCommunities?.length || 0) > 0 || !!user.createdCommunity,
      href: "/discover",
    },
    {
      id: "meeting",
      label: "Attend a room",
      completed: (user.meetingsAttended?.length || 0) > 0,
      href: "/discover",
    },
    {
      id: "report",
      label: "Review insights",
      completed: !!hasReport,
      href: "/profile",
    },
  ];

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
      <header style={{ marginBottom: 40 }}>
        <DashboardGreeting name={user.name.split(" ")[0]} role={user.role} />
      </header>

      <OnboardingChecklist steps={onboardingSteps} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 20,
          marginBottom: 48,
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="card" style={{ padding: "20px 24px", minHeight: "auto" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span className="stat-label" style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{stat.label}</span>
                <Icon size={14} color="var(--text-muted)" style={{ opacity: 0.5 }} />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)"
                  }}
                >
                  {stat.value}
                </span>
                {stat.label === "Points" && (
                  <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 500 }}>
                    +12%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 40,
          alignItems: "start",
        }}
      >
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Upcoming Sessions
            </h2>
            <Link href="/discover" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {upcomingMeetings.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: "48px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--bg-secondary)",
                  textAlign: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-muted)"
                  }}
                >
                  <Video size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>No upcoming sessions</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Join a community to see scheduled rooms here.</p>
                </div>
                <Link href="/discover" className="btn btn-primary btn-sm">
                  Explore Communities
                </Link>
              </div>
            ) : (
              upcomingMeetings.map((meeting: any) => (
                <div
                  key={String(meeting._id)}
                  className="card"
                  style={{
                    padding: "16px 20px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "var(--bg-tertiary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        flexShrink: 0
                      }}
                    >
                      {meeting.community.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{meeting.title}</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 12 }}>
                        <span>{meeting.community.name}</span>
                        <span>•</span>
                        <span>{new Date(meeting.scheduledAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/community/${meeting.community._id}?room=${meeting._id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Details
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        <aside style={{ display: "grid", gap: 32 }}>
          <section>
            <CalendarWidget meetingDates={upcomingMeetings.map(m => new Date(m.scheduledAt))} />
          </section>

          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>Recent Activity</h2>
            </div>
            <div className="card" style={{ padding: "20px", background: "var(--bg-secondary)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {user.joinedCommunities?.length > 0 ? (
                  user.joinedCommunities.slice(0, 3).map((community: any) => (
                    <div key={community._id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 6, height: 6, borderRadius: 100, background: "var(--success)" }} />
                      <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        Joined <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{community.name}</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>No recent activity.</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="card" style={{ background: "var(--bg-tertiary)", border: "none", padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Weekly Insights</h3>
              <SparklineChart scores={[68, 72, 70, 75, 78, 82]} />
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 16, lineHeight: 1.5 }}>
                Your speaking presence is up by 12% compared to last week. Keep it up!
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
