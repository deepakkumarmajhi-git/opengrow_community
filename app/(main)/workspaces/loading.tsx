export default function WorkspacesLoading() {
  return (
    <div className="page-container">
      <header style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div className="animate-pulse" style={{ width: 180, height: 32, background: "var(--bg-tertiary)", borderRadius: 8, marginBottom: 8 }} />
            <div className="animate-pulse" style={{ width: 350, height: 16, background: "var(--bg-tertiary)", borderRadius: 4 }} />
          </div>
          <div className="animate-pulse" style={{ width: 150, height: 40, background: "var(--bg-tertiary)", borderRadius: 10 }} />
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="card animate-pulse" style={{ height: 180, background: "var(--bg-secondary)" }} />
        ))}
      </div>
    </div>
  );
}
