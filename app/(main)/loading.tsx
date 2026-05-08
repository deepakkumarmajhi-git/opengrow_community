import { Sparkles } from "lucide-react";
import DelayedRender from "@/app/components/DelayedRender";

export default function GlobalLoading() {
  return (
    <DelayedRender delay={500}>
      <div 
        style={{ 
          width: "100%", 
          height: "calc(100vh - 100px)",
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div className="animate-pulse" style={{ 
          width: 64, 
          height: 64, 
          borderRadius: 20, 
          background: "linear-gradient(135deg, rgba(132, 240, 184, 0.2), rgba(245, 184, 109, 0.1))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(132, 240, 184, 0.3)",
        }}>
          <Sparkles size={32} color="var(--accent)" />
        </div>
        
        <div style={{ textAlign: "center" }}>
          <div className="animate-pulse" style={{ 
            width: 120, 
            height: 10, 
            background: "var(--bg-tertiary)", 
            borderRadius: 10,
            margin: "0 auto 12px"
          }} />
          <div className="animate-pulse" style={{ 
            width: 80, 
            height: 8, 
            background: "var(--bg-tertiary)", 
            borderRadius: 10,
            margin: "0 auto",
            opacity: 0.5
          }} />
        </div>
      </div>
    </DelayedRender>
  );
}
