import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BrainCircuit, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import GlowButton from "../common/GlowButton";
import PredictionCard from "./PredictionCard";
import SimilarCasesList from "./SimilarCasesList";

function useTypewriter(lines, speed = 18) {
  const textSource = useMemo(() => (Array.isArray(lines) ? lines.filter(Boolean).join(" ") : lines || ""), [lines]);
  const [text, setText] = useState("");

  useEffect(() => {
    setText("");

    if (!textSource) {
      return undefined;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setText(textSource.slice(0, index));

      if (index >= textSource.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [speed, textSource]);

  return text;
}

export default function AdvisorPanel({
  title = "AI advisor",
  prediction,
  confidence = 0,
  explanation = [],
  evidence = [],
  similarCases = [],
  onWhy,
  onEscalate,
  onReject,
  className = "",
  style
}) {
  const explanationItems = Array.isArray(explanation) ? explanation : [explanation].filter(Boolean);
  const confidenceTone = confidence >= 70 ? "success" : confidence >= 40 ? "warning" : "danger";
  const typedLead = useTypewriter(explanationItems, 18);

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      style={{
        position: "relative",
        display: "grid",
        gap: "1rem",
        padding: "1.1rem",
        borderRadius: "26px",
        border: "2px solid rgba(212,175,55,0.14)",
        background:
          "linear-gradient(180deg, rgba(20,21,24,0.98), rgba(15,16,18,0.98)), radial-gradient(circle at top right, rgba(184,124,79,0.1), transparent 24%), radial-gradient(circle at top left, rgba(30,58,95,0.08), transparent 20%)",
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
          opacity: 0.11,
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
            gridTemplateColumns: "minmax(0, 1.25fr) minmax(260px, 0.75fr)",
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
              gap: "0.9rem"
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <span className="pill pill--info">
                <BrainCircuit size={14} />
                Explainability
              </span>
              <span className={`pill pill--${confidenceTone}`}>
                <AlertTriangle size={14} />
                Manual review
              </span>
            </div>

            <div style={{ display: "grid", gap: "0.35rem", maxWidth: 760 }}>
              <div style={{ color: "#8c8377", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                Analytical module
              </div>
              <h2 style={{ margin: 0, fontSize: "1.68rem", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#f4efe8" }}>
                {title}
              </h2>
              <p style={{ margin: 0, color: "#c4b9ad", fontSize: "0.93rem", lineHeight: 1.65 }}>
                AI compares district signals and writes the reason. The expert signs the final move.
              </p>
            </div>

            {prediction ? (
              <PredictionCard
                label={prediction.label}
                value={prediction.value}
                confidence={prediction.confidence ?? confidence}
                delta={prediction.delta}
                explanation={prediction.summary}
              />
            ) : null}
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
              Final call stays human.
            </div>
            <div style={{ color: "#c4b9ad", fontSize: "0.9rem", lineHeight: 1.62 }}>
              Escalate or reject. The audit trail stays visible.
            </div>

            <div
              style={{
                padding: "0.9rem",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                display: "grid",
                gap: "0.75rem",
                minHeight: 120
              }}
            >
              <div style={{ color: "#8c8377", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                Why this result
              </div>
              <div style={{ display: "grid", gap: "0.45rem", color: "#f0e7db", lineHeight: 1.55 }}>
                {typedLead ? <p style={{ margin: 0 }}>{typedLead}</p> : null}
                {!typedLead && explanationItems.length ? explanationItems.map((item) => <p key={item} style={{ margin: 0 }}>{item}</p>) : null}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: "0.45rem",
                padding: "0.85rem",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", color: "#b7aa9a", fontSize: "0.82rem" }}>
                <span>Confidence</span>
                <strong style={{ color: "#f4efe8" }}>{Math.round(confidence || 0)}%</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", color: "#b7aa9a", fontSize: "0.82rem" }}>
                <span>Review mode</span>
                <strong style={{ color: "#f4efe8" }}>Manual</strong>
              </div>
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <GlowButton variant="ghost" onClick={onWhy}>
                Explain further
              </GlowButton>
              <GlowButton variant="ghost" onClick={onReject}>
                Reject case
              </GlowButton>
              <GlowButton onClick={onEscalate}>Escalate</GlowButton>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" }}>
          <div
            style={{
              padding: "1rem",
              borderRadius: "20px",
              border: "2px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              display: "grid",
              gap: "0.8rem"
            }}
          >
            <div style={{ fontWeight: 800, color: "#f4efe8", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <BrainCircuit size={16} />
              Evidence window
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <span className="pill pill--info">Source-backed</span>
              <span className="pill pill--warning">Annotated</span>
            </div>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {explanationItems.length ? (
                explanationItems.map((item, index) => (
                  <div
                    key={`${index}-${item}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "0.7rem",
                      alignItems: "start",
                      color: "#d7ddf6",
                      lineHeight: 1.55
                    }}
                  >
                    <span
                      style={{
                        marginTop: "0.3rem",
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: "linear-gradient(180deg, #1e3a5f, #b87c4f)",
                        flex: "0 0 auto"
                      }}
                    />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <div style={{ color: "#8c8377", fontSize: "0.88rem" }}>No evidence yet.</div>
              )}
            </div>
          </div>

          <SimilarCasesList cases={similarCases} />
        </div>
      </div>
    </motion.section>
  );
}
