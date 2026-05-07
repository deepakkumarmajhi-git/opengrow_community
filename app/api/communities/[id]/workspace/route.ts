import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import { getSession } from "@/lib/session";
import { CommunityWorkspaceSchema } from "@/lib/definitions";

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
    const parsed = CommunityWorkspaceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid workspace fields", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();
    const community = await Community.findById(id);
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    if (community.creator.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    community.pinnedNotes = parsed.data.pinnedNotes.map((note) => ({
      ...note,
      updatedAt: new Date(),
    }));
    community.resources = parsed.data.resources;
    community.announcements = parsed.data.announcements.map((announcement) => ({
      ...announcement,
      createdAt: new Date(),
    }));
    community.weeklyGoals = parsed.data.weeklyGoals;

    await community.save();

    return NextResponse.json({
      workspace: {
        pinnedNotes: community.pinnedNotes,
        resources: community.resources,
        announcements: community.announcements,
        weeklyGoals: community.weeklyGoals,
      },
    });
  } catch (error) {
    console.error("PATCH /api/communities/[id]/workspace error:", error);
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 }
    );
  }
}
