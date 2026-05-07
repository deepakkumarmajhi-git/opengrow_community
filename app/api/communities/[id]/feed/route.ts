import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FeedItem from "@/lib/models/FeedItem";
import { getSession } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const feed = await FeedItem.find({ communityId: id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ feed });
  } catch (error) {
    console.error("GET /api/communities/[id]/feed error:", error);
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}
