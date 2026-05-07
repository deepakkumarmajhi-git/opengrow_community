"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, Megaphone, Pencil, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Workspace = {
  pinnedNotes: { title: string; body: string }[];
  resources: { title: string; url: string; description: string }[];
  announcements: { body: string }[];
  weeklyGoals: { text: string; done: boolean }[];
};

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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const workspaceToRender = editing ? draft : workspace;
  const notes = workspaceToRender.pinnedNotes.length ? workspaceToRender.pinnedNotes : draft.pinnedNotes;
  const goals = workspaceToRender.weeklyGoals.length ? workspaceToRender.weeklyGoals : draft.weeklyGoals;

  return (
    <section className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
        <div>
          <p className="stat-label" style={{ marginBottom: 8 }}>
            Workspace
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 750, letterSpacing: "-0.02em" }}>
            Community home
          </h2>
        </div>
        {isCreator && (
          <button
            type="button"
            onClick={() => (editing ? setEditing(false) : setEditing(true))}
            className="btn btn-secondary btn-sm"
          >
            {editing ? <X size={15} /> : <Pencil size={15} />}
            {editing ? "Cancel" : "Edit"}
          </button>
        )}
      </div>

      {editing ? (
        <div style={{ display: "grid", gap: 14 }}>
          <EditableList
            title="Pinned notes"
            rows={draft.pinnedNotes}
            addLabel="Add note"
            onAdd={() =>
              setDraft((current) => ({
                ...current,
                pinnedNotes: [...current.pinnedNotes, { title: "New note", body: "" }].slice(0, 5),
              }))
            }
            renderRow={(item, index) => (
              <div style={{ display: "grid", gap: 8 }}>
                <input
                  className="input"
                  value={item.title}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      pinnedNotes: current.pinnedNotes.map((note, noteIndex) =>
                        noteIndex === index ? { ...note, title: event.target.value } : note
                      ),
                    }))
                  }
                />
                <textarea
                  className="input"
                  value={item.body}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      pinnedNotes: current.pinnedNotes.map((note, noteIndex) =>
                        noteIndex === index ? { ...note, body: event.target.value } : note
                      ),
                    }))
                  }
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
              setDraft((current) => ({
                ...current,
                resources: [...current.resources, { title: "New resource", url: "https://example.com", description: "" }].slice(0, 8),
              }))
            }
            renderRow={(item, index) => (
              <div style={{ display: "grid", gap: 8 }}>
                <input
                  className="input"
                  value={item.title}
                  placeholder="Resource title"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      resources: current.resources.map((resource, resourceIndex) =>
                        resourceIndex === index ? { ...resource, title: event.target.value } : resource
                      ),
                    }))
                  }
                />
                <input
                  className="input"
                  value={item.url}
                  placeholder="https://"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      resources: current.resources.map((resource, resourceIndex) =>
                        resourceIndex === index ? { ...resource, url: event.target.value } : resource
                      ),
                    }))
                  }
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
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  announcements: event.target.value ? [{ body: event.target.value }] : [],
                }))
              }
              placeholder="Share the latest update for members."
            />
          </label>

          <EditableList
            title="Weekly goals"
            rows={draft.weeklyGoals}
            addLabel="Add goal"
            onAdd={() =>
              setDraft((current) => ({
                ...current,
                weeklyGoals: [...current.weeklyGoals, { text: "New weekly goal", done: false }].slice(0, 6),
              }))
            }
            renderRow={(item, index) => (
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      weeklyGoals: current.weeklyGoals.map((goal, goalIndex) =>
                        goalIndex === index ? { ...goal, done: event.target.checked } : goal
                      ),
                    }))
                  }
                />
                <input
                  className="input"
                  value={item.text}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      weeklyGoals: current.weeklyGoals.map((goal, goalIndex) =>
                        goalIndex === index ? { ...goal, text: event.target.value } : goal
                      ),
                    }))
                  }
                />
              </label>
            )}
          />

          <button type="button" onClick={saveWorkspace} disabled={saving} className="btn btn-primary">
            <Save size={16} />
            {saving ? "Saving..." : "Save workspace"}
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {workspaceToRender.announcements[0]?.body && (
            <div className="card" style={{ padding: 16, display: "flex", gap: 12 }}>
              <Megaphone size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}>
                {workspaceToRender.announcements[0].body}
              </p>
            </div>
          )}

          {notes.map((note) => (
            <div key={note.title} className="card" style={{ padding: 16 }}>
              <p className="stat-label" style={{ marginBottom: 8 }}>
                Pinned note
              </p>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{note.title}</h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}>{note.body}</p>
            </div>
          ))}

          <div className="card" style={{ padding: 16 }}>
            <p className="stat-label" style={{ marginBottom: 12 }}>
              Weekly goals
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {goals.map((goal) => (
                <div key={goal.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={16} color={goal.done ? "var(--success)" : "var(--text-muted)"} />
                  <span style={{ color: goal.done ? "var(--text-muted)" : "var(--text-secondary)" }}>
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {workspaceToRender.resources.length > 0 && (
            <div className="card" style={{ padding: 16 }}>
              <p className="stat-label" style={{ marginBottom: 12 }}>
                Resources
              </p>
              <div style={{ display: "grid", gap: 10 }}>
                {workspaceToRender.resources.map((resource) => (
                  <a
                    key={resource.url}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)" }}
                  >
                    <BookOpen size={16} />
                    <span>{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span className="label" style={{ margin: 0 }}>
          {title}
        </span>
        <button type="button" onClick={onAdd} className="btn btn-ghost btn-sm">
          <Plus size={14} />
          {addLabel}
        </button>
      </div>
      {rows.map((item, index) => (
        <div key={index} className="card" style={{ padding: 14 }}>
          {renderRow(item, index)}
        </div>
      ))}
    </div>
  );
}
