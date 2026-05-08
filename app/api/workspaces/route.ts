import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Workspace from "@/lib/models/Workspace";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const workspaces = await Workspace.find({ owner: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = new Workspace({
      name: name.trim(),
      description: description?.trim() || "",
      owner: session.userId,
      tasks: [],
    });

    await workspace.save();

    // Add workspace to user's workspaces array
    await User.findByIdAndUpdate(session.userId, {
      $push: { workspaces: workspace._id },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}