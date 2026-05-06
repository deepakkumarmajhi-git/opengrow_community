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

    community.members = community.members.filter(
      (m: { toString: () => string }) => m.toString() !== session.userId
    );
    await community.save();

    user.joinedCommunities = user.joinedCommunities.filter(
      (c: { toString: () => string }) => c.toString() !== id
    );
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/communities/[id]/leave error:", error);
    return NextResponse.json(
      { error: "Failed to leave community" },
      { status: 500 }
    );
  }
}
