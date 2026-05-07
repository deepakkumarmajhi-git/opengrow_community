import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Meeting from "@/lib/models/Meeting";
import Community from "@/lib/models/Community";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get("meetingId");

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.userId);
    const meeting = await Meeting.findById(meetingId);

    if (!user || !meeting) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const community = await Community.findById(meeting.community)
      .select("creator members")
      .lean();
    if (!community) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isCreator = String(community.creator) === session.userId;
    const isMember =
      isCreator ||
      (community.members as unknown as Array<{ toString(): string }>).some(
        (m) => m.toString() === session.userId
      );

    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Time gate matches the meeting page (host can always join).
    const now = Date.now();
    const scheduledAtMs = new Date(meeting.scheduledAt).getTime();
    const earlyJoinWindowMs = 15 * 60 * 1000;
    if (!isCreator && now < scheduledAtMs - earlyJoinWindowMs) {
      return NextResponse.json(
        { error: "Meeting has not started yet" },
        { status: 403 }
      );
    }

    const roomName = meeting.roomId;
    const participantName = user.name;

    // Check if LiveKit keys are present
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit credentials not configured" },
        { status: 500 }
      );
    }

    const durationMs = (meeting.durationMinutes || 30) * 60 * 1000;
    const endMs = scheduledAtMs + durationMs;
    const nextStatus =
      now > endMs ? "completed" : now >= scheduledAtMs ? "active" : "upcoming";

    const attendanceUpdate = await Meeting.updateOne(
      { _id: meetingId, attendees: { $ne: session.userId } },
      { $addToSet: { attendees: session.userId }, status: nextStatus }
    );

    if (attendanceUpdate.modifiedCount === 0) {
      await Meeting.updateOne({ _id: meetingId }, { status: nextStatus });
      await User.findByIdAndUpdate(session.userId, {
        lastActiveDate: new Date(),
      });
    } else {
      await User.findByIdAndUpdate(session.userId, {
        $addToSet: { meetingsAttended: meetingId },
        $inc: { points: 10 },
        lastActiveDate: new Date(),
      });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user._id.toString(),
      name: participantName,
    });

    at.addGrant({ roomJoin: true, room: roomName });

    return NextResponse.json({ token: await at.toJwt() });
  } catch (error) {
    console.error("GET /api/livekit/token error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
