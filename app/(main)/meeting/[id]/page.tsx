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

  const meeting = await Meeting.findById(id).lean();

  if (!meeting) {
    redirect("/dashboard");
  }

  const user = await User.findById(session.userId)
    .select("name joinedCommunities createdCommunity")
    .lean();
  if (!user) redirect("/login");

  const community = await Community.findById(meeting.community)
    .select("name creator members")
    .lean();
  if (!community) redirect("/dashboard");

  const isCreator = String(community.creator) === session.userId;
  const isMember =
    isCreator ||
    (community.members as unknown as Array<{ toString(): string }>).some(
      (m) => m.toString() === session.userId
    );

  // Hard gate: only community members (or creator/host) can join meetings.
  if (!isMember) {
    redirect(`/community/${String(community._id)}`);
  }

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const scheduledAtMs = new Date(meeting.scheduledAt).getTime();

  // Allow joining within a small early window; host (creator) can always join.
  const earlyJoinWindowMs = 15 * 60 * 1000;
  const canJoinNow = isCreator || now >= scheduledAtMs - earlyJoinWindowMs;
  if (!canJoinNow) {
    redirect(`/community/${String(community._id)}`);
  }

  return (
    <MeetingRoom
      meetingId={id}
      meetingTitle={meeting.title}
      meetingTopic={meeting.topic || ""}
      communityName={community.name || "Community"}
      communityId={String(community._id)}
      scheduledAtIso={new Date(meeting.scheduledAt).toISOString()}
      userName={user.name}
    />
  );
}
