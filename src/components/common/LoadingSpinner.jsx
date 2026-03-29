import React from "react";
import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";

export default function LoadingSpinner({ size = 36, label = "Loading", className = "", style }) {
  const frame = Math.max(5, Math.round(size / 8));

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        color: "#c8baa7",
        ...style
      }}
    >
      <div
        style={{
          position: "relative",
          width: size + 22,
          height: size + 22,
          display: "grid",
          placeItems: "center",
          borderRadius: "28px",
          background:
            "linear-gradient(180deg, rgba(245,236,220,0.05), rgba(245,236,220,0.02)), radial-gradient(circle, rgba(230,178,36,0.12), rgba(15,16,22,0) 66%)",
          border: "1px solid rgba(160,140,115,0.12)"
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "22px",
            border: `${frame}px solid rgba(160,140,115,0.16)`,
            borderTopColor: "rgba(230,178,36,0.95)",
            borderRightColor: "rgba(184,124,79,0.85)"
          }}
        />

        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
          style={{
            width: size * 0.44,
            height: size * 0.44,
            borderRadius: "18px",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(180deg, rgba(30,58,95,0.18), rgba(184,124,79,0.08))",
            color: "#f5efe4",
            border: "1px solid rgba(160,140,115,0.18)",
            boxShadow: "0 0 18px rgba(184,124,79,0.16)"
          }}
        >
          <MapPinned size={size * 0.28} />
        </motion.div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            animate={{ y: [0, -4, 0], opacity: [0.55, 1, 0.55] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: index * 0.12, ease: "easeInOut" }}
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: index === 1 ? "#e6b422" : index === 0 ? "#b87c4f" : "#1e3a5f"
            }}
          />
        ))}
      </div>

      <span style={{ fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}
