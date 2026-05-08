"use client";

import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, MoreVertical, Edit, Trash2 } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface TaskCardProps {
  task: Task;
  workspaceId: string;
}

const priorityColors = {
  low: "var(--info)",
  medium: "var(--warning)",
  high: "var(--danger)",
};

const statusIcons = {
  todo: AlertCircle,
  "in-progress": Clock,
  completed: CheckCircle,
};

const statusColors = {
  todo: "var(--info)",
  "in-progress": "var(--warning)",
  completed: "var(--success)",
};

export default function TaskCard({ task, workspaceId }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const StatusIcon = statusIcons[task.status];

  const handleStatusChange = async (newStatus: Task["status"]) => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: newStatus,
          priority: task.priority,
          dueDate: task.dueDate,
        }),
      });

      if (response.ok) {
        window.location.reload(); // Simple refresh for now
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${task._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload(); // Simple refresh for now
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: 16,
        background: "var(--bg-primary)",
        border: "1px solid var(--border-primary)",
        borderRadius: 8,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <button
          onClick={() => {
            const nextStatus = task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "completed" : "todo";
            handleStatusChange(nextStatus);
          }}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: `2px solid ${statusColors[task.status]}`,
            background: task.status === "completed" ? statusColors[task.status] : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {task.status === "completed" && (
            <CheckCircle size={12} color="white" />
          )}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 4,
              color: "var(--text-primary)",
              textDecoration: task.status === "completed" ? "line-through" : "none",
              opacity: task.status === "completed" ? 0.7 : 1,
            }}
          >
            {task.title}
          </h4>

          {task.description && (
            <p
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                marginBottom: 8,
                lineHeight: 1.4,
              }}
            >
              {task.description}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 6px",
                borderRadius: 12,
                background: "var(--bg-tertiary)",
                fontSize: 10,
                fontWeight: 500,
                color: priorityColors[task.priority],
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: priorityColors[task.priority],
                }}
              />
              {task.priority}
            </div>

            {task.dueDate && (
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Clock size={10} />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
            }}
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                zIndex: 10,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                borderRadius: 8,
                padding: 4,
                minWidth: 120,
                boxShadow: "var(--shadow-md)",
              }}
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  // TODO: Open edit modal
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--text-primary)",
                  fontSize: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Edit size={12} />
                Edit
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleDelete();
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--danger)",
                  fontSize: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}