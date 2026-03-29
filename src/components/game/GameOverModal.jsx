import React, { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Crown, Share2, Sparkles, Trophy } from "lucide-react";
import GlowButton from "../common/GlowButton";
import AchievementBadge from "../common/AchievementBadge";

export default function GameOverModal({
  open = false,
  score = 0,
  rating = 0,
  level = "A",
  district = "Almaty",
  achievements = [],
  leaderboard = [],
  onShare,
  onClose,
  className = "",
  style
}) {
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!open) {
      confettiFired.current = false;
      return;
    }

    if (confettiFired.current) return;
    confettiFired.current = true;

    const colors = ["#b87c4f", "#e6b422", "#1e3a5f", "#d4c5b0", "#f1eee7"];
    confetti({
      particleCount: 120,
      spread: 72,
      startVelocity: 28,
      gravity: 0.88,
      scalar: 0.92,
      colors,
      origin: { y: 0.72 }
    });
  }, [open]);

  const sortedLeaderboard = useMemo(
    () => [...leaderboard].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [leaderboard]
  );
  const leader = sortedLeaderboard[0];
  const rankIndex = sortedLeaderboard.findIndex((item) => item.name === district || item.id === district);
  const rankLabel = rankIndex >= 0 ? `#${rankIndex + 1}` : "#?";
  const medalTone = rating >= 80 ? "#2f6f4e" : rating >= 60 ? "#b46b31" : "#8d4a3d";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={className}
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            display: "grid",
            placeItems: "center",
            padding: "1rem",
            background:
              "radial-gradient(circle at top, rgba(160, 128, 84, 0.14), transparent 34%), rgba(8, 10, 14, 0.76)",
            backdropFilter: "blur(14px)",
            ...style
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            style={{
              width: "min(1080px, 100%)",
              maxHeight: "90vh",
              overflow: "auto",
              padding: "1.1rem",
              borderRadius: "32px",
              border: "1px solid rgba(156, 135, 103, 0.18)",
              background:
                "linear-gradient(180deg, rgba(18,20,27,0.98), rgba(11,13,18,0.96)), radial-gradient(circle at top left, rgba(230,178,36,0.12), transparent 30%)",
              boxShadow: "0 40px 90px rgba(0,0,0,0.48)",
              position: "relative"
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "0 auto auto 0",
                width: 240,
                height: 240,
                borderRadius: "0 0 240px 0",
                background: "linear-gradient(135deg, rgba(30,58,95,0.16), rgba(184,124,79,0.04))",
                pointerEvents: "none"
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", position: "relative", zIndex: 1 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#a58d68", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.76rem" }}>
                  Simulation complete
                </div>
                <h2 style={{ margin: "0.45rem 0 0", color: "#f5efe4", fontSize: "clamp(1.9rem, 3vw, 2.55rem)" }}>
                  Final rating: {rating}
                </h2>
                <div style={{ marginTop: "0.45rem", color: "#c8baa7", lineHeight: 1.6 }}>
                  District: {district} · Level: {level} · Score: {score} · Place: {rankLabel}
                </div>
              </div>
              <GlowButton variant="ghost" onClick={onClose}>
                Close
              </GlowButton>
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.12fr) minmax(300px, 0.88fr)",
                gap: "1rem"
              }}
            >
              <section
                style={{
                  padding: "1rem",
                  borderRadius: "24px",
                  border: "1px solid rgba(160,140,115,0.16)",
                  background: "rgba(245,236,220,0.03)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <div style={{ fontWeight: 800, color: "#f5efe4" }}>Achievements</div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: medalTone, fontSize: "0.78rem" }}>
                    <Sparkles size={13} />
                    {achievements.length} unlocked
                  </span>
                </div>
                <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.85rem" }}>
                  {achievements.length ? (
                    achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.title}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32, delay: index * 0.06, ease: "easeOut" }}
                      >
                        <AchievementBadge
                          title={achievement.title}
                          description={achievement.description}
                          icon={achievement.icon}
                          tone={achievement.tone}
                          unlocked={achievement.unlocked !== false}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div style={{ color: "#9b8c78", fontSize: "0.9rem" }}>No achievements yet.</div>
                  )}
                </div>
              </section>

              <section
                style={{
                  padding: "1rem",
                  borderRadius: "24px",
                  border: "1px solid rgba(160,140,115,0.16)",
                  background: "rgba(245,236,220,0.03)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <div style={{ fontWeight: 800, color: "#f5efe4" }}>District ranking</div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#b79b6d", fontSize: "0.76rem" }}>
                    <Crown size={13} />
                    Top {leader ? leader.name : "rank"}
                  </span>
                </div>
                <div style={{ marginTop: "0.8rem", display: "grid", gap: "0.75rem" }}>
                  {sortedLeaderboard.length ? (
                    sortedLeaderboard.map((item, index) => {
                      const isTop = index < 3;
                      const rankTone = index === 0 ? "#b87c4f" : index === 1 ? "#e6b422" : index === 2 ? "#1e3a5f" : "#6b7280";
                      return (
                        <motion.div
                          key={item.id || item.name}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
                          style={{
                            display: "grid",
                            gap: "0.35rem",
                            padding: "0.85rem",
                            borderRadius: "18px",
                            border: isTop ? "1px solid rgba(160,140,115,0.24)" : "1px solid rgba(160,140,115,0.12)",
                            background: isTop
                              ? "linear-gradient(135deg, rgba(184,124,79,0.12), rgba(230,178,36,0.06))"
                              : "rgba(245,236,220,0.03)",
                            boxShadow: isTop ? "0 0 0 1px rgba(255,255,255,0.02) inset" : "none"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", color: "#e8dfd1" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                              {index === 0 ? <Trophy size={14} /> : null}
                              <span>{item.name}</span>
                            </span>
                            <span style={{ color: rankTone }}>{item.score}</span>
                          </div>
                          <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${Math.min(100, Math.max(0, item.percent ?? item.score ?? 0))}%`,
                                borderRadius: 999,
                                background:
                                  index === 0
                                    ? "linear-gradient(90deg, #b87c4f, #e6b422)"
                                    : index === 1
                                      ? "linear-gradient(90deg, #1e3a5f, #b87c4f)"
                                      : "linear-gradient(90deg, #e6b422, #d4c5b0)"
                              }}
                            />
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div style={{ color: "#9b8c78", fontSize: "0.9rem" }}>Leaderboard will appear after the first simulation.</div>
                  )}
                </div>
              </section>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.75rem",
                marginTop: "1rem",
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <div style={{ color: "#9b8c78", fontSize: "0.9rem", lineHeight: 1.5, maxWidth: 620 }}>
                The result can be copied into the pitch deck or compared against the demo leaderboard.
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <GlowButton variant="ghost" onClick={onShare} leftIcon={<Share2 size={15} />}>
                  Share result
                </GlowButton>
                <GlowButton onClick={onClose}>Return</GlowButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
