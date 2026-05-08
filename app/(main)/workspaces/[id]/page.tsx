import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Briefcase, CheckCircle, Clock, AlertCircle, MoreVertical, Edit, Trash2, Layout } from "lucide-react";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Workspace from "@/lib/models/Workspace";
import TaskCard from "@/app/components/TaskCard";
import CreateTaskModal from "@/app/components/CreateTaskModal";
import PomodoroTimer from "@/app/components/PomodoroTimer";
import WorkspaceScratchpad from "@/app/components/WorkspaceScratchpad";
import AITaskHelper from "@/app/components/AITaskHelper";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();

  const workspace = await Workspace.findOne({
    _id: id,
    owner: session.userId,
  }).lean();

  if (!workspace) {
    redirect("/workspaces");
  }

  // Manually sanitize workspace data for Client Components
  const serializedWorkspace = {
    _id: workspace._id.toString(),
    name: workspace.name,
    description: workspace.description || "",
    scratchpad: workspace.scratchpad || "",
    tasks: (workspace.tasks || []).map((task: any) => ({
      _id: task._id.toString(),
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      createdAt: task.createdAt ? new Date(task.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: task.updatedAt ? new Date(task.updatedAt).toISOString() : new Date().toISOString(),
    })),
  };

  const getTaskStats = (tasks: any[]) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const todo = tasks.filter(task => task.status === 'todo').length;

    return { total, completed, inProgress, todo };
  };

  const stats = getTaskStats(serializedWorkspace.tasks);

  const tasksByStatus = {
    todo: serializedWorkspace.tasks.filter((task: any) => task.status === 'todo'),
    'in-progress': serializedWorkspace.tasks.filter((task: any) => task.status === 'in-progress'),
    completed: serializedWorkspace.tasks.filter((task: any) => task.status === 'completed'),
  };

  return (
    <div className="page-container" style={{ maxWidth: 1400 }}>
      <header style={{ marginBottom: 32 }}>
        <Link
          href="/workspaces"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-secondary)",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 16,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={14} />
          Back to Workspaces
        </Link>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(132, 240, 184, 0.15), rgba(245, 184, 109, 0.1))",
                color: "var(--accent)",
                border: "1px solid var(--border-primary)"
              }}
            >
              <Briefcase size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.03em" }}>
                {serializedWorkspace.name}
              </h1>
              {serializedWorkspace.description && (
                <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                  {serializedWorkspace.description}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CreateTaskModal workspaceId={id} />
            <button className="btn btn-ghost btn-sm">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 32,
          alignItems: "start",
        }}
      >
        <main>
          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div className="card" style={{ padding: "16px 20px" }}>
              <span className="stat-label" style={{ fontSize: 11, marginBottom: 8 }}>Total</span>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.total}</div>
            </div>
            <div className="card" style={{ padding: "16px 20px" }}>
              <span className="stat-label" style={{ fontSize: 11, marginBottom: 8 }}>To Do</span>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--info)" }}>{stats.todo}</div>
            </div>
            <div className="card" style={{ padding: "16px 20px" }}>
              <span className="stat-label" style={{ fontSize: 11, marginBottom: 8 }}>In Progress</span>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--warning)" }}>{stats.inProgress}</div>
            </div>
            <div className="card" style={{ padding: "16px 20px" }}>
              <span className="stat-label" style={{ fontSize: 11, marginBottom: 8 }}>Completed</span>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--success)" }}>{stats.completed}</div>
            </div>
          </div>

          {/* Kanban Board */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {/* To Do Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertCircle size={14} color="var(--info)" />
                  To Do
                </h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: 10 }}>
                  {tasksByStatus.todo.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tasksByStatus.todo.map((task: any) => (
                  <TaskCard key={String(task._id)} task={task} workspaceId={id} />
                ))}
                {tasksByStatus.todo.length === 0 && (
                  <div className="card" style={{ border: "1px dashed var(--border-primary)", background: "transparent", textAlign: "center", padding: 32, color: "var(--text-muted)", fontSize: 13 }}>
                    No tasks yet
                  </div>
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={14} color="var(--warning)" />
                  In Progress
                </h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: 10 }}>
                  {tasksByStatus['in-progress'].length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tasksByStatus['in-progress'].map((task: any) => (
                  <TaskCard key={String(task._id)} task={task} workspaceId={id} />
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={14} color="var(--success)" />
                  Completed
                </h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: 10 }}>
                  {tasksByStatus.completed.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {tasksByStatus.completed.map((task: any) => (
                  <TaskCard key={String(task._id)} task={task} workspaceId={id} />
                ))}
              </div>
            </div>
          </div>
        </main>

        <aside style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 24 }}>
          <PomodoroTimer />
          <AITaskHelper workspaceId={id} />
          <WorkspaceScratchpad workspaceId={id} initialValue={serializedWorkspace.scratchpad || ""} />
        </aside>
      </div>
    </div>
  );
}