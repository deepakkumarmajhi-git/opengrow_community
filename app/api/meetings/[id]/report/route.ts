import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MeetingReport from "@/lib/models/MeetingReport";
import Meeting from "@/lib/models/Meeting";
import { getSession } from "@/lib/session";

function generateMockFeedback(ratio: number, filler: number, wpm: number): string {
  let feedback = "### Communication Analysis\n\n";

  if (ratio > 60) {
    feedback += "**Talk-to-Listen Ratio**: You dominated the conversation slightly. Try to pause more and ask open-ended questions to invite others to speak.\n\n";
  } else if (ratio < 40) {
    feedback += "**Talk-to-Listen Ratio**: You were a great listener, but don't be afraid to share your insights more often. The community values your input!\n\n";
  } else {
    feedback += "**Talk-to-Listen Ratio**: Excellent balance! You contributed equally and made space for others.\n\n";
  }

  if (wpm > 160) {
    feedback += "**Pacing**: You spoke quite fast. While energetic, slowing down slightly (aiming for 130-150 WPM) can improve clarity and impact.\n\n";
  } else if (wpm < 110) {
    feedback += "**Pacing**: Your pace was very deliberate. A slightly brisker pace can keep the audience's energy high.\n\n";
  } else {
    feedback += "**Pacing**: Your speaking pace was perfectly in the conversational sweet spot. Very easy to follow.\n\n";
  }

  if (filler > 10) {
    feedback += `**Filler Words**: We detected ${filler} filler words (um, ah, like). Taking a deep breath instead of filling the silence will make you sound more confident.\n\n`;
  } else {
    feedback += "**Filler Words**: Great job avoiding filler words! Your speech sounded polished and intentional.\n\n";
  }

  feedback += "---\n\n*Note: This is an AI-generated analysis based on your audio stream during the meeting.*";
  return feedback;
}

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
    const attended = meeting.attendees.some(
      (a: any) => a.toString() === session.userId
    );
    
    // We allow host or attendees to see their report.
    const isHost = meeting.host.toString() === session.userId;
    if (!attended && !isHost) {
      return NextResponse.json(
        { error: "You did not attend this meeting" },
        { status: 403 }
      );
    }

    let report = await MeetingReport.findOne({
      meetingId,
      userId: session.userId,
    }).lean();

    if (report) {
      return NextResponse.json({ report });
    }

    // --- MOCK AI GENERATION LOGIC ---
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const ratio = Math.floor(Math.random() * 40) + 30; // 30-70%
    const filler = Math.floor(Math.random() * 18) + 2; // 2-20
    const wpm = Math.floor(Math.random() * 60) + 110; // 110-170
    
    // Calculate a rough score based on ideal metrics
    let score = 100;
    score -= Math.abs(50 - ratio) * 0.5; // Penalty for unbalanced talking
    score -= filler * 1.5; // Penalty for filler words
    score -= Math.abs(140 - wpm) * 0.2; // Penalty for extreme pacing
    score = Math.max(Math.min(Math.round(score), 99), 65);

    const feedback = generateMockFeedback(ratio, filler, wpm);

    const newReport = await MeetingReport.create({
      meetingId,
      userId: session.userId,
      talkToListenRatio: ratio,
      fillerWordCount: filler,
      pacingWpm: wpm,
      overallScore: score,
      feedback,
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
