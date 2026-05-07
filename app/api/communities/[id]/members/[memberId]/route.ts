import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import User from "@/lib/models/User";
import { getSession } from "@/lib/session";

// DELETE remove a member from community
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, memberId } = await params;
    await connectDB();

    const community = await Community.findById(id);
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    // Check if user is the creator (Admin)
    if (community.creator.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cannot remove the creator
    if (memberId === community.creator.toString()) {
      return NextResponse.json({ error: "Cannot remove the admin" }, { status: 400 });
    }

    // Remove community reference from the member's user document
    await User.findByIdAndUpdate(memberId, {
      $pull: { joinedCommunities: id },
    });

    // Remove member from the community document
    community.members = community.members.filter(
      (m: unknown) => String(m) !== memberId
    );
    await community.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/communities/[id]/members/[memberId] error:", error);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
