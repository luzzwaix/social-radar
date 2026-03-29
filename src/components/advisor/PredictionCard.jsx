import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Gauge, Landmark, Radar, Sparkles } from "lucide-react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function PredictionCard({
  label = "Prediction",
  value = "Low risk",
  confidence = 0,
  delta,
  explanation,
  className = "",
  style
}) {
  const safeConfidence = clamp(confidence, 0, 100);
  const tone = safeConfidence >= 70 ? "#4f9a64" : safeConfidence >= 40 ? "#b87c4f" : "#a65347";
  const support = safeConfidence >= 70 ? "stable" : safeConfidence >= 40 ? "monitor" : "review";
  const [displayConfidence, setDisplayConfidence] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const from = displayConfidence;
    const duration = 1200;

    const step = (now) => {
      const progress = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayConfidence(from + (safeConfidence - from) * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [safeConfidence]);

  const ticks = useMemo(() => Array.from({ length: 12 }, (_, index) => index), []);
  const displayed = Math.round(displayConfidence);
  const filled = Math.round((displayConfidence / 100) * ticks.length);
  const arcValue = displayConfidence / 100;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "1rem",
        borderRadius: "20px",
        border: "2px solid rgba(255,255,255,0.06)",
        background:
          "linear-gradient(180deg, rgba(20,21,24,0.98), rgba(15,16,18,0.98)), radial-gradient(circle at top right, rgba(184,124,79,0.1), transparent 24%), radial-gradient(circle at left, rgba(30,58,95,0.08), transparent 20%)",
        boxShadow: "0 16px 34px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.02) inset",
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
          backgroundSize: "24px 24px",
          opacity: 0.1,
          pointerEvents: "none",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.88), transparent 96%)"
        }}
      />

      <div style={{ position: "relative", display: "grid", gap: "0.95rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 160px", gap: "0.9rem", alignItems: "center" }}>
          <div style={{ minWidth: 0, display: "grid", gap: "0.5rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.55rem" }}>
              <span style={{ fontSize: "0.68rem", color: "#b87c4f", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                {label}
              </span>
              <span className="pill pill--info">
                <Radar size={13} />
                Forecast
              </span>
            </div>
            <div style={{ fontSize: "1.42rem", fontWeight: 800, color: "#f4efe8", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              {value}
            </div>
            <div style={{ color: "#b8aea2", fontSize: "0.88rem", lineHeight: 1.55, maxWidth: 520 }}>
              {explanation}
            </div>
          </div>

          <div style={{ display: "grid", justifyItems: "center", gap: "0.35rem" }}>
            <svg viewBox="0 0 120 72" width="120" height="72" aria-hidden="true" style={{ overflow: "visible" }}>
              <path
                d="M18 60 A42 42 0 0 1 102 60"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <motion.path
                d="M18 60 A42 42 0 0 1 102 60"
                fill="none"
                stroke={tone}
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: arcValue }}
                transition={{ duration: 1.25, ease: "easeOut" }}
              />
            </svg>
            <div style={{ marginTop: "-1.6rem", display: "grid", justifyItems: "center", gap: "0.08rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: tone, fontWeight: 800, letterSpacing: "-0.02em" }}>
                <Gauge size={14} />
                {displayed}%
              </div>
              <div style={{ color: "#91867b", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em" }}>
                {support}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.65rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: 4 }}>
            {ticks.map((tick) => (
              <span
                key={tick}
                style={{
                  height: 8,
                  borderRadius: 999,
                  background:
                    tick < filled
                      ? "linear-gradient(180deg, #1e3a5f 0%, #b87c4f 55%, #d4af37 100%)"
                      : "rgba(255,255,255,0.08)"
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            <span className={`pill pill--${safeConfidence >= 70 ? "success" : safeConfidence >= 40 ? "warning" : "danger"}`}>
              {support === "stable" ? "Stable" : support === "monitor" ? "Monitor" : "Review"}
            </span>
            <span className="pill pill--info">
              <Sparkles size={13} />
              Explainable
            </span>
            <span className="pill">
              <Landmark size={13} />
              Civic lens
            </span>
          </div>

          {delta ? (
            <div
              style={{
                padding: "0.8rem 0.9rem",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.025)",
                border: "2px solid rgba(255,255,255,0.06)",
                color: "#d9d2c8",
                fontSize: "0.88rem",
                lineHeight: 1.55
              }}
            >
              {delta}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
