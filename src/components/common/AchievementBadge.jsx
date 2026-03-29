import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

export default function AchievementBadge({
  title,
  description,
  icon,
  unlocked = true,
  tone = "neutral",
  className = "",
  style
}) {
  const toneColor =
    tone === "success" ? "#2f6f4e" : tone === "warning" ? "#b46b31" : tone === "danger" ? "#8d4a3d" : "#66708b";
  const glow =
    tone === "success"
      ? "rgba(47, 111, 78, 0.16)"
      : tone === "warning"
        ? "rgba(180, 107, 49, 0.16)"
        : tone === "danger"
          ? "rgba(141, 74, 61, 0.16)"
          : "rgba(102, 112, 139, 0.16)";

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "0.9rem",
        padding: "0.95rem",
        borderRadius: "20px",
        border: `1px solid ${glow}`,
        background: "linear-gradient(135deg, rgba(18,20,27,0.95) 0%, rgba(12,14,19,0.95) 100%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset, 0 18px 35px rgba(0,0,0,0.22)",
        opacity: unlocked ? 1 : 0.64,
        position: "relative",
        overflow: "hidden",
        ...style
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "auto -30px -36px auto",
          width: 120,
          height: 120,
          borderRadius: "999px",
          background: glow,
          filter: "blur(18px)",
          pointerEvents: "none"
        }}
      />
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          display: "grid",
          placeItems: "center",
          color: toneColor,
          background: "linear-gradient(180deg, rgba(245,236,220,0.09), rgba(245,236,220,0.03))",
          boxShadow: `0 0 0 1px ${toneColor}24 inset, 0 18px 26px rgba(0,0,0,0.15)`,
          flex: "0 0 auto",
          position: "relative"
        }}
      >
        <div style={{ display: "grid", placeItems: "center" }}>{icon}</div>
        <div
          style={{
            position: "absolute",
            right: -4,
            top: -4,
            width: 18,
            height: 18,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "rgba(245,236,220,0.94)",
            color: "#111827",
            boxShadow: "0 0 12px rgba(255,255,255,0.22)"
          }}
        >
          {unlocked ? <Trophy size={11} /> : <Sparkles size={11} />}
        </div>
      </div>
      <div style={{ minWidth: 0, flex: 1, position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem"
          }}
        >
          <div style={{ fontWeight: 800, color: "#f5efe4", letterSpacing: "0.01em" }}>{title}</div>
          <span
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: toneColor
            }}
          >
            {unlocked ? "Unlocked" : "Locked"}
          </span>
        </div>
        <div style={{ marginTop: "0.3rem", fontSize: "0.88rem", color: "#c8baa7", lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
    </motion.div>
  );
}
