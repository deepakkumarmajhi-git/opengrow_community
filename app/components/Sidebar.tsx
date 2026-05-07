"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Trophy,
  LogOut,
  Plus,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

interface SidebarProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    points: number;
    communities?: Array<{ _id: string; name: string }>;
  };
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--border-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: "var(--text-primary)",
            letterSpacing: "-0.04em",
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          <span className="sidebar-text">OpenGrow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 32 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                style={{
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span className="sidebar-text" style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Communities Section */}
        <div style={{ padding: "0 4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 10px",
              marginBottom: 12,
            }}
          >
            <h4
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Communities
            </h4>
            <Link
              href="/discover?create=true"
              style={{ color: "var(--text-muted)", opacity: 0.6 }}
              title="Create new space"
            >
              <Plus size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {user.communities?.map((community) => {
              const communityPath = `/community/${community._id}`;
              const isActive = pathname.startsWith(communityPath);
              return (
                <Link
                  key={community._id}
                  href={communityPath}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  style={{
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: "var(--bg-tertiary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-primary)",
                      flexShrink: 0,
                    }}
                  >
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="sidebar-text" style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {community.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div
        style={{
          padding: "20px 16px",
          borderTop: "1px solid var(--border-primary)",
          background: "rgba(0,0,0,0.2)"
        }}
      >
        <Link
          href="/profile"
          className="sidebar-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            padding: "10px",
            background: pathname === "/profile" ? "var(--bg-glass)" : "transparent",
            borderRadius: "var(--radius-md)",
            border: pathname === "/profile" ? "1px solid var(--border-primary)" : "1px solid transparent"
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--accent-muted)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
              border: "1px solid var(--border-primary)"
            }}
          >
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "var(--text-primary)",
                marginBottom: 2
              }}
            >
              {user.name}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>My Account</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
