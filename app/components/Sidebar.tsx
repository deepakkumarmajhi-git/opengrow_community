"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Compass, LayoutDashboard, Plus, Trophy, Hash, Sparkles } from "lucide-react";
import NotificationBell from "@/app/components/NotificationBell";
import UpgradeProModal from "@/app/components/UpgradeProModal";
import { useState } from "react";

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
  const [showUpgrade, setShowUpgrade] = useState(false);
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "var(--bg-primary)",
        borderRight: "1px solid var(--border-primary)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: "24px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <Image
              src="/logo.png"
              alt="OpenGrow logo"
              width={24}
              height={24}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          OpenGrow
        </Link>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "0 12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
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
                  className={isActive ? "active-sidebar-link" : "sidebar-link"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    background: isActive ? "var(--bg-tertiary)" : "transparent",
                    transition: "all 0.2s"
                  }}
                >
                  <Icon size={16} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Communities
            </span>
            <Link
              href="/discover?create=true"
              style={{ color: "var(--text-muted)", display: "flex", padding: 4 }}
              className="hover-zinc"
            >
              <Plus size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {user.communities?.length ? (
              user.communities.map((community) => {
                const communityPath = `/community/${community._id}`;
                const isActive = pathname.startsWith(communityPath);

                return (
                  <Link
                    key={community._id}
                    href={communityPath}
                    className={isActive ? "active-sidebar-link" : "sidebar-link"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                      background: isActive ? "var(--bg-tertiary)" : "transparent",
                      transition: "all 0.2s"
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        background: isActive ? "var(--text-primary)" : "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: isActive ? "var(--bg-primary)" : "var(--text-muted)",
                        flexShrink: 0
                      }}
                    >
                      {community.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {community.name}
                    </span>
                  </Link>
                );
              })
            ) : (
              <div style={{ padding: "0 12px", color: "var(--text-muted)", fontSize: 12 }}>
                No active spaces
              </div>
            )}
          </div>
        </div>
      </nav>

      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderTop: "1px solid var(--border-primary)",
        }}
      >
        <button
          onClick={() => setShowUpgrade(true)}
          className="btn-pro-gradient"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "10px",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 8,
            cursor: "pointer",
            border: "none"
          }}
        >
          <Sparkles size={14} fill="currentColor" />
          Upgrade to Pro
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
          <Link
            href="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
              textDecoration: "none"
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.role}
              </span>
            </div>
          </Link>
          <NotificationBell />
        </div>
      </div>

      <UpgradeProModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />

      <style jsx>{`
        .sidebar-link:hover {
          background: var(--bg-tertiary) !important;
          color: var(--text-primary) !important;
        }
        .hover-zinc:hover {
          color: var(--text-primary) !important;
        }
      `}</style>
    </aside>
  );
}
