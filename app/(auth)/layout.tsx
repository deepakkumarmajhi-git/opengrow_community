export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border-primary) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
        }}
      />
      {/* Gradient orb */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          opacity: 0.15,
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        {children}
      </div>
    </div>
  );
}
