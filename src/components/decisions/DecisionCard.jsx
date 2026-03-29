import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CornerDownRight, Lock, Sparkles } from "lucide-react";

function IconSlot({ icon: Icon, iconElement }) {
  if (iconElement) return iconElement;
  if (!Icon) return null;
  return <Icon size={18} />;
}

function parseBudget(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number(value) || 0;
  const digits = value.replace(/[^\d.-]/g, "");
  return Number(digits) || 0;
}

function Ripple({ x, y, size, id }) {
  return (
    <motion.span
      key={id}
      className="decision-ripple"
      initial={{ opacity: 0.35, scale: 0 }}
      animate={{ opacity: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size
      }}
    />
  );
}

export default function DecisionCard({
  title,
  description,
  cost = 0,
  costLabel,
  icon,
  iconElement,
  impact,
  aiAdvice,
  disabled = false,
  selected = false,
  onClick,
  budgetLeft,
  className = "",
  style
}) {
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const numericCost = parseBudget(cost);
  const renderedCost = costLabel ?? cost;
  const parsedBudget = parseBudget(budgetLeft);
  const insufficientBudget = parsedBudget > 0 ? numericCost > parsedBudget : disabled;
  const statusTone = insufficientBudget ? "danger" : selected ? "success" : "info";
  const statusLabel = selected ? "Selected" : insufficientBudget ? "Locked" : "Ready";
  const guidanceLabel = hovered || selected ? "Review impact" : "Prepared for review";
  const metricTiles = useMemo(
    () =>
      impact?.map((item, index) => ({
        ...item,
        id: `${item.label}-${index}`
      })) ?? [],
    [impact]
  );

  const handleRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 1.05;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    setRipples((current) => [...current.slice(-2), { id, x, y, size }]);
    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== id));
    }, 680);
  };

  return (
    <motion.button
      type="button"
      disabled={insufficientBudget}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={handleRipple}
      className={className}
      whileHover={insufficientBudget ? undefined : { y: -2 }}
      whileTap={insufficientBudget ? undefined : { scale: 0.99 }}
      style={{
        position: "relative",
        width: "100%",
        textAlign: "left",
        padding: 0,
        borderRadius: "18px",
        border: selected ? "2px solid rgba(180, 114, 69, 0.52)" : "2px solid rgba(255,255,255,0.08)",
        background: selected
          ? "linear-gradient(180deg, rgba(32,35,41,0.98), rgba(19,20,23,0.98))"
          : "linear-gradient(180deg, rgba(21,22,25,0.98), rgba(15,16,18,0.98))",
        color: "#f8f4ee",
        cursor: insufficientBudget ? "not-allowed" : "pointer",
        opacity: insufficientBudget ? 0.62 : 1,
        boxShadow: hovered
          ? "0 18px 38px rgba(0,0,0,0.24), 0 0 0 1px rgba(212,175,55,0.08) inset"
          : "0 14px 30px rgba(0,0,0,0.18)",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, opacity 180ms ease",
        overflow: "hidden",
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
          opacity: 0.11,
          pointerEvents: "none",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent 95%)"
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          insetInline: 0,
          top: 0,
          height: 5,
          background: selected
            ? "linear-gradient(90deg, #d4af37, #b87c4f)"
            : insufficientBudget
              ? "linear-gradient(90deg, #ef4444, #f97316)"
              : "linear-gradient(90deg, #1e3a5f, #b87c4f)"
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: selected
            ? "linear-gradient(180deg, #d4af37, #b87c4f)"
            : insufficientBudget
              ? "linear-gradient(180deg, #ef4444, #f97316)"
              : "linear-gradient(180deg, #1e3a5f, #b87c4f)"
        }}
      />

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {ripples.map((ripple) => (
          <Ripple key={ripple.id} {...ripple} />
        ))}
      </div>

      <div style={{ position: "relative", display: "grid", gap: "0.9rem", padding: "1rem 1rem 0.95rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: "0.8rem", minWidth: 0, flex: "1 1 260px" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(180deg, rgba(30,58,95,0.16), rgba(184,124,79,0.1))",
                color: "#f5f0e6",
                border: "2px solid rgba(212,175,55,0.18)",
                boxShadow: selected ? "0 0 0 1px rgba(212,175,55,0.08) inset" : "none",
                flex: "0 0 auto"
              }}
            >
              <IconSlot icon={icon} iconElement={iconElement} />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <div style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: "1.02rem", lineHeight: 1.15 }}>{title}</div>
                <span
                  className={`pill pill--${statusTone}`}
                  style={{
                    padding: "0.24rem 0.5rem",
                    fontSize: "0.66rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase"
                  }}
                >
                  {statusLabel}
                </span>
              </div>
              <div style={{ marginTop: "0.35rem", color: "#b9b0a3", fontSize: "0.87rem", lineHeight: 1.5 }}>
                {description}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              justifyItems: "end",
              gap: "0.3rem",
              padding: "0.6rem 0.7rem",
              borderRadius: 14,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              minWidth: 132,
              flex: "0 0 auto"
            }}
          >
            <div
              style={{
                fontSize: "0.68rem",
                padding: "0.25rem 0.5rem",
                borderRadius: 999,
                background: numericCost > 0 ? "rgba(184,124,79,0.12)" : "rgba(16,185,129,0.1)",
                color: numericCost > 0 ? "#f2c19d" : "#a7f3d0",
                border: "1px solid rgba(255,255,255,0.06)",
                textTransform: "uppercase",
                letterSpacing: "0.08em"
              }}
            >
              {numericCost > 0 ? `Cost ${renderedCost}` : "No cost"}
            </div>
            {typeof budgetLeft !== "undefined" ? (
              <div style={{ fontSize: "0.74rem", color: insufficientBudget ? "#fca5a5" : "#aca397" }}>
                Budget left {budgetLeft}
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "0.8rem",
            alignItems: "center",
            padding: "0.8rem 0.85rem",
            borderRadius: "16px",
            border: "2px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.025)"
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#8b8276", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Advisory note
            </div>
            <div style={{ marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "0.45rem", color: "#f0e7db", lineHeight: 1.4 }}>
              <CornerDownRight size={13} />
              {guidanceLabel}
            </div>
          </div>
          <div
            style={{
              width: 108,
              height: 10,
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)"
            }}
          >
            <div
              style={{
                height: "100%",
                width: hovered || selected ? "92%" : "68%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #1e3a5f 0%, #b87c4f 52%, #d4af37 100%)",
                transition: "width 220ms ease"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
          {metricTiles.map((item) => (
            <span
              key={item.id}
              style={{
                fontSize: "0.72rem",
                padding: "0.3rem 0.55rem",
                borderRadius: 999,
                background: "rgba(255,255,255,0.035)",
                color: "#ddd7ce",
                border: "1px solid rgba(255,255,255,0.06)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              {item.label}: {item.value}
            </span>
          ))}
        </div>

        {aiAdvice ? (
          <div
            style={{
              padding: "0.85rem 0.9rem",
              borderRadius: "16px",
              background: hovered || selected ? "rgba(30,58,95,0.09)" : "rgba(255,255,255,0.025)",
              border: "2px solid rgba(212,175,55,0.14)",
              color: "#f0e7db",
              fontSize: "0.86rem",
              lineHeight: 1.55
            }}
          >
            <div
              style={{
                color: "#d4af37",
                fontWeight: 800,
                marginBottom: "0.3rem",
                display: "flex",
                gap: "0.4rem",
                alignItems: "center",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "0.68rem"
              }}
            >
              <Sparkles size={13} />
              AI note
            </div>
            {aiAdvice}
          </div>
        ) : null}

        {insufficientBudget ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#fca5a5", fontSize: "0.8rem" }}>
            <Lock size={13} />
            Locked by budget
          </div>
        ) : null}
      </div>
    </motion.button>
  );
}
