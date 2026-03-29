import React, { useMemo } from "react";
import { motion } from "framer-motion";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function TrendsChart({
  data = [],
  title = "Trends",
  subtitle = "Signal dynamics",
  height = 260,
  className = "",
  style
}) {
  const points = useMemo(() => {
    if (!data.length) return [];

    const values = data.map((item) => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return data.map((item, index) => {
      const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
      const y = 84 - ((clamp(item.value, min, max) - min) / range) * 60;
      return { ...item, x, y };
    });
  }, [data]);

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`
    : "";

  return (
    <section
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: 20,
        borderRadius: 24,
        border: "2px solid rgba(30,58,95,0.32)",
        background:
          "linear-gradient(180deg, rgba(21,22,25,0.98), rgba(16,17,19,0.96)), radial-gradient(circle at top right, rgba(30,58,95,0.08), transparent 32%)",
        boxShadow: "0 18px 36px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.02)",
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
          backgroundSize: "24px 24px",
          opacity: 0.16,
          pointerEvents: "none"
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
          <div>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                color: "#9b9488",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase"
              }}
            >
              trend layer
            </div>
            <h3
              style={{
                margin: "8px 0 0",
                color: "#f5ede1",
                fontSize: "1.18rem",
                fontWeight: 800,
                letterSpacing: "-0.03em"
              }}
            >
              {title}
            </h3>
            <p style={{ margin: "6px 0 0", color: "#b8b1a6", fontSize: 13, lineHeight: 1.5 }}>{subtitle}</p>
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
            {data[0]?.label ?? "T1"} - {data[data.length - 1]?.label ?? "T?"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 150px", gap: 14, alignItems: "stretch" }}>
          <div
            style={{
              height,
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)"
            }}
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
              <defs>
                <linearGradient id="atlasFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#b87c4f" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#b87c4f" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="atlasLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b87c4f" />
                  <stop offset="50%" stopColor="#d4af57" />
                  <stop offset="100%" stopColor="#1e3a5f" />
                </linearGradient>
              </defs>

              {[18, 34, 50, 66, 82].map((grid) => (
                <line key={grid} x1="0" y1={grid} x2="100" y2={grid} stroke="rgba(212,197,176,0.08)" strokeDasharray="2 4" />
              ))}
              {[12, 28, 44, 60, 76, 92].map((grid) => (
                <line key={`v-${grid}`} x1={grid} y1="0" x2={grid} y2="100" stroke="rgba(212,197,176,0.04)" />
              ))}

              {areaPath ? <path d={areaPath} fill="url(#atlasFill)" /> : null}
              {linePath ? (
                <motion.path
                  d={linePath}
                  fill="none"
                  stroke="url(#atlasLine)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              ) : null}

              {points.map((point, index) => (
                <motion.g
                  key={`${point.label}-${point.value}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.08 }}
                >
                  <circle cx={point.x} cy={point.y} r="4.2" fill="rgba(212,175,87,0.18)" />
                  <circle cx={point.x} cy={point.y} r="2" fill="#f5ede1" />
                </motion.g>
              ))}
            </svg>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {[
              { label: "Slope", value: points.length >= 2 ? points[points.length - 1].value - points[0].value : 0 },
              { label: "Peak", value: points.length ? Math.max(...points.map((point) => point.value)) : 0 },
              { label: "Latest", value: points.length ? points[points.length - 1].value : 0 }
            ].map((item, index) => (
              <div
                key={item.label}
                style={{
                  padding: 14,
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: index === 0 ? "rgba(184,124,79,0.06)" : "rgba(255,255,255,0.03)"
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
                  {item.label}
                </div>
                <strong style={{ display: "block", marginTop: 6, color: "#f5ede1", fontSize: 18, fontWeight: 800 }}>
                  {item.value > 0 && item.label === "Slope" ? "+" : ""}
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {points.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(points.length, 4)}, minmax(0, 1fr))`,
              gap: 10
            }}
          >
            {points.slice(-4).map((point) => (
              <div
                key={`${point.label}-legend`}
                style={{
                  padding: 12,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)"
                }}
              >
                <div
                  style={{
                    color: "#9b9488",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase"
                  }}
                >
                  {point.label}
                </div>
                <strong style={{ display: "block", marginTop: 6, color: "#f5ede1", fontSize: 16 }}>{point.value}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 14,
              borderRadius: 18,
              border: "1px dashed rgba(212,197,176,0.18)",
              color: "#9b9488",
              textAlign: "center",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase"
            }}
          >
            no trend data
          </div>
        )}
      </div>
    </section>
  );
}
