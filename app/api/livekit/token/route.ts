import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Meeting from "@/lib/models/Meeting";

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
