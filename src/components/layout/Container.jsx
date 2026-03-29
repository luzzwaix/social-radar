import React from "react";

export default function Container({ children, className = "", style, size = "xl" }) {
  const maxWidth = size === "lg" ? 1160 : size === "md" ? 960 : 1480;
  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        padding: "0 1rem",
        position: "relative",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "12px 10px auto 10px",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(30,58,95,0.3), rgba(230,178,36,0.28), rgba(184,124,79,0.34), transparent)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}
