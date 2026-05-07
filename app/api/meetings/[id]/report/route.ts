import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MeetingReport from "@/lib/models/MeetingReport";
import Meeting from "@/lib/models/Meeting";
import { getSession } from "@/lib/session";
import { generateCoachReport } from "@/lib/coach";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: meetingId } = await params;
    await connectDB();

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Check if user attended the meeting
    const attended = (meeting.attendees as unknown as Array<{ toString(): string }>).some(
      (a) => a.toString() === session.userId
    );
    
    // We allow host or attendees to see their report.
    const isHost = meeting.host.toString() === session.userId;
    if (!attended && !isHost) {
      return NextResponse.json(
        { error: "You did not attend this meeting" },
        { status: 403 }
      );
    }

    const report = await MeetingReport.findOne({
      meetingId,
      userId: session.userId,
    }).lean();

    if (report) {
      return NextResponse.json({ report });
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const coachReport = generateCoachReport(`${meetingId}:${session.userId}:${meeting.title}`);

    const newReport = await MeetingReport.create({
      meetingId,
      userId: session.userId,
      ...coachReport,
    });

    return NextResponse.json({ report: newReport }, { status: 201 });
  } catch (error) {
    console.error("GET /api/meetings/[id]/report error:", error);
    return NextResponse.json(
      { error: "Failed to fetch or generate report" },
      { status: 500 }
    );
  }
}
