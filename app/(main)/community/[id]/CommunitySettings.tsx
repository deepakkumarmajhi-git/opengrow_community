"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Settings, Trash2, UserMinus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Member {
  _id: string;
  name: string;
  role: string;
  points: number;
}

interface Community {
  _id: string;
  name: string;
  description: string;
  category: string;
  maxMembers: number;
}

export default function CommunitySettings({
  community,
  members,
}: {
  community: Community;
  members: Member[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"edit" | "members" | "delete" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: community.name,
    description: community.description,
    category: community.category,
    maxMembers: community.maxMembers,
  });
  const [memberList, setMemberList] = useState(members);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/communities/${community._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setActiveModal(null);
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update community");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/communities/${community._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/discover");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete community");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const response = await fetch(`/api/communities/${community._id}/members/${memberId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMemberList((current) => current.filter((member) => member._id !== memberId));
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to remove member");
      }
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen((open) => !open)} className="btn btn-secondary btn-sm">
        <Settings size={16} />
        Manage
      </button>

      {isOpen && (
        <div
          className="card"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 240,
            zIndex: 20,
            padding: 8,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveModal("edit");
              setIsOpen(false);
            }}
            className="dropdown-item"
            style={menuButtonStyle}
          >
            <Settings size={15} />
            Edit details
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveModal("members");
              setIsOpen(false);
            }}
            className="dropdown-item"
            style={menuButtonStyle}
          >
            <Users size={15} />
            Manage members
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveModal("delete");
              setIsOpen(false);
            }}
            className="dropdown-item"
            style={{ ...menuButtonStyle, color: "var(--danger)" }}
          >
            <Trash2 size={15} />
            Delete community
          </button>
        </div>
      )}

      {activeModal && (
        <div
          onClick={() => !isLoading && setActiveModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(4, 11, 9, 0.78)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            className="card"
            style={{
              width: activeModal === "members" ? "min(620px, 100%)" : "min(540px, 100%)",
              maxHeight: "90vh",
              overflow: "auto",
              padding: 28,
            }}
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
                  Community Controls
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    letterSpacing: "-0.05em",
                  }}
                >
                  {activeModal === "edit" && "Edit community"}
                  {activeModal === "members" && "Manage members"}
                  {activeModal === "delete" && "Delete community"}
                </h3>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className="btn btn-ghost btn-sm">
                <X size={16} />
              </button>
            </div>

            {activeModal === "edit" && (
              <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className="label">Community Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input"
                    value={formData.description}
                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="settings-fields-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
                  <div>
                    <label className="label">Category</label>
                    <select
                      className="input"
                      value={formData.category}
                      onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                    >
                      <option value="communication">Communication</option>
                      <option value="personality">Personality</option>
                      <option value="technical">Technical</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Member Limit</label>
                    <input
                      type="number"
                      className="input"
                      value={formData.maxMembers}
                      onChange={(event) =>
                        setFormData({ ...formData, maxMembers: parseInt(event.target.value, 10) })
                      }
                      min={2}
                      max={100}
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="btn btn-primary">
                  {isLoading ? "Saving..." : "Save changes"}
                </button>
              </form>
            )}

            {activeModal === "members" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {memberList.length === 0 ? (
                  <div className="card" style={{ padding: 28, textAlign: "center" }}>
                    <Users size={28} style={{ margin: "0 auto 12px" }} />
                    <p style={{ color: "var(--text-secondary)" }}>No other members yet.</p>
                  </div>
                ) : (
                  memberList.map((member) => (
                    <div
                      key={member._id}
                      className="card"
                      style={{
                        padding: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 14,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid var(--border-primary)",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, marginBottom: 4 }}>{member.name}</p>
                          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                            {member.role} - {member.points} points
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMember(member._id)}
                        className="remove-member-btn"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 14,
                          border: "1px solid rgba(255, 133, 116, 0.22)",
                          background: "rgba(255, 133, 116, 0.08)",
                          color: "var(--danger)",
                          cursor: "pointer",
                        }}
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeModal === "delete" && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: 24,
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255, 133, 116, 0.12)",
                    color: "var(--danger)",
                  }}
                >
                  <AlertTriangle size={30} />
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20 }}>
                  This will permanently remove <strong>{community.name}</strong> and
                  all of its scheduled meetings.
                </p>
                <div className="settings-danger-actions" style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setActiveModal(null)} className="btn btn-secondary">
                    Keep community
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="btn"
                    style={{
                      background: "var(--danger)",
                      color: "#190806",
                    }}
                  >
                    {isLoading ? "Deleting..." : "Delete permanently"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const menuButtonStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 12px",
  border: "none",
  borderRadius: 14,
  background: "transparent",
  color: "var(--text-primary)",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  textAlign: "left",
};
