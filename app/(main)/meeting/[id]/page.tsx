import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Meeting from "@/lib/models/Meeting";
import Community from "@/lib/models/Community";
import User from "@/lib/models/User";
import { redirect } from "next/navigation";
import MeetingRoom from "@/app/components/MeetingRoom";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();

  const meeting = await Meeting.findById(id)
    .populate({ path: "community", model: Community, select: "name" })
    .lean();

  if (!meeting) {
    redirect("/dashboard");
  }

  const user = await User.findById(session.userId).select("name").lean();
  if (!user) redirect("/login");

  // Mark user as attending
  await Meeting.findByIdAndUpdate(id, {
    $addToSet: { attendees: session.userId },
    status: "active",
  });

  // Update user stats
  await User.findByIdAndUpdate(session.userId, {
    $addToSet: { meetingsAttended: id },
    $inc: { points: 10 },
    lastActiveDate: new Date(),
  });

  const communityData = meeting.community as unknown as { name: string };

  return (
    <MeetingRoom
      meetingId={id}
      meetingTitle={meeting.title}
      meetingTopic={meeting.topic || ""}
      communityName={communityData?.name || "Community"}
      userName={user.name}
    />
  );
}
