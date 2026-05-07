import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import User from "@/lib/models/User";
import { getSession } from "@/lib/session";
import { pushNotification } from "@/lib/notifications";
import { pushToFeed } from "@/lib/feed";

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
    await connectDB();

    const user = await User.findById(session.userId);
    const community = await Community.findById(id);

    if (!user || !community) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (user.plan === "free" && user.joinedCommunities.length >= 3) {
      return NextResponse.json(
        { error: "Free plan users can join a maximum of 3 communities. Upgrade for unlimited access." },
        { status: 403 }
      );
    }

    if (community.members.length >= community.maxMembers) {
      return NextResponse.json(
        { error: "Community is full" },
        { status: 400 }
      );
    }

    const alreadyMember = community.members.some(
      (m: { toString: () => string }) => m.toString() === session.userId
    );
    if (alreadyMember) {
      return NextResponse.json(
        { error: "Already a member" },
        { status: 400 }
      );
    }

    community.members.push(user._id);
    await community.save();

    user.joinedCommunities.push(community._id);
    user.points += 10;
    await user.save();

    // Notify joiner (welcome)
    await pushNotification({
      userId: session.userId,
      type: "community_update",
      title: `Welcome to ${community.name}!`,
      body: "You've joined the community. Explore the rooms and introduce yourself.",
      href: `/community/${community._id}`,
    });

    // Notify community creator (new member alert)
    const creatorId = community.creator?.toString();
    if (creatorId && creatorId !== session.userId) {
      await pushNotification({
        userId: creatorId,
        type: "new_member",
        title: "New member joined!",
        body: `${user.name} just joined ${community.name}. Say hello!`,
        href: `/community/${community._id}`,
      });
    }

    // Log to community feed
    await pushToFeed({
      communityId: id,
      userId: session.userId,
      userName: user.name,
      type: "join",
      content: "joined the community",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/communities/[id]/join error:", error);
    return NextResponse.json(
      { error: "Failed to join community" },
      { status: 500 }
    );
  }
}
