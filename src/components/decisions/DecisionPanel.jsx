import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import DecisionCard from "./DecisionCard";
import GlowButton from "../common/GlowButton";

const panelMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, ease: "easeOut" }
};

export default function DecisionPanel({
  title = "Decisions",
  subtitle = "Human-in-the-loop city control",
  budget = 0,
  decisions = [],
  selectedId,
  onSelectDecision,
  onEscalate,
  onReject,
  className = "",
  style
}) {
  const selectedDecision = decisions.find((decision) => decision.id === selectedId);
  const lockedCount = decisions.filter((decision) => decision.disabled).length;

  return (
    <motion.section
      {...panelMotion}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "1.1rem",
        borderRadius: "26px",
        border: "2px solid rgba(212,175,55,0.14)",
        background:
          "linear-gradient(180deg, rgba(20,21,24,0.98), rgba(15,16,18,0.98)), radial-gradient(circle at top left, rgba(184,124,79,0.1), transparent 26%), radial-gradient(circle at top right, rgba(30,58,95,0.08), transparent 22%)",
        boxShadow: "0 20px 46px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.02) inset",
        ...style
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.12,
          pointerEvents: "none",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.88), transparent 96%)"
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          height: 6,
          background: "linear-gradient(90deg, #1e3a5f 0%, #b87c4f 55%, #d4af37 100%)"
        }}
      />

      <div style={{ position: "relative", display: "grid", gap: "1rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(300px, 0.9fr)",
            gap: "0.9rem",
            alignItems: "stretch"
          }}
        >
          <div
            style={{
              padding: "1rem",
              borderRadius: "20px",
              border: "2px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              display: "grid",
              gap: "0.85rem"
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <span className="pill pill--info">
                <Sparkles size={14} />
                Explainable AI
              </span>
              <span className="pill pill--warning">
                <AlertTriangle size={14} />
                Manual approval
              </span>
            </div>

            <div style={{ display: "grid", gap: "0.35rem", maxWidth: 760 }}>
              <div style={{ color: "#8c8377", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                {subtitle}
              </div>
              <h2 style={{ margin: 0, fontSize: "1.68rem", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#f4efe8" }}>
                {title}
              </h2>
              <p style={{ margin: 0, color: "#c4b9ad", fontSize: "0.93rem", lineHeight: 1.65 }}>
                AI compares district signals and writes the reason. The expert signs the final move.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "0.75rem"
              }}
            >
              <div
                style={{
                  padding: "0.8rem",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)"
                }}
              >
                <div style={{ color: "#8c8377", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em" }}>
                  Budget
                </div>
                <div style={{ marginTop: "0.3rem", color: "#f4efe8", fontSize: "1.48rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {budget}
                </div>
              </div>
              <div
                style={{
                  padding: "0.8rem",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)"
                }}
              >
                <div style={{ color: "#8c8377", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em" }}>
                  Loaded
                </div>
                <div style={{ marginTop: "0.3rem", color: "#f4efe8", fontSize: "1.48rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {decisions.length}
                </div>
              </div>
              <div
                style={{
                  padding: "0.8rem",
                  borderRadius: "16px",
                  border: "2px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)"
                }}
              >
                <div style={{ color: "#8c8377", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em" }}>
                  Locked
                </div>
                <div style={{ marginTop: "0.3rem", color: "#f4efe8", fontSize: "1.48rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {lockedCount}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              borderRadius: "20px",
              border: "2px solid rgba(255,255,255,0.06)",
              background: "linear-gradient(180deg, rgba(30,58,95,0.08), rgba(255,255,255,0.02))",
              display: "grid",
              gap: "0.8rem",
              alignContent: "start"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d4af37", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.16em" }}>
              <ShieldCheck size={14} />
              Human gate
            </div>
            <div style={{ color: "#f4efe8", fontSize: "1.02rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Expert remains in charge.
            </div>
            <div style={{ color: "#c4b9ad", fontSize: "0.9rem", lineHeight: 1.62 }}>
              Reject keeps the audit trail. Escalate sends the case back with context.
            </div>
            <div
              style={{
                display: "grid",
                gap: "0.55rem",
                padding: "0.85rem",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", color: "#b7aa9a", fontSize: "0.82rem" }}>
                <span>Current selection</span>
                <strong style={{ color: "#f4efe8" }}>{selectedDecision ? "Marked" : "None"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", color: "#b7aa9a", fontSize: "0.82rem" }}>
                <span>Review mode</span>
                <strong style={{ color: "#f4efe8" }}>Manual</strong>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "1rem",
            borderRadius: "20px",
            border: "2px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            display: "grid",
            gap: "0.85rem"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ display: "grid", gap: "0.18rem" }}>
              <span style={{ color: "#8c8377", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                Decision stack
              </span>
              <strong style={{ color: "#f4efe8", fontSize: "1rem", letterSpacing: "-0.02em" }}>
                {selectedDecision ? selectedDecision.title : "Select a move"}
              </strong>
            </div>
            <span className="pill pill--success">
              <ChevronRight size={13} />
              Review in order
            </span>
          </div>

          <div style={{ display: "grid", gap: "0.8rem" }}>
            {decisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                title={decision.title}
                description={decision.description}
                cost={decision.cost}
                costLabel={decision.costLabel}
                icon={decision.icon}
                iconElement={decision.iconElement}
                impact={decision.impact}
                aiAdvice={decision.aiAdvice}
                budgetLeft={budget}
                selected={selectedId === decision.id}
                disabled={decision.disabled}
                onClick={() => onSelectDecision?.(decision)}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: "0.9rem",
            alignItems: "center"
          }}
        >
          <div
            style={{
              padding: "0.9rem 0.95rem",
              borderRadius: "18px",
              border: "2px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.025)",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.55rem",
              alignItems: "center"
            }}
          >
            <span className="pill pill--success">
              <ShieldCheck size={14} />
              Human-in-the-loop active
            </span>
            <span style={{ color: "#b7aa9a", fontSize: "0.88rem", lineHeight: 1.5 }}>
              Final approval stays with the expert. Every reject and escalation is logged.
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <GlowButton variant="ghost" onClick={onReject}>
              Reject
            </GlowButton>
            <GlowButton onClick={onEscalate}>Escalate</GlowButton>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
