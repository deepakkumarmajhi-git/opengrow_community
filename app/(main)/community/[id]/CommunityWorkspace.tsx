"use client";

import { useState, useEffect } from "react";
import { BookOpen, CheckCircle2, Megaphone, Pencil, Plus, Save, X, Activity, Layout, ExternalLink, Zap, Users, Target } from "lucide-react";
import { useRouter } from "next/navigation";

type Workspace = {
  pinnedNotes: { title: string; body: string }[];
  resources: { title: string; url: string; description: string }[];
  announcements: { body: string }[];
  weeklyGoals: { text: string; done: boolean }[];
};

interface HealthData {
  avgAttendance: number;
  avgScore: number;
  activeStreak: number;
  totalSessions: number;
}

export default function CommunityWorkspace({
  communityId,
  isCreator,
  workspace,
}: {
  communityId: string;
  isCreator: boolean;
  workspace: Workspace;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"home" | "health" | "actions">("home");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  
  const [draft, setDraft] = useState<Workspace>({
    pinnedNotes: workspace.pinnedNotes.length
      ? workspace.pinnedNotes
      : [{ title: "Community brief", body: "Add the purpose, rituals, and norms for this space." }],
    resources: workspace.resources,
    announcements: workspace.announcements,
    weeklyGoals: workspace.weeklyGoals.length
      ? workspace.weeklyGoals
      : [{ text: "Host one high-quality practice session this week", done: false }],
  });

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch(`/api/communities/${communityId}/analytics`);
        if (res.ok) {
          const data = await res.json();
          setHealthData({
            avgAttendance: data.avgAttendance || 0,
            avgScore: data.avgScore || 0,
            activeStreak: data.topMembers?.[0]?.streak || 0,
            totalSessions: data.completedMeetings || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch health stats:", err);
      }
    };
    fetchHealth();
  }, [communityId]);

  const updateDraft = (key: keyof Workspace, value: any) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const saveWorkspace = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/communities/${communityId}/workspace`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          resources: draft.resources.filter(
            (resource) => resource.title.trim() && resource.url.trim() && resource.url !== "https://"
          ),
        }),
      });
      if (response.ok) {
        setEditing(false);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleGoal = async (index: number) => {
    const newGoals = [...workspace.weeklyGoals];
    newGoals[index].done = !newGoals[index].done;
    
    // Optimistic update
    updateDraft("weeklyGoals", newGoals);

    try {
      const response = await fetch(`/api/communities/${communityId}/workspace`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...workspace,
          weeklyGoals: newGoals,
        }),
      });
      if (!response.ok) {
        // Rollback on failure
        updateDraft("weeklyGoals", workspace.weeklyGoals);
      } else {
        router.refresh();
      }
    } catch (err) {
      updateDraft("weeklyGoals", workspace.weeklyGoals);
    }
  };

  const renderHome = () => {
    const workspaceToRender = editing ? draft : workspace;
    const notes = workspaceToRender.pinnedNotes.length ? workspaceToRender.pinnedNotes : draft.pinnedNotes;
    const goals = workspaceToRender.weeklyGoals.length ? workspaceToRender.weeklyGoals : draft.weeklyGoals;

    if (editing) {
      return (
        <div style={{ display: "grid", gap: 14 }}>
          <EditableList
            title="Pinned notes"
            rows={draft.pinnedNotes}
            addLabel="Add note"
            onAdd={() =>
              updateDraft("pinnedNotes", [...draft.pinnedNotes, { title: "New note", body: "" }].slice(0, 5))
            }
            renderRow={(item, index) => (
              <div style={{ display: "grid", gap: 8 }}>
                <input
                  className="input"
                  value={item.title}
                  onChange={(e) => {
                    const newNotes = [...draft.pinnedNotes];
                    newNotes[index].title = e.target.value;
                    updateDraft("pinnedNotes", newNotes);
                  }}
                />
                <textarea
                  className="input"
                  value={item.body}
                  onChange={(e) => {
                    const newNotes = [...draft.pinnedNotes];
                    newNotes[index].body = e.target.value;
                    updateDraft("pinnedNotes", newNotes);
                  }}
                  rows={3}
                />
              </div>
            )}
          />

          <EditableList
            title="Resources"
            rows={draft.resources}
            addLabel="Add resource"
            onAdd={() =>
              updateDraft("resources", [...draft.resources, { title: "New resource", url: "https://", description: "" }].slice(0, 8))
            }
            renderRow={(item, index) => (
              <div style={{ display: "grid", gap: 8 }}>
                <input
                  className="input"
                  value={item.title}
                  placeholder="Resource title"
                  onChange={(e) => {
                    const newRes = [...draft.resources];
                    newRes[index].title = e.target.value;
                    updateDraft("resources", newRes);
                  }}
                />
                <input
                  className="input"
                  value={item.url}
                  placeholder="https://"
                  onChange={(e) => {
                    const newRes = [...draft.resources];
                    newRes[index].url = e.target.value;
                    updateDraft("resources", newRes);
                  }}
                />
              </div>
            )}
          />

          <label>
            <span className="label">Latest announcement</span>
            <textarea
              className="input"
              rows={3}
              value={draft.announcements[0]?.body || ""}
              onChange={(e) =>
                updateDraft("announcements", e.target.value ? [{ body: e.target.value }] : [])
              }
              placeholder="Share the latest update for members."
            />
          </label>

          <EditableList
            title="Weekly goals"
            rows={draft.weeklyGoals}
            addLabel="Add goal"
            onAdd={() =>
              updateDraft("weeklyGoals", [...draft.weeklyGoals, { text: "New weekly goal", done: false }].slice(0, 6))
            }
            renderRow={(item, index) => (
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) => {
                    const newGoals = [...draft.weeklyGoals];
                    newGoals[index].done = e.target.checked;
                    updateDraft("weeklyGoals", newGoals);
                  }}
                />
                <input
                  className="input"
                  value={item.text}
                  onChange={(e) => {
                    const newGoals = [...draft.weeklyGoals];
                    newGoals[index].text = e.target.value;
                    updateDraft("weeklyGoals", newGoals);
                  }}
                />
              </label>
            )}
          />

          <button type="button" onClick={saveWorkspace} disabled={saving} className="btn btn-primary" style={{ marginTop: 8 }}>
            <Save size={16} />
            {saving ? "Saving..." : "Save workspace"}
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gap: 14 }}>
        {workspaceToRender.announcements[0]?.body && (
          <div className="card" style={{ padding: 16, display: "flex", gap: 12, border: "1px solid rgba(132, 240, 184, 0.2)" }}>
            <Megaphone size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, fontSize: 14 }}>
              {workspaceToRender.announcements[0].body}
            </p>
          </div>
        )}

        {notes.map((note, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <p className="stat-label" style={{ marginBottom: 8, fontSize: 10 }}>
              Pinned note
            </p>
            <h3 style={{ fontSize: 16, marginBottom: 8, fontWeight: 700 }}>{note.title}</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, fontSize: 14 }}>{note.body}</p>
          </div>
        ))}

        <div className="card" style={{ padding: 16 }}>
          <p className="stat-label" style={{ marginBottom: 12, fontSize: 10 }}>
            Weekly goals
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {goals.map((goal, i) => (
              <div 
                key={i} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 10, 
                  cursor: isCreator ? "pointer" : "default" 
                }}
                onClick={() => isCreator && !editing && toggleGoal(i)}
              >
                <CheckCircle2 size={16} color={goal.done ? "var(--success)" : "var(--text-muted)"} />
                <span style={{ fontSize: 14, color: goal.done ? "var(--text-muted)" : "var(--text-secondary)" }}>
                  {goal.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {workspaceToRender.resources.length > 0 && (
          <div className="card" style={{ padding: 16 }}>
            <p className="stat-label" style={{ marginBottom: 12, fontSize: 10 }}>
              Resources
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {workspaceToRender.resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontSize: 14 }}
                  className="hover-accent"
                >
                  <BookOpen size={16} />
                  <span>{resource.title}</span>
                  <ExternalLink size={12} style={{ opacity: 0.5, marginLeft: "auto" }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHealth = () => (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="card" style={{ padding: 18, background: "rgba(132, 240, 184, 0.03)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={16} color="var(--accent)" />
          Community Pulse
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="card" style={{ padding: 12, background: "var(--bg-tertiary)" }}>
            <span className="stat-label" style={{ fontSize: 10 }}>Avg. Attendance</span>
            <p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{healthData?.avgAttendance || 0}</p>
          </div>
          <div className="card" style={{ padding: 12, background: "var(--bg-tertiary)" }}>
            <span className="stat-label" style={{ fontSize: 10 }}>AI Clarity</span>
            <p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{healthData?.avgScore || 0}%</p>
          </div>
          <div className="card" style={{ padding: 12, background: "var(--bg-tertiary)" }}>
            <span className="stat-label" style={{ fontSize: 10 }}>Total Sessions</span>
            <p style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{healthData?.totalSessions || 0}</p>
          </div>
          <div className="card" style={{ padding: 12, background: "var(--bg-tertiary)" }}>
            <span className="stat-label" style={{ fontSize: 10 }}>Top Streak</span>
            <p style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: "var(--accent-warm)", display: "flex", alignItems: "center", gap: 4 }}>
              <Zap size={14} fill="currentColor" />
              {healthData?.activeStreak || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Your community is most active on <strong>Tuesdays</strong>. Keep the momentum going by scheduling a session!
        </p>
      </div>
    </div>
  );

  const renderActions = () => (
    <div style={{ display: "grid", gap: 10 }}>
      <button className="btn btn-secondary w-full" style={{ justifyContent: "flex-start", padding: "12px 16px" }}>
        <Plus size={16} />
        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Propose a session</p>
          <p style={{ fontSize: 11, opacity: 0.7 }}>Ask for a specific topic</p>
        </div>
      </button>
      <button className="btn btn-secondary w-full" style={{ justifyContent: "flex-start", padding: "12px 16px" }}>
        <BookOpen size={16} />
        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Share a resource</p>
          <p style={{ fontSize: 11, opacity: 0.7 }}>Links, docs, or tools</p>
        </div>
      </button>
      {isCreator && (
        <button 
          className="btn btn-primary w-full" 
          style={{ justifyContent: "flex-start", padding: "12px 16px", background: "rgba(132, 240, 184, 0.1)", color: "var(--accent)", border: "1px solid var(--accent)" }}
          onClick={() => {
            setActiveTab("home");
            setEditing(true);
          }}
        >
          <Megaphone size={16} />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Post Announcement</p>
            <p style={{ fontSize: 11, opacity: 0.8 }}>Notify all members</p>
          </div>
        </button>
      )}
    </div>
  );

  return (
    <section className="card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p className="stat-label" style={{ marginBottom: 4, fontSize: 11 }}>Workspace</p>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>Community Home</h2>
        </div>
        {isCreator && activeTab === "home" && (
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="btn btn-ghost btn-sm"
            style={{ padding: 8 }}
          >
            {editing ? <X size={16} /> : <Pencil size={16} />}
          </button>
        )}
      </div>

      {!editing && (
        <div style={{ display: "flex", gap: 4, background: "var(--bg-secondary)", padding: 4, borderRadius: 12 }}>
          <TabButton 
            active={activeTab === "home"} 
            onClick={() => setActiveTab("home")}
            icon={<Layout size={14} />}
            label="Home"
          />
          <TabButton 
            active={activeTab === "health"} 
            onClick={() => setActiveTab("health")}
            icon={<Activity size={14} />}
            label="Health"
          />
          <TabButton 
            active={activeTab === "actions"} 
            onClick={() => setActiveTab("actions")}
            icon={<Zap size={14} />}
            label="Actions"
          />
        </div>
      )}

      <div style={{ flex: 1 }}>
        {activeTab === "home" && renderHome()}
        {activeTab === "health" && renderHealth()}
        {activeTab === "actions" && renderActions()}
      </div>
    </section>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "8px 12px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        transition: "all 0.2s ease",
        background: active ? "var(--bg-card)" : "transparent",
        color: active ? "var(--text-primary)" : "var(--text-muted)",
        boxShadow: active ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
        border: "none",
        cursor: "pointer"
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function EditableList<T>({
  title,
  rows,
  addLabel,
  onAdd,
  renderRow,
}: {
  title: string;
  rows: T[];
  addLabel: string;
  onAdd: () => void;
  renderRow: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="label" style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>
          {title}
        </span>
        <button type="button" onClick={onAdd} className="btn btn-ghost btn-sm" style={{ fontSize: 11, gap: 4 }}>
          <Plus size={12} />
          {addLabel}
        </button>
      </div>
      {rows.map((item, index) => (
        <div key={index} className="card" style={{ padding: 14, background: "var(--bg-secondary)" }}>
          {renderRow(item, index)}
        </div>
      ))}
    </div>
  );
}
