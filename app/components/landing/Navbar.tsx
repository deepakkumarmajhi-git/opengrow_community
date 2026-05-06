"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sprout } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Community", href: "#stats" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(9, 9, 11, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-primary)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <Sprout size={22} color="var(--accent)" />
          <span>OpenGrow</span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 12 }}
          className="hidden-mobile"
        >
          <Link href="/login" className="btn btn-ghost btn-sm">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-only"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "none",
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            padding: "16px 24px 24px",
            borderTop: "1px solid var(--border-primary)",
            background: "var(--bg-secondary)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
          className="animate-slide-down"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{ fontSize: 14, color: "var(--text-secondary)", padding: "8px 0" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Link href="/login" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              Get Started
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
