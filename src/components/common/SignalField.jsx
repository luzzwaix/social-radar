import React, { useMemo } from "react";

function buildParticles(count) {
  return Array.from({ length: count }, (_, index) => {
    const seed = (index + 3) * 29;
    return {
      id: `particle-${index}`,
      left: `${(seed * 11) % 100}%`,
      top: `${(seed * 17) % 100}%`,
      size: 2 + (seed % 4),
      delay: `${(seed % 9) * 0.25}s`,
      duration: `${7 + (seed % 6)}s`,
      opacity: 0.18 + ((seed % 5) / 18),
      tone:
        index % 3 === 0
          ? "var(--accent-cyan)"
          : index % 3 === 1
            ? "var(--accent-primary)"
            : "var(--accent-pink)"
    };
  });
}

export default function SignalField({ count = 28 }) {
  const particles = useMemo(() => buildParticles(count), [count]);

  return (
    <div className="signal-field" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="signal-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            background: particle.tone,
            boxShadow: `0 0 16px ${particle.tone}`
          }}
        />
      ))}
    </div>
  );
}
