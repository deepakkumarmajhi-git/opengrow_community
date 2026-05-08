export default function DiscoverLoading() {
  return (
    <div className="page-container">
      <header style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div className="animate-pulse" style={{ width: 300, height: 32, background: "var(--bg-tertiary)", borderRadius: 8, marginBottom: 8 }} />
            <div className="animate-pulse" style={{ width: 250, height: 16, background: "var(--bg-tertiary)", borderRadius: 4 }} />
          </div>
          <div className="animate-pulse" style={{ width: 120, height: 40, background: "var(--bg-tertiary)", borderRadius: 10 }} />
        </div>
      </header>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
        <div className="animate-pulse" style={{ width: 300, height: 36, background: "var(--bg-tertiary)", borderRadius: 10 }} />
        <div className="animate-pulse" style={{ width: 200, height: 36, background: "var(--bg-tertiary)", borderRadius: 8 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card animate-pulse" style={{ height: 220, background: "var(--bg-secondary)" }} />
        ))}
      </div>
    </div>
  );
}
