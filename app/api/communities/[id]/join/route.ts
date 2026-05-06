import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import User from "@/lib/models/User";
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/communities/[id]/join error:", error);
    return NextResponse.json(
      { error: "Failed to join community" },
      { status: 500 }
    );
  }
}
