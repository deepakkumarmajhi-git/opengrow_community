"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Users,
  X,
  Loader2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

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
      const res = await fetch("/api/communities");
      const data = await res.json();
      setCommunities(data.communities || []);
      if (data.currentUserId) setCurrentUserId(data.currentUserId);
    } catch (err) {
      console.error("Failed to fetch communities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCommunities();
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

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          description: form.get("description"),
          category: form.get("category"),
          tags: form.get("tags") || "",
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        fetchCommunities();
      }
    } finally {
      setCreating(false);
    }
  };

  const filtered = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      c.category === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container" style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Ultra Minimal Header */}
      <div style={{ marginBottom: 60, marginTop: 20 }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.05em", marginBottom: 12 }}>
          Discover
        </h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 450 }}>
            Curated spaces for collective growth. Join a community or start your own.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="btn btn-ghost"
            style={{
              fontSize: 14,
              fontWeight: 600,
              border: "1px solid var(--border-primary)",
              padding: "10px 20px"
            }}
          >
            <Plus size={16} /> Create Community
          </button>
        </div>
      </div>

      {/* Minimal Filter Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, gap: 20 }}>
        <div style={{ display: "flex", gap: 24 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: "none",
                border: "none",
                fontSize: 14,
                fontWeight: activeCategory === cat ? 600 : 400,
                color: activeCategory === cat ? "var(--text-primary)" : "var(--text-muted)",
                cursor: "pointer",
                padding: "4px 0",
                position: "relative",
                transition: "color 0.2s"
              }}
            >
              {cat}
              {activeCategory === cat && (
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "var(--text-primary)",
                  borderRadius: 1
                }} />
              )}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: 300 }}>
          <Search size={14} style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "none",
              border: "none",
              borderBottom: "1px solid var(--border-primary)",
              padding: "8px 8px 8px 24px",
              fontSize: 14,
              width: "100%",
              color: "var(--text-primary)",
              outline: "none"
            }}
          />
        </div>
      </div>

      {/* Minimal Grid */}
      {loading ? (
        <div style={{ padding: "100px 0", textAlign: "center" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--text-muted)", margin: "0 auto" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "100px 20px", textAlign: "center", color: "var(--text-muted)" }}>
          No communities found in this category.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 40,
          }}
        >
          {filtered.map((community) => {
            const isMember = community.members.includes(currentUserId);
            const isCreator = community.creator?._id === currentUserId;

            return (
              <div key={community._id} className="minimal-card-wrapper">
                <Link href={`/community/${community._id}`} className="minimal-card-link">
                  <div className="minimal-card-category">{community.category}</div>
                  <h3 className="minimal-card-title">{community.name}</h3>
                  <p className="minimal-card-description">{community.description}</p>

                  <div className="minimal-card-meta">
                    <span className="meta-item">
                      <Users size={12} /> {community.members.length}
                    </span>
                    <span className="meta-dot">•</span>
                    <span className="meta-item">by {community.creator?.name.split(" ")[0]}</span>
                  </div>
                </Link>

                <div className="minimal-card-actions">
                  {isCreator ? (
                    <span className="creator-status">Admin</span>
                  ) : isMember ? (
                    <button onClick={() => handleLeave(community._id)} disabled={actionLoading === community._id} className="minimal-btn-leave">
                      {actionLoading === community._id ? "..." : "Joined"}
                    </button>
                  ) : (
                    <button onClick={() => handleJoin(community._id)} disabled={actionLoading === community._id} className="minimal-btn-join">
                      {actionLoading === community._id ? "..." : "Join"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal - Kept minimal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em" }}>New Community</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <input name="name" placeholder="Community Name" required className="minimal-input" />
              <textarea name="description" placeholder="Description" rows={3} required className="minimal-input" style={{ resize: "none" }} />
              <select name="category" className="minimal-input">
                <option value="communication">Communication</option>
                <option value="personality">Personality</option>
                <option value="technical">Technical</option>
                <option value="general">General</option>
              </select>
              <input name="tags" placeholder="Tags (comma-separated)" className="minimal-input" />
              <button type="submit" disabled={creating} className="btn btn-primary" style={{ height: 48, borderRadius: 8 }}>
                {creating ? "Creating..." : "Launch Community"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .minimal-card-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-primary);
          transition: border-color 0.3s ease;
        }

        .minimal-card-wrapper:hover {
          border-color: var(--text-primary);
        }

        .minimal-card-link {
          text-decoration: none;
          display: flex;
          flex-direction: column;
        }

        .minimal-card-category {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .minimal-card-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }

        .minimal-card-description {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .minimal-card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .meta-dot { font-size: 10px; opacity: 0.5; }
        .meta-item { display: flex; alignItems: center; gap: 4px; }

        .minimal-card-actions {
          position: absolute;
          top: 0;
          right: 0;
        }

        .minimal-btn-join {
          background: none;
          border: 1px solid var(--border-primary);
          color: var(--text-primary);
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .minimal-btn-join:hover {
          background: var(--text-primary);
          color: #000;
          border-color: var(--text-primary);
        }

        .minimal-btn-leave {
          background: none;
          border: 1px solid transparent;
          color: var(--text-muted);
          padding: 6px 0;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .creator-status {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--accent);
          letter-spacing: 0.05em;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
        }

        .minimal-input {
          background: none;
          border: none;
          border-bottom: 1px solid var(--border-primary);
          padding: 12px 0;
          color: var(--text-primary);
          font-size: 16px;
          outline: none;
          width: 100%;
          transition: border-color 0.3s;
        }

        .minimal-input:focus {
          border-color: var(--text-primary);
        }

        select.minimal-input {
          cursor: pointer;
          appearance: none;
        }
      `}</style>
    </div>
  );
}
