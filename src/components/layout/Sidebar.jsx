import React from "react";
import { ChevronRight, Layers3, MapPinned, Sparkles } from "lucide-react";

const shellStyle = {
  width: "100%",
  maxWidth: 340,
  flex: "1 1 320px",
  display: "flex",
  flexDirection: "column",
  gap: "0.95rem",
  padding: "0.95rem",
  borderRadius: "22px",
  border: "2px solid rgba(212, 197, 176, 0.14)",
  background:
    "linear-gradient(180deg, rgba(18, 19, 22, 0.99), rgba(15, 16, 19, 0.98)), radial-gradient(circle at top, rgba(30, 58, 95, 0.08), transparent 32%), radial-gradient(circle at bottom right, rgba(184, 124, 79, 0.06), transparent 28%)",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255,255,255,0.02)",
  position: "relative",
  overflow: "hidden",
};

const washStyle = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.14,
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
  backgroundSize: "30px 30px",
  maskImage: "linear-gradient(180deg, rgba(0,0,0,0.56), transparent 92%)",
};

function NavTile({ item, active }) {
  return (
    <button
      type="button"
      onClick={item.onClick}
      style={{
        position: "relative",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
        gap: "0.75rem",
        alignItems: "center",
        padding: "0.9rem 0.95rem",
        borderRadius: "16px",
        border: active ? "1px solid rgba(230,178,36,0.32)" : "1px solid rgba(255,255,255,0.06)",
        background: active
          ? "linear-gradient(180deg, rgba(184,124,79,0.1), rgba(30,58,95,0.06)), linear-gradient(180deg, rgba(255,255,255,0.022), rgba(255,255,255,0.012))"
          : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.012))",
        color: "#efe7da",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: active ? "0 0 0 1px rgba(255,255,255,0.03) inset, 0 10px 20px rgba(0,0,0,0.16)" : "none",
        transform: active ? "translateY(-1px)" : "translateY(0)",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease",
      }}
      onMouseEnter={(event) => {
        if (!active) {
          event.currentTarget.style.transform = "translateX(2px)";
          event.currentTarget.style.borderColor = "rgba(184,124,79,0.18)";
        }
      }}
      onMouseLeave={(event) => {
        if (!active) {
          event.currentTarget.style.transform = "translateX(0)";
          event.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        }
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: active ? 4 : 2,
          background: active ? "linear-gradient(180deg, #e6b422, #b87c4f)" : "rgba(255,255,255,0.08)",
        }}
      />

      <span
          style={{
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            borderRadius: "12px",
            color: active ? "#f5e0ad" : "#a79c8a",
            background: active ? "rgba(230,178,36,0.08)" : "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {item.icon}
      </span>

      <span style={{ position: "relative", minWidth: 0, display: "grid", gap: "0.16rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", minWidth: 0 }}>
          <span style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>{item.label}</span>
          {active ? (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.56rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#e6b422",
              }}
            >
              active
            </span>
          ) : null}
        </span>
        {item.description ? (
          <span style={{ color: "#aaa08f", fontSize: "0.84rem", lineHeight: 1.45 }}>{item.description}</span>
        ) : null}
      </span>

      <span style={{ display: "grid", justifyItems: "end", gap: "0.3rem" }}>
        {item.badge ? (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              padding: "0.28rem 0.52rem",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.08)",
              color: active ? "#f5e7c7" : "#d5cbb8",
              background: active ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.02)",
            }}
          >
            {item.badge}
          </span>
        ) : null}
        <ChevronRight size={14} style={{ color: active ? "#d4af37" : "#8b8f97" }} />
      </span>
    </button>
  );
}

export default function Sidebar({ brand = "SocialRadar", navItems = [], activeId, footer, className = "", style }) {
  return (
    <aside className={className} style={{ ...shellStyle, ...style }}>
      <div aria-hidden="true" style={washStyle} />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "auto 0.95rem 0.95rem",
          height: 4,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(30,58,95,0.06), rgba(212,175,55,0.8), rgba(184,124,79,0.86))",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "0.85rem" }}>
        <div
          style={{
            display: "grid",
            gap: "0.55rem",
            padding: "0.88rem",
            borderRadius: "18px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.024), rgba(255,255,255,0.012))",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
            <div style={{ display: "grid", gap: "0.18rem", minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#b99a77" }}>
                bureau rail
              </span>
              <strong style={{ fontSize: "1.14rem", color: "#f6efe6", letterSpacing: "-0.03em" }}>{brand}</strong>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.35rem 0.55rem",
                borderRadius: "999px",
                background: "rgba(30,58,95,0.08)",
                border: "1px solid rgba(30,58,95,0.14)",
                color: "#d6dde5",
                fontSize: "0.7rem",
              }}
            >
              <Layers3 size={13} />
              district ops
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.34rem 0.55rem",
                borderRadius: "999px",
                background: "rgba(212,175,55,0.07)",
                color: "#f3e0b3",
                border: "1px solid rgba(212,175,55,0.16)",
                fontSize: "0.7rem",
              }}
            >
              <MapPinned size={13} />
              district rail
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.34rem 0.55rem",
                borderRadius: "999px",
                background: "rgba(184,124,79,0.08)",
                color: "#ead8c4",
                border: "1px solid rgba(184,124,79,0.16)",
                fontSize: "0.7rem",
              }}
            >
              <Sparkles size={13} />
              planning layer
            </span>
          </div>
        </div>

        <nav style={{ display: "grid", gap: "0.65rem" }}>
          {navItems.map((item) => (
            <NavTile key={item.id} item={item} active={item.id === activeId} />
          ))}
        </nav>
      </div>

      {footer ? (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: "auto",
            padding: "0.95rem",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.012))",
            display: "grid",
            gap: "0.55rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.65rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9a9388" }}>
              live summary
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: "#d4af37",
                boxShadow: "0 0 8px rgba(230,178,36,0.34)",
              }}
            />
          </div>
          {footer}
        </div>
      ) : null}
    </aside>
  );
}
