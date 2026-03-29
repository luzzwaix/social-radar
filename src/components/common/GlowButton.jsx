import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const baseStyle = {
  position: "relative",
  isolation: "isolate",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.55rem",
  minHeight: 44,
  padding: "0.8rem 1.08rem",
  borderRadius: "14px",
  border: "2px solid rgba(212, 197, 176, 0.13)",
  background:
    "linear-gradient(180deg, rgba(25, 24, 22, 0.99), rgba(17, 18, 20, 0.97)), linear-gradient(135deg, rgba(30, 58, 95, 0.04), rgba(184, 124, 79, 0.04))",
  color: "#f4ede2",
  fontSize: "0.9rem",
  fontWeight: 700,
  letterSpacing: "-0.01em",
  textDecoration: "none",
  cursor: "pointer",
  overflow: "hidden",
  boxShadow: "0 12px 24px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255,255,255,0.02)",
  transition: "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease, background 180ms ease",
};

function variantStyle(variant) {
  if (variant === "ghost") {
    return {
      background:
        "linear-gradient(180deg, rgba(21, 22, 25, 0.95), rgba(16, 17, 19, 0.93)), linear-gradient(135deg, rgba(30, 58, 95, 0.04), rgba(184, 124, 79, 0.03))",
      border: "2px solid rgba(212, 197, 176, 0.1)",
      color: "#f2ebdf",
    };
  }

  if (variant === "danger") {
    return {
      background:
        "linear-gradient(180deg, rgba(76, 38, 30, 0.99), rgba(57, 28, 22, 0.99)), linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(184, 124, 79, 0.04))",
      border: "2px solid rgba(182, 90, 68, 0.24)",
      color: "#fff1ec",
    };
  }

  return {
    border: "2px solid rgba(212, 197, 176, 0.16)",
    background:
      "linear-gradient(180deg, rgba(31, 29, 25, 0.99), rgba(18, 19, 22, 0.97)), linear-gradient(135deg, rgba(230, 178, 36, 0.05), rgba(184, 124, 79, 0.06))",
  };
}

function sizeStyle(size) {
  if (size === "sm") {
    return { minHeight: 38, padding: "0.62rem 0.9rem", fontSize: "0.82rem", borderRadius: "12px" };
  }

  if (size === "lg") {
    return { minHeight: 50, padding: "0.98rem 1.3rem", fontSize: "1rem", borderRadius: "16px" };
  }

  return {};
}

export default function GlowButton({
  as: Component = "button",
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}) {
  const MotionComponent = useMemo(() => motion(Component), [Component]);
  const [ripples, setRipples] = useState([]);
  const { onClick, onPointerDown, onMouseEnter, onMouseLeave, ...restProps } = props;

  const resolvedStyle = {
    ...baseStyle,
    ...sizeStyle(size),
    ...variantStyle(variant),
    opacity: disabled ? 0.55 : 1,
    pointerEvents: disabled ? "none" : "auto",
    ...style,
  };

  const addRipple = (event) => {
    if (disabled) return;
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height) * 1.45;
    const x = (event.clientX || rect.left + rect.width / 2) - rect.left - diameter / 2;
    const y = (event.clientY || rect.top + rect.height / 2) - rect.top - diameter / 2;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setRipples((current) => [...current, { id, x, y, diameter }]);
    window.setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
    }, 520);
  };

  return (
    <MotionComponent
      className={className}
      disabled={Component === "button" ? disabled : undefined}
      style={resolvedStyle}
      whileHover={disabled ? undefined : { y: -1, scale: 1.005 }}
      whileTap={disabled ? undefined : { y: 0, scale: 0.99 }}
      transition={{ duration: 0.16, ease: [0.2, 0.8, 0.28, 1] }}
      onPointerDown={(event) => {
        addRipple(event);
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        onClick?.(event);
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...restProps}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), transparent 30%, transparent 74%, rgba(30,58,95,0.04))",
          pointerEvents: "none",
        }}
      />
      <span
        aria-hidden="true"
          style={{
            position: "absolute",
            inset: "1px",
            borderRadius: "inherit",
            border: "1px solid rgba(255,255,255,0.015)",
            pointerEvents: "none",
          }}
      />
      <span
        aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            background: "linear-gradient(90deg, rgba(30,58,95,0), rgba(230,178,36,0.42), rgba(184,124,79,0.5))",
            opacity: variant === "ghost" ? 0.18 : 0.3,
            pointerEvents: "none",
          }}
      />
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: ripple.x,
            top: ripple.y,
            width: ripple.diameter,
            height: ripple.diameter,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(230,178,36,0.12) 0%, rgba(184,124,79,0.06) 42%, transparent 72%)",
            transform: "scale(0)",
            animation: "atlasRipple 560ms ease-out forwards",
            pointerEvents: "none",
          }}
        />
      ))}
      {leftIcon ? <span style={{ position: "relative", zIndex: 1, display: "inline-flex" }}>{leftIcon}</span> : null}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      {rightIcon ? <span style={{ position: "relative", zIndex: 1, display: "inline-flex" }}>{rightIcon}</span> : null}
      <style>{`
        @keyframes atlasRipple {
          0% {
            transform: scale(0.12);
            opacity: 0.72;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </MotionComponent>
  );
}
