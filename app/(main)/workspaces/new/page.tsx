"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Workspace name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create workspace");
      }

      const workspace = await response.json();
      router.push(`/workspaces/${workspace._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: 40 }}>
        <Link
          href="/workspaces"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-secondary)",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 16,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          Back to Workspaces
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)"
            }}
          >
            <Briefcase size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              Create New Workspace
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
              Set up a personal workspace for your tasks and projects
            </p>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                }}
              >
                Workspace Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Product Development, Learning Goals, Side Project"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: 8,
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  outline: "none",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label
                htmlFor="description"
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                }}
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this workspace is for..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid var(--border-primary)",
                  borderRadius: 8,
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: 8,
                  color: "var(--danger)",
                  fontSize: 14,
                  marginBottom: 24,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Briefcase size={16} />
                )}
                {isLoading ? "Creating..." : "Create Workspace"}
              </button>
              <Link href="/workspaces" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}