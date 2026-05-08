import DelayedRender from "@/app/components/DelayedRender";

export default function Loading() {
  return (
    <DelayedRender delay={400}>
      <div className="page-container" style={{ maxWidth: 1400 }}>
        {/* Header Skeleton */}
        <header style={{ marginBottom: 32 }}>
          <div className="animate-pulse" style={{ 
            width: 120, 
            height: 16, 
            background: "var(--bg-tertiary)", 
            borderRadius: 4, 
            marginBottom: 16
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="animate-pulse" style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 14, 
                background: "var(--bg-tertiary)"
              }} />
              <div>
                <div className="animate-pulse" style={{ 
                  width: 200, 
                  height: 28, 
                  background: "var(--bg-tertiary)", 
                  borderRadius: 6, 
                  marginBottom: 8
                }} />
                <div className="animate-pulse" style={{ 
                  width: 300, 
                  height: 16, 
                  background: "var(--bg-tertiary)", 
                  borderRadius: 4
                }} />
              </div>
            </div>
            <div className="animate-pulse" style={{ width: 100, height: 36, borderRadius: 8, background: "var(--bg-tertiary)" }} />
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
          <main>
            {/* Stats Skeleton */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card animate-pulse" style={{ height: 80, background: "var(--bg-secondary)" }} />
              ))}
            </div>

            {/* Kanban Skeleton */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[1, 2, 3].map((col) => (
                <div key={col} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="animate-pulse" style={{ width: 80, height: 18, background: "var(--bg-tertiary)", borderRadius: 4 }} />
                  {[1, 2].map((card) => (
                    <div key={card} className="card animate-pulse" style={{ height: 120, background: "var(--bg-secondary)" }} />
                  ))}
                </div>
              ))}
            </div>
          </main>

          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse" style={{ height: 180, background: "var(--bg-secondary)" }} />
            ))}
          </aside>
        </div>
      </div>
    </DelayedRender>
  );
}
