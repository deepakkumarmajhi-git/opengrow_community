import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import Meeting from "@/lib/models/Meeting";
import User from "@/lib/models/User";
import { getSession } from "@/lib/session";

// GET community details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const community = await Community.findById(id)
      .populate({ path: "creator", model: User, select: "name email role" })
      .populate({ path: "members", model: User, select: "name email role points" });

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    return NextResponse.json(community);
  } catch (error) {
    console.error("GET /api/communities/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch community" }, { status: 500 });
  }
}

// PATCH update community details
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, category, maxMembers } = body;

    await connectDB();

    const community = await Community.findById(id);
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    // Check if user is the creator
    if (community.creator.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (name) community.name = name;
    if (description) community.description = description;
    if (category) community.category = category;
    if (maxMembers) community.maxMembers = maxMembers;

    await community.save();

    return NextResponse.json(community);
  } catch (error) {
    console.error("PATCH /api/communities/[id] error:", error);
    return NextResponse.json({ error: "Failed to update community" }, { status: 500 });
  }
}

// DELETE community
export async function DELETE(
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

    const community = await Community.findById(id);
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    // Check if user is the creator
    if (community.creator.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Remove community reference from all members
    await User.updateMany(
      { joinedCommunities: id },
      { $pull: { joinedCommunities: id } }
    );

    // Delete all meetings associated with this community
    await Meeting.deleteMany({ community: id });

    // Delete the community
    await Community.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/communities/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete community" }, { status: 500 });
  }
}
