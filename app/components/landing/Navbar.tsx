"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Community Pulse", href: "#stats" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        inset: "16px 0 auto",
        zIndex: 50,
        padding: "0 18px",
      }}
    >
      <div
        className="surface"
        style={{
          width: "min(1180px, 100%)",
          margin: "0 auto",
          padding: "14px 18px",
          borderRadius: 999,
          backdropFilter: "blur(22px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-secondary)",
              }}
            >
              <Image
                src="/logo.png"
                alt="OpenGrow logo"
                width={38}
                height={38}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </span>
            OpenGrow
          </Link>

          <div
            className="hidden-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 6,
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-primary)",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            className="hidden-mobile"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <Link href="/login" className="btn btn-ghost btn-sm">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
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
              width: 42,
              height: 42,
              borderRadius: 999,
              border: "1px solid var(--border-primary)",
              background: "rgba(255, 255, 255, 0.03)",
              cursor: "pointer",
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className="animate-slide-down"
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--border-primary)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "10px 6px",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/login" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Join Free
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
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
