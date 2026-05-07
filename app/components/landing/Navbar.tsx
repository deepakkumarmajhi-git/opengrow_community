"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Experience", href: "#experience" },
  { label: "Pulse", href: "#stats" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        inset: "24px 0 auto",
        zIndex: 50,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          width: "min(1200px, 100%)",
          margin: "0 auto",
          padding: "8px 12px",
          borderRadius: 100,
          background: "var(--bg-glass)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--border-primary)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              paddingLeft: 8
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <Image
                src="/logo.png"
                alt="OpenGrow logo"
                width={28}
                height={28}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            OpenGrow
          </Link>

          <div
            className="hidden-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: 100,
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.2s"
                }}
                className="nav-link-hover"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            className="hidden-mobile"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Link href="/login" className="btn btn-ghost btn-sm" style={{ borderRadius: 100 }}>
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm" style={{ borderRadius: 100 }}>
              Join Free
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="mobile-only"
            aria-label="Toggle menu"
            style={{
              display: "none",
              width: 36,
              height: 36,
              borderRadius: 100,
              border: "1px solid var(--border-primary)",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {mobileOpen && (
          <div
            style={{
              marginTop: 12,
              padding: "16px 8px",
              borderTop: "1px solid var(--border-primary)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "12px",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Link href="/login" className="btn btn-secondary btn-sm" style={{ flex: 1, borderRadius: 100 }}>
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm" style={{ flex: 1, borderRadius: 100 }}>
                Join Free
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .nav-link-hover:hover {
          color: var(--text-primary) !important;
          background: var(--bg-tertiary);
        }

        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }

          .mobile-only {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
}
