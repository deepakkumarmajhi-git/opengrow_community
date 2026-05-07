import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Meeting from "@/lib/models/Meeting";
import Community from "@/lib/models/Community";
import User from "@/lib/models/User";
import { getSession } from "@/lib/session";
import { MeetingFormSchema } from "@/lib/definitions";
import { pushToFeed } from "@/lib/feed";

function addRecurrence(date: Date, recurrence: string, index: number) {
  const next = new Date(date);
  if (recurrence === "daily") next.setDate(next.getDate() + index);
  if (recurrence === "weekly") next.setDate(next.getDate() + index * 7);
  if (recurrence === "monthly") next.setMonth(next.getMonth() + index);
  return next;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = MeetingFormSchema.safeParse({
      ...body,
      durationMinutes: Number(body.durationMinutes) || 30,
      recurrenceCount: Number(body.recurrenceCount) || 1,
      reminderMinutes: Array.isArray(body.reminderMinutes)
        ? body.reminderMinutes.map(Number)
        : [60, 10],
      availabilityOptions: Array.isArray(body.availabilityOptions)
        ? body.availabilityOptions
        : [],
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid meeting fields", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      communityId,
      title,
      topic,
      scheduledAt,
      durationMinutes,
      template,
      timezone,
      recurrence,
      recurrenceCount,
      reminderMinutes,
      availabilityOptions,
    } = parsed.data;

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

    const baseDate = new Date(scheduledAt);
    if (Number.isNaN(baseDate.getTime())) {
      return NextResponse.json({ error: "Invalid schedule date" }, { status: 400 });
    }

    const groupId = recurrence === "none" ? "" : `og-series-${communityId}-${Date.now()}`;
    const totalMeetings = recurrence === "none" ? 1 : recurrenceCount;
    const meetings = [];

    for (let index = 0; index < totalMeetings; index += 1) {
      const occurrenceDate = addRecurrence(baseDate, recurrence, index);
      const roomId = `og-${communityId}-${Date.now()}-${index}`;
      const meeting = await Meeting.create({
        title: index === 0 ? title : `${title} ${index + 1}`,
        topic: topic || "",
        template,
        community: communityId,
        host: session.userId,
        scheduledAt: occurrenceDate,
        timezone,
        durationMinutes,
        recurrence,
        recurrenceGroupId: groupId,
        reminderMinutes,
        availabilityOptions: availabilityOptions.map((option) => ({
          startsAt: new Date(option),
          votes: [],
        })),
        roomId,
      });
      meetings.push(meeting);
      community.meetings.push(meeting._id);
    }

    await community.save();

    const user = await User.findById(session.userId).select("name");

    await pushToFeed({
      communityId,
      userId: session.userId,
      userName: user?.name || "Host",
      type: "meeting_scheduled",
      content: `scheduled a new session: "${title}"`,
      metadata: { meetingId: meetings[0]._id },
    });

    return NextResponse.json({ meeting: meetings[0], meetings }, { status: 201 });
  } catch (error) {
    console.error("POST /api/meetings error:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
