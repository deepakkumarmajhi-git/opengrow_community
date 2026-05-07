import { Loader2 } from "lucide-react";

export default function MeetingLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 14,
        background: "var(--bg-primary)",
      }}
    >
      <Loader2 size={30} className="animate-spin" style={{ color: "var(--accent)" }} />
      <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
        Opening meeting preview...
      </p>
    </div>
  );
}
