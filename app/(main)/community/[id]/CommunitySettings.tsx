"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MoreVertical, 
  Settings, 
  Users, 
  Trash2, 
  X, 
  UserMinus, 
  Save, 
  AlertTriangle 
} from "lucide-react";
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
  members 
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
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/communities/${community._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setActiveModal(null);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update community");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/communities/${community._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/discover");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete community");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    try {
      const res = await fetch(`/api/communities/${community._id}/members/${memberId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMemberList(memberList.filter(m => m._id !== memberId));
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove member");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary"
        style={{ 
          padding: 8, 
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--border-primary)"
        }}
      >
        <Settings size={18} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 8,
            width: 220,
            background: "#0a0a0c",
            border: "1px solid var(--border-primary)",
            borderRadius: 12,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
            zIndex: 50,
            padding: 6,
            overflow: "hidden"
          }}
        >
          <button
            onClick={() => { setActiveModal("edit"); setIsOpen(false); }}
            className="dropdown-item"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 12, 
              width: "100%", 
              padding: "10px 14px", 
              borderRadius: 8,
              textAlign: "left",
              fontSize: 13,
              fontWeight: 500,
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            <Settings size={14} style={{ opacity: 0.6 }} />
            Edit Community Details
          </button>
          <button
            onClick={() => { setActiveModal("members"); setIsOpen(false); }}
            className="dropdown-item"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 12, 
              width: "100%", 
              padding: "10px 14px", 
              borderRadius: 8,
              textAlign: "left",
              fontSize: 13,
              fontWeight: 500,
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            <Users size={14} style={{ opacity: 0.6 }} />
            Manage Members
          </button>
          <div style={{ height: 1, background: "var(--border-primary)", margin: "4px 8px" }} />
          <button
            onClick={() => { setActiveModal("delete"); setIsOpen(false); }}
            className="dropdown-item"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 12, 
              width: "100%", 
              padding: "10px 14px", 
              borderRadius: 8,
              textAlign: "left",
              fontSize: 13,
              fontWeight: 500,
              background: "none",
              border: "none",
              color: "#ff4d4d",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            <Trash2 size={14} style={{ opacity: 0.8 }} />
            Delete Community
          </button>
        </div>
      )}

      {/* Modals */}
      {activeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20
          }}
          onClick={() => !isLoading && setActiveModal(null)}
        >
          <div
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-secondary)",
              borderRadius: 20,
              width: "100%",
              maxWidth: activeModal === "members" ? 500 : 450,
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.8)",
              padding: 32,
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {activeModal === "edit" && "Update Community"}
                {activeModal === "members" && "Member Directory"}
                {activeModal === "delete" && "Remove Community"}
              </h3>
              <button 
                onClick={() => setActiveModal(null)} 
                disabled={isLoading}
                style={{ color: "var(--text-muted)", background: "var(--bg-tertiary)", border: "none", cursor: "pointer", padding: 6, borderRadius: 8 }}
              >
                <X size={18} />
              </button>
            </div>

            {activeModal === "edit" && (
              <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Community Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>About this space</label>
                  <textarea
                    className="input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    style={{ resize: "none" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
                    <select
                      className="input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="communication">Communication</option>
                      <option value="personality">Personality</option>
                      <option value="technical">Technical</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Member Limit</label>
                    <input
                      type="number"
                      className="input"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                      min={2}
                      max={100}
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="btn btn-primary"
                  style={{ marginTop: 12, width: "100%", height: 48, fontSize: 15, fontWeight: 600 }}
                >
                  {isLoading ? "Synchronizing..." : "Update Details"}
                </button>
              </form>
            )}

            {activeModal === "members" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {memberList.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                    <Users size={32} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
                    <p style={{ fontSize: 14 }}>No other members yet.</p>
                  </div>
                ) : (
                  memberList.map(member => (
                    <div 
                      key={member._id}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between", 
                        padding: "12px 16px", 
                        background: "var(--bg-tertiary)", 
                        borderRadius: 12,
                        border: "1px solid var(--border-primary)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-primary)", border: "1px solid var(--border-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                          {member.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600 }}>{member.name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{member.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMember(member._id)}
                        style={{ color: "#ff4d4d", background: "rgba(255, 77, 77, 0.05)", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, transition: "all 0.2s" }}
                        className="remove-member-btn"
                        title="Remove member"
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
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <AlertTriangle size={32} />
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>Delete this community?</h4>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.6 }}>
                  This will permanently remove <strong>{community.name}</strong> and all scheduled meetings. This action is irreversible.
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button 
                    onClick={() => setActiveModal(null)} 
                    disabled={isLoading}
                    className="btn btn-secondary"
                    style={{ flex: 1, height: 44 }}
                  >
                    Keep it
                  </button>
                  <button 
                    onClick={handleDelete} 
                    disabled={isLoading}
                    className="btn"
                    style={{ flex: 1, height: 44, background: "#ff4d4d", color: "white", fontWeight: 600 }}
                  >
                    {isLoading ? "Deleting..." : "Delete Permanently"}
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
