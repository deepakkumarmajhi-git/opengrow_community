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
      {/* Cinematic Background */}
      <div className="hero-gradient" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
      
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--border-primary) 1px, transparent 0)",
          backgroundSize: "48px 48px",
          opacity: 0.2,
        }}
      />

      {/* Floating Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          opacity: 0.1,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          opacity: 0.1,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
        {children}
      </div>
    </div>
  );
}
