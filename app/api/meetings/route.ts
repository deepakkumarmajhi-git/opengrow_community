import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Meeting from "@/lib/models/Meeting";
import Community from "@/lib/models/Community";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { communityId, title, topic, scheduledAt, durationMinutes } =
      await request.json();

    if (!communityId || !title || !scheduledAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const community = await Community.findById(communityId);
    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      );
    }

    // Only creator can schedule meetings
    if (community.creator.toString() !== session.userId) {
      return NextResponse.json(
        { error: "Only the community creator can schedule meetings" },
        { status: 403 }
      );
    }

    const roomId = `og-${communityId}-${Date.now()}`;

    const meeting = await Meeting.create({
      title,
      topic: topic || "",
      community: communityId,
      host: session.userId,
      scheduledAt: new Date(scheduledAt),
      durationMinutes: durationMinutes || 30,
      roomId,
    });

    community.meetings.push(meeting._id);
    await community.save();

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    console.error("POST /api/meetings error:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
