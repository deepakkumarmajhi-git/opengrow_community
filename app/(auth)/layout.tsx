import { MessageCircle, Sparkles, Video } from "lucide-react";

const points = [
  {
    icon: Video,
    title: "Live practice rooms",
    description: "Join scheduled conversations with real people, not passive content.",
  },
  {
    icon: MessageCircle,
    title: "Reflection after each meeting",
    description: "See summaries and feedback that help you improve on the next session.",
  },
  {
    icon: Sparkles,
    title: "Communities with momentum",
    description: "Discover spaces that turn learning into a habit instead of a one-off event.",
  },
];

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
        padding: "32px 0",
      }}
    >
      <div className="auth-stage">
        <div className="auth-showcase animate-fade-in">
          <span className="eyebrow">Welcome to OpenGrow</span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(38px, 6vw, 72px)",
              lineHeight: 0.94,
              letterSpacing: "-0.06em",
              maxWidth: 720,
            }}
          >
            A calmer, sharper place to practice communication.
          </h1>
          <p
            style={{
              maxWidth: 620,
              color: "var(--text-secondary)",
              fontSize: 18,
              lineHeight: 1.8,
            }}
          >
            The new experience is designed to feel focused, welcoming, and alive.
            Join communities, attend sessions, and keep your growth moving.
          </p>

          <div className="auth-points">
            {points.map((point) => {
              const Icon = point.icon;

              return (
                <div key={point.title} className="card auth-point">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(132, 240, 184, 0.18), rgba(245, 184, 109, 0.14))",
                      border: "1px solid var(--border-secondary)",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color="var(--text-primary)" />
                  </div>
                  <div>
                    <strong>{point.title}</strong>
                    <span>{point.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="animate-fade-in">{children}</div>
      </div>
    </div>
  );
}
