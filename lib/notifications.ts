import connectDB from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";

type NotificationType = "meeting_reminder" | "new_member" | "badge_earned" | "community_update" | "system";

export async function pushNotification({
  userId,
  type,
  title,
  body,
  href,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
}) {
  try {
    await connectDB();
    await Notification.create({ userId, type, title, body, href: href ?? "" });
  } catch (err) {
    // Non-fatal: log but don't rethrow so callers aren't disrupted
    console.error("[pushNotification] failed:", err);
  }
}

/**
 * Push the same notification to multiple users at once.
 */
export async function pushNotificationToMany({
  userIds,
  type,
  title,
  body,
  href,
}: {
  userIds: string[];
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
}) {
  if (!userIds.length) return;
  try {
    await connectDB();
    const docs = userIds.map((userId) => ({
      userId,
      type,
      title,
      body,
      href: href ?? "",
    }));
    await Notification.insertMany(docs, { ordered: false });
  } catch (err) {
    console.error("[pushNotificationToMany] failed:", err);
  }
}
