import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Meeting from "@/lib/models/Meeting";
import Community from "@/lib/models/Community";
import { getSession } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { optionIndex } = await request.json();
    if (!Number.isInteger(optionIndex) || optionIndex < 0) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }

    await connectDB();
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const community = await Community.findById(meeting.community).select("creator members");
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    const isCreator = community.creator.toString() === session.userId;
    const isMember = community.members.some(
      (member: { toString(): string }) => member.toString() === session.userId
    );
    if (!isCreator && !isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const option = meeting.availabilityOptions?.[optionIndex];
    if (!option) {
      return NextResponse.json({ error: "Availability option not found" }, { status: 404 });
    }

    const alreadyVoted = option.votes.some(
      (vote: { toString(): string }) => vote.toString() === session.userId
    );
    if (alreadyVoted) {
      option.votes = option.votes.filter(
        (vote: { toString(): string }) => vote.toString() !== session.userId
      );
    } else {
      option.votes.push(session.userId);
    }

    await meeting.save();

    return NextResponse.json({ availabilityOptions: meeting.availabilityOptions });
  } catch (error) {
    console.error("POST /api/meetings/[id]/availability error:", error);
    return NextResponse.json({ error: "Failed to save vote" }, { status: 500 });
  }
}
