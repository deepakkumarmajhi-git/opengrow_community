import Navbar from "@/app/components/landing/Navbar";
import Hero from "@/app/components/landing/Hero";
import Features from "@/app/components/landing/Features";
import Stats from "@/app/components/landing/Stats";
import Footer from "@/app/components/landing/Footer";
import Link from "next/link";
import { ArrowRight, UserPlus, Search, Video } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <Features />
      <Stats />

      {/* How it Works */}
      <section
        id="how-it-works"
        style={{
          padding: "100px 24px",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 40px)",
              marginBottom: 12,
            }}
          >
            How it works
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              maxWidth: 460,
              margin: "0 auto",
            }}
          >
            Three simple steps to start growing your communication skills.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              step: "01",
              icon: UserPlus,
              title: "Create Your Account",
              desc: "Sign up in seconds. Choose your role — student, developer, professional, or teacher.",
            },
            {
              step: "02",
              icon: Search,
              title: "Discover & Join",
              desc: "Browse communities by interest. Join ones that match your goals and start connecting.",
            },
            {
              step: "03",
              icon: Video,
              title: "Join Meetings & Grow",
              desc: "Attend scheduled video discussions. Share ideas, listen to others, and improve together.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="card"
                style={{
                  textAlign: "center",
                  padding: 32,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: "var(--accent-muted)",
                    position: "absolute",
                    top: 16,
                    right: 20,
                    opacity: 0.5,
                    lineHeight: 1,
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-lg)",
                    background: "var(--accent-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <Icon size={22} color="var(--accent)" />
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-primary)",
          borderBottom: "1px solid var(--border-primary)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
            opacity: 0.2,
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 40px)",
              marginBottom: 16,
            }}
          >
            Ready to start growing?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              maxWidth: 480,
              margin: "0 auto 32px",
            }}
          >
            Join thousands of professionals who are improving their
            communication skills through community discussions.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg">
            Join OpenGrow — It&apos;s Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
