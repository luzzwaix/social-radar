import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Flame, MapPin, Sparkles } from "lucide-react";

export default function HistoryTimeline({ events = [], title = "History of decisions", className = "", style }) {
  const toneConfig = {
    success: { icon: CheckCircle2, color: "#2f6f4e", label: "Applied" },
    warning: { icon: Flame, color: "#b46b31", label: "Escalated" },
    danger: { icon: MapPin, color: "#8d4a3d", label: "Rejected" },
    info: { icon: Sparkles, color: "#66708b", label: "Context" }
  };

  return (
    <section
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "1rem",
        borderRadius: "28px",
        border: "1px solid rgba(109, 94, 72, 0.18)",
        background:
          "linear-gradient(180deg, rgba(18, 20, 27, 0.96), rgba(11, 13, 18, 0.94)), radial-gradient(circle at top, rgba(174, 143, 96, 0.12), transparent 58%)",
        boxShadow: "0 24px 42px rgba(0,0,0,0.26)",
        ...style
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(245, 236, 220, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 236, 220, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.82), transparent 96%)"
        }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <div style={{ color: "#a58d68", fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Control Log
          </div>
          <div style={{ marginTop: "0.35rem", fontWeight: 800, color: "#f5efe4" }}>{title}</div>
        </div>
        <div
          style={{
            padding: "0.45rem 0.75rem",
            borderRadius: "999px",
            background: "rgba(245,236,220,0.06)",
            border: "1px solid rgba(245,236,220,0.12)",
            color: "#d8c8af",
            fontSize: "0.76rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          Live history
        </div>
      </div>

      <div style={{ marginTop: "0.95rem", display: "grid", gap: "0.8rem", position: "relative" }}>
        {events.map((event, index) => {
          const tone = toneConfig[event.tone] ?? toneConfig.info;
          const Icon = tone.icon;

          return (
            <motion.article
              key={event.id || `${event.time}-${event.title}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: index * 0.06, ease: "easeOut" }}
              style={{
                display: "grid",
                gridTemplateColumns: "20px minmax(0, 1fr)",
                gap: "0.8rem",
                alignItems: "start"
              }}
            >
              <div style={{ display: "grid", justifyItems: "center", gap: "0.2rem", paddingTop: "0.25rem" }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    color: tone.color,
                    background: "rgba(245,236,220,0.06)",
                    boxShadow: `0 0 0 1px ${tone.color}22 inset, 0 0 18px ${tone.color}10`
                  }}
                >
                  <Icon size={11} />
                </div>
                <div style={{ width: 2, minHeight: 44, flex: 1, background: "rgba(160,140,115,0.18)" }} />
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "0.9rem 0.95rem",
                  borderRadius: "18px",
                  border: "1px solid rgba(160,140,115,0.16)",
                  background: "linear-gradient(180deg, rgba(245,236,220,0.05), rgba(245,236,220,0.02))",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, color: "#f5efe4" }}>{event.title}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#9b8c78", fontSize: "0.76rem" }}>
                    <Clock3 size={12} />
                    {event.time}
                  </div>
                </div>
                {event.description ? (
                  <div style={{ marginTop: "0.35rem", color: "#c8baa7", fontSize: "0.88rem", lineHeight: 1.55 }}>
                    {event.description}
                  </div>
                ) : null}
                {event.meta ? (
                  <div style={{ marginTop: "0.55rem", display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                    {event.meta.map((meta) => (
                      <span
                        key={meta}
                        style={{
                          fontSize: "0.72rem",
                          padding: "0.28rem 0.55rem",
                          borderRadius: 999,
                          background: "rgba(176,144,98,0.12)",
                          color: "#e6d4b8",
                          border: "1px solid rgba(176,144,98,0.14)"
                        }}
                      >
                        {meta}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
