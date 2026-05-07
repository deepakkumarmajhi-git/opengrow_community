"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, Plus, Trophy } from "lucide-react";

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
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="sidebar">
      <div
        className="sidebar-logo"
        style={{
          padding: "22px 22px 18px",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.05em",
          }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-secondary)",
            }}
          >
            <Image
              src="/logo.png"
              alt="OpenGrow logo"
              width={42}
              height={42}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </span>
          <span className="sidebar-text">OpenGrow</span>
        </Link>
      </div>

      <nav
        className="sidebar-nav"
        style={{
          flex: 1,
          padding: "18px 14px 16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="sidebar-primary-links"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                style={{
                  padding: "14px 14px",
                  border: "1px solid transparent",
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span className="sidebar-text" style={{ fontSize: 14, fontWeight: 700 }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div
          className="sidebar-communities"
          style={{
            padding: "18px 8px 0",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <p className="stat-label" style={{ marginBottom: 6 }}>
                Your communities
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
                Spaces you are already part of
              </p>
            </div>

            <Link href="/discover?create=true" className="btn btn-secondary btn-sm" title="Create community">
              <Plus size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {user.communities?.length ? (
              user.communities.map((community) => {
                const communityPath = `/community/${community._id}`;
                const isActive = pathname.startsWith(communityPath);

                return (
                  <Link
                    key={community._id}
                    href={communityPath}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    style={{
                      padding: "12px 12px",
                      border: "1px solid transparent",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid var(--border-primary)",
                        flexShrink: 0,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {community.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        className="sidebar-text"
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          marginBottom: 2,
                        }}
                      >
                        {community.name}
                      </p>
                      <p style={{ color: "var(--text-muted)", fontSize: 11 }}>
                        Community room
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="card" style={{ padding: 16 }}>
                <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                  Join a community from Discover to populate your sidebar with
                  active rooms.
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div
        className="sidebar-user"
        style={{
          padding: 18,
          borderTop: "1px solid var(--border-primary)",
        }}
      >
        <Link
          href="/profile"
          className="sidebar-link"
          style={{
            padding: 14,
            border: "1px solid var(--border-primary)",
            background: pathname === "/profile" ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(132, 240, 184, 0.18), rgba(245, 184, 109, 0.16))",
              color: "var(--text-primary)",
              fontWeight: 800,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              className="sidebar-text"
              style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 2,
                color: "var(--text-primary)",
              }}
            >
              {user.name}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
              {user.points.toLocaleString()} points
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
