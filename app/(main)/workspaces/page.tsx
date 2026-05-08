import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Briefcase, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Workspace from "@/lib/models/Workspace";

export default async function WorkspacesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();

  const workspaces = await Workspace.find({ owner: session.userId })
    .sort({ createdAt: -1 })
    .lean();

  const getTaskStats = (tasks: any[]) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const todo = tasks.filter(task => task.status === 'todo').length;

    return { total, completed, inProgress, todo };
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
              Workspaces
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
              Create and manage your personal workspaces for productive work
            </p>
          </div>
          <Link href="/workspaces/new" className="btn btn-primary btn-lg">
            <Plus size={18} />
            New Workspace
          </Link>
        </div>
      </header>

      {workspaces.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "64px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-secondary)",
            textAlign: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-tertiary)",
              color: "var(--text-muted)"
            }}
          >
            <Briefcase size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No workspaces yet</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.5, marginBottom: 24 }}>
              Create your first workspace to start organizing your tasks and projects.
            </p>
            <Link href="/workspaces/new" className="btn btn-primary btn-lg">
              <Plus size={16} />
              Create Your First Workspace
            </Link>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {workspaces.map((workspace: any) => {
            const stats = getTaskStats(workspace.tasks || []);

            return (
              <Link
                key={workspace._id}
                href={`/workspaces/${workspace._id}`}
                className="card"
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--bg-tertiary)",
                      color: "var(--text-primary)"
                    }}
                  >
                    <Briefcase size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>
                      {workspace.name}
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      {stats.total} tasks
                    </p>
                  </div>
                </div>

                {workspace.description && (
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
                    {workspace.description}
                  </p>
                )}

                <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle size={14} color="var(--success)" />
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {stats.completed}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={14} color="var(--warning)" />
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {stats.inProgress}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertCircle size={14} color="var(--info)" />
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {stats.todo}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}