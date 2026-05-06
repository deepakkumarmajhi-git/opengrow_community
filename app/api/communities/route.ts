import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Community from "@/lib/models/Community";
import User from "@/lib/models/User";
import { getSession } from "@/lib/session";
import { CommunityFormSchema } from "@/lib/definitions";

export async function GET() {
  try {
    const session = await getSession();
    await connectDB();

    const communities = await Community.find()
      .populate({ path: "creator", model: User, select: "name _id" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      communities,
      currentUserId: session?.userId || "",
    });
  } catch (error) {
    console.error("GET /api/communities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = CommunityFormSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === "free" && user.createdCommunity) {
      return NextResponse.json(
        { error: "Free plan users can create exactly 1 community. Upgrade for unlimited access." },
        { status: 403 }
      );
    }

    const { name, description, category, tags } = validated.data;
    const tagArray = tags
      ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    const community = await Community.create({
      name,
      description,
      category,
      tags: tagArray,
      creator: user._id,
      members: [user._id],
    });

    user.createdCommunity = community._id;
    user.points += 50;
    await user.save();

    return NextResponse.json({ community }, { status: 201 });
  } catch (error) {
    console.error("POST /api/communities error:", error);
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    );
  }
}
