"use client";

import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JoinButton({ communityId }: { communityId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/communities/${communityId}/join`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to join community:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="btn btn-primary"
      style={{ padding: "10px 24px" }}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          <UserPlus size={18} />
          Join Community
        </>
      )}
    </button>
  );
}
