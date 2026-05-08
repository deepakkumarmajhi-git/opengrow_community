export default function CommunityLoading() {
  return (
    <div className="page-container" style={{ maxWidth: 1200 }}>
      {/* Back Button Skeleton */}
      <div className="animate-pulse" style={{ width: 140, height: 16, background: "var(--bg-tertiary)", borderRadius: 4, marginBottom: 24 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40 }}>
        <main>
          {/* Header Skeleton */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 20 }}>
                <div className="animate-pulse" style={{ width: 80, height: 80, borderRadius: 24, background: "var(--bg-tertiary)" }} />
                <div style={{ paddingTop: 8 }}>
                  <div className="animate-pulse" style={{ width: 250, height: 32, background: "var(--bg-tertiary)", borderRadius: 8, marginBottom: 12 }} />
                  <div className="animate-pulse" style={{ width: 180, height: 16, background: "var(--bg-tertiary)", borderRadius: 4 }} />
                </div>
              </div>
              <div className="animate-pulse" style={{ width: 100, height: 40, borderRadius: 10, background: "var(--bg-tertiary)" }} />
            </div>

            {/* Description Skeleton */}
            <div className="animate-pulse" style={{ width: "100%", height: 60, background: "var(--bg-secondary)", borderRadius: 12, marginBottom: 32 }} />

            {/* Tabs Skeleton */}
            <div style={{ display: "flex", gap: 32, borderBottom: "1px solid var(--border-primary)", marginBottom: 32 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse" style={{ width: 80, height: 24, background: "var(--bg-tertiary)", borderRadius: 4, marginBottom: 8 }} />
              ))}
            </div>

            {/* Section Skeleton */}
            <div className="card animate-pulse" style={{ height: 400, background: "var(--bg-secondary)" }} />
          </div>
        </main>

        <aside style={{ display: "grid", gap: 32 }}>
          {/* Workspace Skeleton */}
          <div className="card animate-pulse" style={{ height: 450, background: "var(--bg-secondary)" }} />
          {/* Members Skeleton */}
          <div className="card animate-pulse" style={{ height: 300, background: "var(--bg-secondary)" }} />
        </aside>
      </div>
    </div>
  );
}
