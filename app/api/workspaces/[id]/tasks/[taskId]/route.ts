import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Workspace from "@/lib/models/Workspace";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, status, priority, dueDate } = await request.json();

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findOne({
      _id: id,
      owner: session.userId,
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const taskIndex = workspace.tasks.findIndex(
      (task: any) => task._id.toString() === taskId
    );

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    workspace.tasks[taskIndex] = {
      ...workspace.tasks[taskIndex],
      title: title.trim(),
      description: description?.trim() || "",
      status: status || workspace.tasks[taskIndex].status,
      priority: priority || workspace.tasks[taskIndex].priority,
      dueDate: dueDate ? new Date(dueDate) : workspace.tasks[taskIndex].dueDate,
      updatedAt: new Date(),
    };

    await workspace.save();

    return NextResponse.json(workspace.tasks[taskIndex]);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const workspace = await Workspace.findOne({
      _id: id,
      owner: session.userId,
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const taskIndex = workspace.tasks.findIndex(
      (task: any) => task._id.toString() === taskId
    );

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    workspace.tasks.splice(taskIndex, 1);
    await workspace.save();

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}