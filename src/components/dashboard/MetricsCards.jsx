import React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Building2, Landmark, School2, ShieldPlus } from "lucide-react";
import AnimatedNumber from "../common/AnimatedNumber";

const icons = {
  budget: Landmark,
  trust: ShieldPlus,
  infrastructure: Building2,
  education: School2
};

function kindFromLabel(label = "") {
  const value = label.toLowerCase();
  if (value.includes("budget")) return "budget";
  if (value.includes("trust")) return "trust";
  if (value.includes("infra")) return "infrastructure";
  if (value.includes("education")) return "education";
  return "default";
}

const cardTones = [
  { border: "rgba(184,124,79,0.38)", glow: "rgba(184,124,79,0.10)", stripe: "#b87c4f" },
  { border: "rgba(30,58,95,0.42)", glow: "rgba(30,58,95,0.12)", stripe: "#1e3a5f" },
  { border: "rgba(230,178,36,0.42)", glow: "rgba(230,178,36,0.11)", stripe: "#e6b422" },
  { border: "rgba(212,197,176,0.3)", glow: "rgba(212,197,176,0.1)", stripe: "#d4c5b0" }
];

export default function MetricsCards({ metrics = [], className = "", style }) {
  return (
    <section
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        ...style
      }}
    >
      {metrics.map((metric, index) => {
        const tone = cardTones[index % cardTones.length];
        const kind = kindFromLabel(metric.label);
        const Icon = icons[kind] ?? Building2;
        const delta = Number(metric.delta ?? 0);
        const hasNumericValue = typeof metric.value !== "string";

        return (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: index * 0.08, ease: "easeOut" }}
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: 182,
              borderRadius: 22,
              border: `2px solid ${tone.border}`,
              background:
                "linear-gradient(180deg, rgba(21,22,24,0.98), rgba(16,17,19,0.97)), linear-gradient(135deg, rgba(184,124,79,0.05), rgba(30,58,95,0.05))",
              boxShadow: "0 18px 36px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.02)",
              padding: 18
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(212,197,176,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,197,176,0.04) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
                opacity: 0.24,
                pointerEvents: "none"
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "auto 0 0 0",
                height: 4,
                background: `linear-gradient(90deg, ${tone.stripe}, rgba(212,197,176,0.06))`,
                opacity: 0.9
              }}
            />

            <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: tone.stripe
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: 10,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#8c867b"
                      }}
                    >
                      metric {String(index + 1).padStart(2, "0")}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        color: "#f2eadf",
                        fontWeight: 800,
                        fontSize: 15,
                        letterSpacing: "-0.02em"
                      }}
                    >
                      {metric.label}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#c6baa6",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase"
                  }}
                >
                  atlas
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                {hasNumericValue ? (
                  <AnimatedNumber
                    value={metric.value}
                    suffix={metric.suffix ?? ""}
                    className="atlas-metric-number"
                    style={{
                      color: "#f7efe3",
                      fontSize: "clamp(1.85rem, 2.8vw, 2.7rem)",
                      lineHeight: 1,
                      fontWeight: 800,
                      letterSpacing: "-0.06em"
                    }}
                  />
                ) : (
                  <strong
                    style={{
                      color: "#f7efe3",
                      fontSize: "clamp(1.85rem, 2.8vw, 2.7rem)",
                      lineHeight: 1,
                      fontWeight: 800,
                      letterSpacing: "-0.06em"
                    }}
                  >
                    {metric.value}
                  </strong>
                )}

                {metric.delta != null ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 8px",
                      borderRadius: 999,
                      background: delta >= 0 ? "rgba(110,152,132,0.16)" : "rgba(182,90,68,0.16)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: delta >= 0 ? "#dce8e2" : "#f0d2ca",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 11,
                      letterSpacing: "0.08em"
                    }}
                  >
                    {delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {delta >= 0 ? "+" : ""}
                    {metric.delta}
                  </span>
                ) : null}
              </div>

              {metric.description ? (
                <p
                  style={{
                    margin: 0,
                    color: "#b9b1a6",
                    fontSize: 13,
                    lineHeight: 1.55,
                    maxWidth: 280
                  }}
                >
                  {metric.description}
                </p>
              ) : null}

              <div style={{ display: "grid", gap: 8 }}>
                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${64 + (index % 4) * 7}%` }}
                    transition={{ duration: 0.75, delay: 0.18 + index * 0.08, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      borderRadius: "inherit",
                      background: `linear-gradient(90deg, ${tone.stripe}, rgba(212,197,176,0.82))`
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#8c867b"
                  }}
                >
                  <span>section load</span>
                  <span>active layer</span>
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}
