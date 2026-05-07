import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import Meeting from "@/lib/models/Meeting";
import MeetingReport from "@/lib/models/MeetingReport";
import User from "@/lib/models/User";
import { getSession } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const community = await Community.findById(id).lean();
    if (!community) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only creator can view analytics
    if (community.creator?.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // All meetings for this community
    const meetings = await Meeting.find({ community: id }).lean();
    const meetingIds = meetings.map((m) => m._id);

    // Attendance data per meeting (completed ones)
    const completedMeetings = meetings.filter((m) => m.status === "completed" || new Date(m.scheduledAt) < new Date());

    // Aggregate total attendees across all past meetings
    const totalAttendees = completedMeetings.reduce((sum, m) => sum + (m.attendees?.length ?? 0), 0);
    const avgAttendance = completedMeetings.length
      ? Math.round(totalAttendees / completedMeetings.length)
      : 0;

    // Top 5 members by points (from community members)
    const memberIds = (community.members || []).map((m: unknown) => m);
    const topMembers = await User.find({ _id: { $in: memberIds } })
      .select("name role points streak")
      .sort({ points: -1 })
      .limit(5)
      .lean();

    // Average score from all reports in this community
    const reports = await MeetingReport.find({ meetingId: { $in: meetingIds } })
      .select("overallScore clarityScore confidenceScore createdAt")
      .lean();

    const avgScore = reports.length
      ? Math.round(reports.reduce((s, r) => s + r.overallScore, 0) / reports.length)
      : 0;
    const avgClarity = reports.length
      ? Math.round(reports.reduce((s, r) => s + r.clarityScore, 0) / reports.length)
      : 0;

    // Meeting activity over last 8 weeks (session count per week)
    const now = Date.now();
    const weeks: { label: string; count: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now - i * 7 * 86400000);
      const weekEnd = new Date(now - (i - 1) * 7 * 86400000);
      const count = meetings.filter(
        (m) => new Date(m.scheduledAt) >= weekStart && new Date(m.scheduledAt) < weekEnd
      ).length;
      weeks.push({
        label: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count,
      });
    }

    return NextResponse.json({
      totalMeetings: meetings.length,
      completedMeetings: completedMeetings.length,
      upcomingMeetings: meetings.length - completedMeetings.length,
      totalMembers: (community.members || []).length,
      totalReports: reports.length,
      avgAttendance,
      avgScore,
      avgClarity,
      topMembers,
      weeklyActivity: weeks,
    });
  } catch (error) {
    console.error("GET /api/communities/[id]/analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
