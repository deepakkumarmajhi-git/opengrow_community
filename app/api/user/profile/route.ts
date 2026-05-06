import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, avatar } = await request.json();

    await connectDB();
    const updateData: any = {
      name: name?.trim().slice(0, 50),
      bio: bio?.trim().slice(0, 300),
    };

    if (avatar !== undefined) {
      updateData.avatar = avatar; // base64 string
    }

    const user = await User.findByIdAndUpdate(
      session.userId,
      updateData,
      { new: true }
    ).select("-password");

    return NextResponse.json({ user });
  } catch (error) {
    console.error("PUT /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
