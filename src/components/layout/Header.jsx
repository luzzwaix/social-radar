import React from "react";
import { Layers3, MapPinned, ShieldCheck } from "lucide-react";
import GlowButton from "../common/GlowButton";

const shellStyle = {
  position: "relative",
  overflow: "hidden",
  display: "grid",
  gap: "0.72rem",
  padding: "0.88rem 0.95rem",
  borderRadius: "22px",
  border: "2px solid rgba(212, 197, 176, 0.14)",
  background:
    "linear-gradient(180deg, rgba(19, 20, 23, 0.99), rgba(14, 15, 18, 0.98)), radial-gradient(circle at top left, rgba(30,58,95,0.1), transparent 28%), radial-gradient(circle at bottom right, rgba(184,124,79,0.08), transparent 26%)",
  boxShadow: "0 22px 44px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255,255,255,0.02)",
};

function Tag({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45rem",
        padding: "0.38rem 0.62rem",
        borderRadius: "999px",
        border: "1px solid rgba(212, 197, 176, 0.16)",
        background: "rgba(255,255,255,0.012)",
        color: "#d8cfbf",
        fontSize: "0.68rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "0.24rem",
        padding: "0.7rem 0.76rem",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.014)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ color: "#8f8a81", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
        {label}
      </div>
      <strong style={{ color: "#f2eadf", fontSize: "0.88rem", fontWeight: 700 }}>{value}</strong>
    </div>
  );
}

export default function Header({
  title = "SocialRadar",
  subtitle = "Explainable social risk intelligence workspace",
  status = "Online",
  district = "Almaty",
  actions = [],
  onPrimaryAction,
  primaryActionLabel = "Start simulation",
  className = "",
  style,
}) {
  return (
    <header className={className} style={{ ...shellStyle, ...style }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.7), transparent 92%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "1.05rem",
          right: "1.05rem",
          bottom: 0,
          height: 3,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(30,58,95,0.18), rgba(230,178,36,0.56), rgba(184,124,79,0.78))",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.18fr) minmax(300px, 0.82fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <div style={{ minWidth: 0, display: "grid", gap: "0.9rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <Tag>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 2,
                  background: "#e6b422",
                  boxShadow: "0 0 8px rgba(230,178,36,0.28)",
                }}
              />
              {status}
            </Tag>
            <Tag>
              <Layers3 size={14} />
              Bureau mode
            </Tag>
            <Tag>
              <ShieldCheck size={14} />
              Human review
            </Tag>
          </div>

          <div style={{ display: "grid", gap: "0.3rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#e6b422",
                }}
              >
                Almaty planning bureau
              </span>
              <span style={{ color: "#8f8a81", fontSize: "0.75rem" }}>/{district}</span>
            </div>
            <h1
              style={{
                margin: 0,
                maxWidth: 700,
                fontSize: "clamp(1.55rem, 2.4vw, 2.5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.06em",
                color: "#f3eadf",
                textTransform: "uppercase",
              }}
            >
              {title}
            </h1>
            <p style={{ margin: 0, maxWidth: 620, color: "#c0b3a0", lineHeight: 1.45, fontSize: "0.86rem" }}>
              {subtitle}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "0.7rem",
            padding: "0.78rem",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.055)",
            background:
              "linear-gradient(180deg, rgba(22, 23, 26, 0.97), rgba(17, 18, 21, 0.96)), radial-gradient(circle at top right, rgba(184,124,79,0.06), transparent 28%)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.45rem" }}>
            <Stat label="Mode" value="Live demo" />
            <Stat label="AI" value="Explainable" />
            <Stat label="Flow" value="Human-led" />
          </div>

          <div
            style={{
              display: "grid",
              gap: "0.7rem",
              padding: "0.85rem",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.013)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {actions.map((action) => (
                <GlowButton
                  key={action.label}
                  as={action.as || "button"}
                  variant={action.variant || "ghost"}
                  onClick={action.onClick}
                  size="sm"
                >
                  {action.label}
                </GlowButton>
              ))}
            </div>

            {onPrimaryAction ? (
              <GlowButton onClick={onPrimaryAction} leftIcon={<MapPinned size={15} />} size="sm" style={{ width: "fit-content" }}>
                {primaryActionLabel}
              </GlowButton>
            ) : null}
          </div>

          <div style={{ display: "grid", gap: "0.45rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.75rem",
                color: "#9a9388",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              <span>Operational line</span>
              <span>{district}</span>
            </div>
            <div
              aria-hidden="true"
              style={{
                height: 6,
                overflow: "hidden",
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  width: "72%",
                  height: "100%",
                  borderRadius: "inherit",
                  background: "linear-gradient(90deg, rgba(30,58,95,0.9), rgba(230,178,36,0.74), rgba(184,124,79,0.88))",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
