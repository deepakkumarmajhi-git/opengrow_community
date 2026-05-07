"use client";

import { X, Zap, Rocket, Star, ShieldCheck, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function UpgradeProModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(4, 11, 9, 0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="card"
        style={{
          width: "min(840px, 100%)",
          padding: 0,
          overflow: "hidden",
          border: "1px solid var(--border-strong)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr" }}>
          {/* Left - Visual/Marketing */}
          <div style={{ 
            padding: 40, 
            background: "linear-gradient(135deg, var(--accent), #2383e2)", 
            color: "#040b09",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20
          }}>
            <div style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 18, 
              background: "rgba(255,255,255,0.2)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              marginBottom: 10
            }}>
              <Rocket size={28} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, lineHeight: 1, letterSpacing: "-0.04em" }}>
              Unlock the full potential.
            </h2>
            <p style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.6 }}>
              Upgrade to Pro for advanced AI insights, unlimited communities, and exclusive coaching sessions.
            </p>
          </div>

          {/* Right - Pricing details */}
          <div style={{ padding: 40, background: "var(--bg-card)", position: "relative" }}>
            <button 
              onClick={onClose}
              style={{ 
                position: "absolute", 
                top: 20, 
                right: 20, 
                background: "none", 
                border: "none", 
                color: "var(--text-muted)", 
                cursor: "pointer" 
              }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: 32 }}>
              <span className="badge" style={{ background: "rgba(132, 240, 184, 0.1)", color: "var(--accent)", marginBottom: 12 }}>
                PRO PLAN
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "var(--text-primary)" }}>$19</span>
                <span style={{ color: "var(--text-muted)" }}>/month</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {[
                { icon: Zap, text: "Unlimited community access" },
                { icon: BarChart3, text: "Full AI speaking analytics" },
                { icon: Star, text: "Priority session scheduling" },
                { icon: ShieldCheck, text: "Advanced privacy controls" },
              ].map((feature, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ color: "var(--accent)" }}><feature.icon size={18} /></div>
                  <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{feature.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/signup" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px" }}>
                Start Pro Trial
              </Link>
              <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
                Cancel anytime. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
