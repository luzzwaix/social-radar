import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "../../store/uiStore";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function TurnIndicator({
  turn = 1,
  maxTurns = 1,
  phase = "Preparation",
  district = "Almaty",
  timer,
  className = "",
  style
}) {
  const progress = clamp(turn / (maxTurns || 1), 0, 1);
  const flashKey = useUiStore((state) => state.turnFlashKey);

  const cards = useMemo(
    () => [
      { label: "district", value: district },
      { label: "phase", value: phase },
      { label: "tempo", value: timer || "live cycle" }
    ],
    [district, phase, timer]
  );

  return (
    <section
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: 18,
        borderRadius: 24,
        border: "2px solid rgba(30,58,95,0.3)",
        background:
          "linear-gradient(180deg, rgba(21,22,25,0.98), rgba(15,16,18,0.96)), radial-gradient(circle at top right, rgba(184,124,79,0.08), transparent 28%)",
        boxShadow: "0 18px 36px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.02)",
        ...style
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={flashKey}
          className="atlas-turn__flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.45, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </AnimatePresence>

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
              turn transition
            </div>
            <h3 style={{ margin: "8px 0 0", color: "#f5ede1", fontSize: "1.12rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Turn {turn} / {maxTurns}
            </h3>
            <p style={{ margin: "6px 0 0", color: "#b8b1a6", fontSize: 13, lineHeight: 1.5 }}>{phase}</p>
          </div>

          <motion.div
            key={turn}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid rgba(184,124,79,0.26)",
              background: "rgba(184,124,79,0.1)",
              color: "#f1ddc9",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase"
            }}
          >
            active round {turn}
          </motion.div>
        </div>

        <div
          style={{
            height: 12,
            overflow: "hidden",
            borderRadius: 999,
            background: "rgba(212,197,176,0.08)",
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              borderRadius: "inherit",
              background: "linear-gradient(90deg, #b87c4f, #e6b422, #1e3a5f)"
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, maxTurns)}, minmax(0, 1fr))`, gap: 6 }}>
          {Array.from({ length: maxTurns || 1 }).map((_, index) => (
            <span
              key={index}
              style={{
                height: 8,
                borderRadius: 999,
                background: index < turn ? "linear-gradient(90deg, #b87c4f, #e6b422)" : "rgba(255,255,255,0.08)"
              }}
            />
          ))}
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {cards.map((card, index) => (
            <motion.article
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
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
                {card.label}
              </div>
              <strong style={{ display: "block", marginTop: 6, color: "#f5ede1", fontSize: 14, fontWeight: 800 }}>
                {card.value}
              </strong>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
