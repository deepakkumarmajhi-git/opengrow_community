import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Meeting from "@/lib/models/Meeting";
import Community from "@/lib/models/Community";
import { getSession } from "@/lib/session";

function formatIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const meeting = await Meeting.findById(id).lean();
  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }

  const community = await Community.findById(meeting.community).select("name creator members").lean();
  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  const isCreator = String(community.creator) === session.userId;
  const isMember = (community.members as unknown as Array<{ toString(): string }>).some(
    (member) => member.toString() === session.userId
  );
  if (!isCreator && !isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const start = new Date(meeting.scheduledAt);
  const end = new Date(start.getTime() + (meeting.durationMinutes || 30) * 60 * 1000);
  const origin = new URL(request.url).origin;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OpenGrow//Meetings//EN",
    "BEGIN:VEVENT",
    `UID:${meeting._id}@opengrow`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(meeting.title)}`,
    `DESCRIPTION:${escapeIcsText(`${meeting.topic || "Open discussion"}\\nCommunity: ${community.name}`)}`,
    `URL:${origin}/meeting/${meeting._id}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="opengrow-${meeting._id}.ics"`,
    },
  });
}
