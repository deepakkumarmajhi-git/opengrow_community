"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  LayoutDashboard,
  Compass,
  Trophy,
  User,
  LogOut,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Coffee,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

interface SidebarProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    points: number;
    communities?: any[];
  };
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Add/remove global class for layout margin syncing
    if (isCollapsed) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }
  }, [isCollapsed]);

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Logo & Toggle */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em"
          }}
        >
          <span className="sidebar-text">OpenGrow</span>
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            borderRadius: 6,
            flexShrink: 0,
          }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 24 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                style={{
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  padding: isCollapsed ? "12px 0" : "9px 14px"
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span className="sidebar-text" style={{ marginLeft: 10 }}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Communities Section */}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "space-between",
              padding: "0 14px",
              marginBottom: 8,
            }}
          >
            <h4
              className="sidebar-text"
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Communities
            </h4>
            <Link
              href="/discover?create=true"
              style={{ color: "var(--text-muted)", cursor: "pointer" }}
              title="Create"
            >
              <Plus size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {user.communities?.map((community) => {
              const communityPath = `/community/${community._id}`;
              const isActive = pathname.startsWith(communityPath);
              return (
                <Link
                  key={community._id}
                  href={communityPath}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  style={{
                    padding: isCollapsed ? "12px 0" : "9px 14px",
                    justifyContent: isCollapsed ? "center" : "flex-start"
                  }}
                  title={isCollapsed ? community.name : undefined}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      background: "var(--bg-tertiary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      flexShrink: 0,
                    }}
                  >
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="sidebar-text" style={{ marginLeft: 10 }}>
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
          padding: isCollapsed ? "16px 8px" : "16px",
          borderTop: "1px solid var(--border-primary)",
        }}
      >
        <Link
          href="/profile"
          className="sidebar-link"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: 10,
            marginBottom: 8,
            padding: isCollapsed ? "8px 0" : "8px 10px",
            background: pathname === "/profile" ? "var(--bg-glass)" : "transparent",
          }}
          title={isCollapsed ? "Profile" : undefined}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--accent-muted)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="sidebar-text" style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "var(--text-primary)"
              }}
            >
              {user.name}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>View Profile</p>
          </div>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="sidebar-link"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--danger)",
              opacity: 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              padding: isCollapsed ? "12px 0" : "9px 14px",
            }}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            <span className="sidebar-text" style={{ marginLeft: 10 }}>Log out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
