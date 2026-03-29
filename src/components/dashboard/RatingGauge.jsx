import React, { useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "../common/AnimatedNumber";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function zoneFromValue(value) {
  if (value < 40) return { tone: "risk", label: "intervention", color: "#b65a44" };
  if (value < 70) return { tone: "watch", label: "stabilizing", color: "#d2a54f" };
  return { tone: "ready", label: "healthy", color: "#6e9884" };
}

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angle = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function RatingGauge({
  value = 0,
  max = 100,
  label = "Rating",
  sublabel = "Decision quality",
  className = "",
  style
}) {
  const safeValue = clamp(value, 0, max || 100);
  const progress = safeValue / (max || 100);
  const zone = useMemo(() => zoneFromValue(safeValue), [safeValue]);
  const trackPath = useMemo(() => describeArc(140, 140, 102, 180, 360), []);
  const progressPath = useMemo(() => describeArc(140, 140, 102, 180, 180 + progress * 180), [progress]);
  const markers = [0, 25, 50, 75, 100];

  return (
    <section
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: 20,
        borderRadius: 24,
        border: "2px solid rgba(184,124,79,0.24)",
        background:
          "linear-gradient(180deg, rgba(22,23,25,0.98), rgba(18,19,21,0.96)), radial-gradient(circle at top right, rgba(30,58,95,0.08), transparent 30%)",
        boxShadow: "0 18px 36px rgba(0,0,0,0.24), inset 0 0 0 1px rgba(255,255,255,0.02)",
        ...style
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(212,197,176,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,197,176,0.04) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.16,
          pointerEvents: "none"
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                color: "#9b9488",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase"
              }}
            >
              civic score
            </div>
            <div
              style={{
                marginTop: 8,
                color: "#f5ede1",
                fontSize: "1.16rem",
                fontWeight: 800,
                letterSpacing: "-0.03em"
              }}
            >
              {label}
            </div>
            <p style={{ marginTop: 6, color: "#b8b1a6", fontSize: 13, lineHeight: 1.5 }}>{sublabel}</p>
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "#d8cbb8",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase"
            }}
          >
            live gauge
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["0-39 intervention", "40-69 stabilizing", "70-100 healthy"].map((chip, index) => (
            <span
              key={chip}
              style={{
                padding: "7px 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  index === 0
                    ? "rgba(182,90,68,0.12)"
                    : index === 1
                      ? "rgba(210,165,79,0.12)"
                      : "rgba(110,152,132,0.12)",
                color: "#efe6da",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase"
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 148px", gap: 16, alignItems: "center" }}>
          <div style={{ display: "grid", placeItems: "center", position: "relative" }}>
            <svg viewBox="0 0 280 200" width="100%" height="100%" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="gaugeAtlasTrack" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b65a44" />
                  <stop offset="50%" stopColor="#d2a54f" />
                  <stop offset="100%" stopColor="#6e9884" />
                </linearGradient>
              </defs>

              <path d={trackPath} fill="none" stroke="rgba(212,197,176,0.12)" strokeWidth="18" strokeLinecap="round" />
              <motion.path
                d={progressPath}
                fill="none"
                stroke="url(#gaugeAtlasTrack)"
                strokeWidth="18"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              {markers.map((tick) => {
                const point = polarToCartesian(140, 140, 114, 180 + tick * 1.8);
                return (
                  <rect
                    key={tick}
                    x={point.x - 1.8}
                    y={point.y - 7}
                    width="3.6"
                    height="14"
                    rx="1.4"
                    fill="rgba(245,236,220,0.6)"
                  />
                );
              })}

              <circle cx="140" cy="140" r="24" fill={zone.color} opacity="0.14" />
              <circle cx="140" cy="140" r="8.5" fill={zone.color} />
            </svg>

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                pointerEvents: "none"
              }}
            >
              <div style={{ display: "grid", justifyItems: "center", gap: 3 }}>
                <AnimatedNumber
                  value={safeValue}
                  className="atlas-gauge-number"
                  style={{
                    color: "#f7efe3",
                    fontSize: "2.8rem",
                    fontWeight: 800,
                    letterSpacing: "-0.08em",
                    lineHeight: 1
                  }}
                />
                <span
                  style={{
                    color: "#9b9488",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 10,
                    letterSpacing: "0.18em"
                  }}
                >
                  / {max}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)"
              }}
            >
              <div
                style={{
                  color: "#9b9488",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase"
                }}
              >
                zone
              </div>
              <div style={{ marginTop: 6, color: "#f5ede1", fontWeight: 800, letterSpacing: "-0.02em" }}>{zone.label}</div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)"
              }}
            >
              <div
                style={{
                  color: "#9b9488",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase"
                }}
              >
                progress
              </div>
              <div style={{ marginTop: 6, color: "#f5ede1", fontWeight: 800 }}>{Math.round(progress * 100)}%</div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)"
              }}
            >
              <div
                style={{
                  color: "#9b9488",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase"
                }}
              >
                model
              </div>
              <div style={{ marginTop: 6, color: "#f5ede1", fontWeight: 800 }}>expert approved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
