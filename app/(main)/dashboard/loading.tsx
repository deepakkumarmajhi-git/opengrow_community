import DelayedRender from "@/app/components/DelayedRender";

export default function DashboardLoading() {
  return (
    <DelayedRender delay={400}>
      <div className="page-container">
        {/* Greeting Skeleton */}
        <header style={{ marginBottom: 40 }}>
          <div className="animate-pulse" style={{ width: 300, height: 42, background: "var(--bg-tertiary)", borderRadius: 12 }} />
        </header>

        {/* Onboarding Skeleton */}
        <div className="animate-pulse" style={{ width: "100%", height: 60, background: "var(--bg-secondary)", borderRadius: 12, marginBottom: 48 }} />

        {/* Stats Grid Skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 20,
            marginBottom: 48,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse" style={{ height: 100, background: "var(--bg-secondary)" }} />
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 40,
          }}
        >
          <main>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <div className="animate-pulse" style={{ width: 180, height: 24, background: "var(--bg-tertiary)", borderRadius: 6 }} />
              <div className="animate-pulse" style={{ width: 80, height: 24, background: "var(--bg-tertiary)", borderRadius: 6 }} />
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse" style={{ height: 80, background: "var(--bg-secondary)" }} />
              ))}
            </div>
          </main>

          <aside style={{ display: "grid", gap: 32 }}>
            {/* Calendar Skeleton */}
            <div className="card animate-pulse" style={{ height: 320, background: "var(--bg-secondary)" }} />
            {/* Activity Skeleton */}
            <div className="card animate-pulse" style={{ height: 180, background: "var(--bg-secondary)" }} />
          </aside>
        </div>
      </div>
    </DelayedRender>
  );
}
