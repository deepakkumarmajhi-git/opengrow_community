import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Meeting from "@/lib/models/Meeting";
import MeetingReport from "@/lib/models/MeetingReport";
import Community from "@/lib/models/Community";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const reports = await MeetingReport.find({ userId: session.userId })
      .populate({
        path: "meetingId",
        model: Meeting,
        select: "title topic scheduledAt template community",
        populate: { path: "community", model: Community, select: "name" },
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ timeline: reports });
  } catch (error) {
    console.error("GET /api/user/growth error:", error);
    return NextResponse.json(
      { error: "Failed to load growth timeline" },
      { status: 500 }
    );
  }
}
