import connectDB from "@/lib/mongodb";
import FeedItem from "@/lib/models/FeedItem";

type FeedType = "join" | "meeting_scheduled" | "meeting_completed" | "goal_completed" | "announcement";

export async function pushToFeed({
  communityId,
  userId,
  userName,
  type,
  content,
  metadata = {},
}: {
  communityId: string;
  userId: string;
  userName: string;
  type: FeedType;
  content: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await connectDB();
    await FeedItem.create({
      communityId,
      userId,
      userName,
      type,
      content,
      metadata,
    });
  } catch (err) {
    console.error("[pushToFeed] failed:", err);
  }
}
