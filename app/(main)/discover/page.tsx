"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Loader2,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";

interface CommunityData {
  _id: string;
  name: string;
  description: string;
  category: string;
  members: string[];
  maxMembers: number;
  tags: string[];
  creator: { _id: string; name: string };
}

const categories = ["All", "Communication", "Personality", "Technical", "General"];

export default function DiscoverPage() {
  const [communities, setCommunities] = useState<CommunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");

  const fetchCommunities = useCallback(async () => {
    try {
      const response = await fetch("/api/communities");
      const data = await response.json();
      setCommunities(data.communities || []);
      if (data.currentUserId) setCurrentUserId(data.currentUserId);
    } catch (error) {
      console.error("Failed to fetch communities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadCommunities = async () => {
      await fetchCommunities();
    };

    void loadCommunities();
  }, [fetchCommunities]);

  const handleJoin = async (communityId: string) => {
    setActionLoading(communityId);
    try {
      await fetch(`/api/communities/${communityId}/join`, { method: "POST" });
      fetchCommunities();
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (communityId: string) => {
    setActionLoading(communityId);
    try {
      await fetch(`/api/communities/${communityId}/leave`, { method: "POST" });
      fetchCommunities();
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          description: form.get("description"),
          category: form.get("category"),
          tags: form.get("tags") || "",
        }),
      });

      if (response.ok) {
        setShowCreate(false);
        fetchCommunities();
      }
    } finally {
      setCreating(false);
    }
  };

  const filtered = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(search.toLowerCase()) ||
      community.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || community.category === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      <div
        className="card"
        style={{
          marginBottom: 24,
          padding: "28px clamp(22px, 4vw, 34px)",
          background:
            "linear-gradient(135deg, rgba(132, 240, 184, 0.14), rgba(245, 184, 109, 0.08)), var(--bg-card)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <span className="eyebrow" style={{ marginBottom: 14 }}>
              Discover
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(34px, 5vw, 56px)",
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
                marginBottom: 12,
              }}
            >
              Find a room worth showing up to.
            </h1>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: 16 }}>
              Browse active communities, filter by the kind of growth you want,
              and join spaces where members are already practicing together.
            </p>
          </div>

          <button type="button" onClick={() => setShowCreate(true)} className="btn btn-primary">
            <Plus size={16} />
            Create community
          </button>
        </div>
      </div>

      <div
        className="discover-filter-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          marginBottom: 24,
        }}
      >
        <div className="discover-category-row" style={{ display: "flex", gap: 10 }}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "btn btn-secondary btn-sm" : "btn btn-ghost btn-sm"}
              style={{ whiteSpace: "nowrap" }}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", width: "min(320px, 100%)" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              top: "50%",
              left: 14,
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search communities"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input"
            style={{ paddingLeft: 40 }}
          />
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <Loader2 size={26} className="animate-spin" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-secondary)" }}>Loading communities...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)" }}>
            No communities match this view yet. Try another category or create your own.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: 18,
          }}
        >
          {filtered.map((community) => {
            const isMember = community.members.includes(currentUserId);
            const isCreator = community.creator?._id === currentUserId;

            return (
              <div
                key={community._id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 20,
                  minHeight: 260,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 18,
                    }}
                  >
                    <span className="badge-outline">{community.category}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 700 }}>
                      {community.members.length}/{community.maxMembers}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      letterSpacing: "-0.04em",
                      marginBottom: 10,
                    }}
                  >
                    {community.name}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: 15 }}>
                    {community.description}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      color: "var(--text-secondary)",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Users size={14} />
                      {community.members.length} members
                    </span>
                    <span>By {community.creator?.name.split(" ")[0]}</span>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Link href={`/community/${community._id}`} className="btn btn-secondary btn-sm">
                      View details
                      <ArrowRight size={14} />
                    </Link>

                    {isCreator ? (
                      <span className="btn btn-ghost btn-sm" style={{ cursor: "default" }}>
                        Host
                      </span>
                    ) : isMember ? (
                      <button
                        type="button"
                        onClick={() => handleLeave(community._id)}
                        disabled={actionLoading === community._id}
                        className="btn btn-ghost btn-sm"
                      >
                        {actionLoading === community._id ? "Leaving..." : "Joined"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleJoin(community._id)}
                        disabled={actionLoading === community._id}
                        className="btn btn-primary btn-sm"
                      >
                        {actionLoading === community._id ? "Joining..." : "Join"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <div
          onClick={() => setShowCreate(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(4, 11, 9, 0.76)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            className="card"
            style={{ width: "min(520px, 100%)", padding: 28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 22,
              }}
            >
              <div>
                <p className="stat-label" style={{ marginBottom: 8 }}>
                  New space
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    letterSpacing: "-0.05em",
                  }}
                >
                  Create a community
                </h2>
              </div>
              <button type="button" onClick={() => setShowCreate(false)} className="btn btn-ghost btn-sm">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label">Community Name</label>
                <input name="name" placeholder="Open discussion circle" required className="input" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  name="description"
                  placeholder="What makes this community valuable to join?"
                  rows={4}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="label">Category</label>
                <select name="category" className="input">
                  <option value="communication">Communication</option>
                  <option value="personality">Personality</option>
                  <option value="technical">Technical</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="label">Tags</label>
                <input name="tags" placeholder="leadership, speaking, product" className="input" />
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" disabled={creating} className="btn btn-primary">
                  {creating ? "Creating..." : "Launch community"}
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
