import React from "react";
import { motion } from "framer-motion";
import { ChevronsRight, Database, Sparkles } from "lucide-react";

export default function SimilarCasesList({ cases = [], title = "Similar cases", className = "", style }) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "0.95rem",
        borderRadius: "20px",
        border: "2px solid rgba(255,255,255,0.06)",
        background:
          "linear-gradient(180deg, rgba(20,21,24,0.98), rgba(15,16,18,0.98)), radial-gradient(circle at top right, rgba(30,58,95,0.08), transparent 22%)",
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
          opacity: 0.08,
          pointerEvents: "none",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent 96%)"
        }}
      />

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "grid", gap: "0.2rem" }}>
          <div style={{ color: "#8c8377", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.16em" }}>
            Reference archive
          </div>
          <div style={{ fontWeight: 800, color: "#f4efe8", display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Database size={16} />
            {title}
          </div>
        </div>
        <span className="pill pill--info">
          <Sparkles size={13} />
          Source trail
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.9rem", position: "relative" }}>
        {cases.length ? (
          cases.map((item, index) => (
            <motion.article
              key={item.id || item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: index * 0.05 }}
              style={{
                position: "relative",
                padding: "0.85rem",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,0.05)",
                background: index === 0 ? "rgba(30,58,95,0.08)" : "rgba(255,255,255,0.02)"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 5,
                  background: index === 0 ? "linear-gradient(180deg, #d4af37, #b87c4f)" : "linear-gradient(180deg, #1e3a5f, #b87c4f)"
                }}
              />

              <div style={{ display: "grid", gap: "0.55rem", paddingLeft: "0.35rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "36px minmax(0, 1fr) auto", gap: "0.75rem", alignItems: "start" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "10px",
                      border: "2px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      color: "#f4efe8",
                      fontWeight: 800,
                      fontSize: "0.8rem"
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: "#f4efe8", lineHeight: 1.25 }}>{item.title}</div>
                    <div style={{ marginTop: "0.26rem", color: "#b6ab9f", fontSize: "0.86rem", lineHeight: 1.55 }}>
                      {item.summary}
                    </div>
                  </div>

                  {item.similarity != null ? (
                    <div style={{ color: "#e8dfd3", fontWeight: 800, flex: "0 0 auto", display: "grid", justifyItems: "end", gap: "0.35rem", minWidth: 94 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        {item.similarity}%
                        <ChevronsRight size={14} />
                      </div>
                      <div
                        style={{
                          width: 88,
                          height: 6,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.06)",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(0, Math.min(100, item.similarity))}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: "linear-gradient(90deg, #1e3a5f, #b87c4f, #d4af37)"
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                {item.source || item.result ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                    {item.source ? (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "0.28rem 0.5rem",
                          borderRadius: 999,
                          background: "rgba(30,58,95,0.08)",
                          color: "#dce6f3",
                          border: "1px solid rgba(30,58,95,0.16)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em"
                        }}
                      >
                        {item.source}
                      </span>
                    ) : null}
                    {item.result ? (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "0.28rem 0.5rem",
                          borderRadius: 999,
                          background: "rgba(184,124,79,0.1)",
                          color: "#f1d4bf",
                          border: "1px solid rgba(184,124,79,0.16)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em"
                        }}
                      >
                        {item.result}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </motion.article>
          ))
        ) : (
          <div
            style={{
              padding: "0.95rem",
              borderRadius: "16px",
              border: "2px dashed rgba(255,255,255,0.12)",
              color: "#8c8377",
              lineHeight: 1.6,
              background: "rgba(255,255,255,0.02)"
            }}
          >
            No historical matches yet.
          </div>
        )}
      </div>
    </div>
  );
}
