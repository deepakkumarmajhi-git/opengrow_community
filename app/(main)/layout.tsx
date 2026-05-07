import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Sidebar from "@/app/components/Sidebar";

import Community from "@/lib/models/Community";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();
  const user = await User.findById(session.userId)
    .select("name email role points joinedCommunities createdCommunity")
    .populate({ path: "joinedCommunities", model: Community, select: "name _id" })
    .populate({ path: "createdCommunity", model: Community, select: "name _id" });

  if (!user) {
    redirect("/login");
  }

  // Combine created and joined communities into one array
  const joined = user.joinedCommunities || [];
  const created = user.createdCommunity ? [user.createdCommunity] : [];

  // Deduplicate just in case
  const allCommunitiesMap = new Map();
  [...created, ...joined].forEach((c) => {
    if (c && c._id) allCommunitiesMap.set(c._id.toString(), { _id: c._id.toString(), name: c.name });
  });

  const userCommunities = Array.from(allCommunitiesMap.values());

  const userData = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    points: user.points,
    communities: userCommunities,
  };

  return (
    <div className="app-shell">
      <Sidebar user={userData} />
      <main
        className="app-main"
        style={{
          flex: 1,
          background: "transparent",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
