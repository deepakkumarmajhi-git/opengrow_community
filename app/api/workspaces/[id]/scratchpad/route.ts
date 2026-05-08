import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Workspace from "@/lib/models/Workspace";
import { getSession } from "@/lib/session";

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
    const { scratchpad } = await request.json();

    await connectDB();
    const result = await Workspace.updateOne(
      { _id: id, owner: session.userId },
      { $set: { scratchpad } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/workspaces/[id]/scratchpad error:", error);
    return NextResponse.json(
      { error: "Failed to update scratchpad" },
      { status: 500 }
    );
  }
}
