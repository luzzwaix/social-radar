import React from "react";
import { animated, useSpring } from "@react-spring/web";

const numberFormatter = new Intl.NumberFormat("ru-RU");

function normalizeValue(value) {
  if (typeof value === "number") {
    return { numeric: value, suffix: "" };
  }

  if (typeof value !== "string") {
    return { numeric: Number(value) || 0, suffix: "" };
  }

  const normalized = value.replace(/\s/g, "");
  const match = normalized.match(/-?\d+(?:[.,]\d+)?/);

  if (!match) {
    return { numeric: 0, suffix: value };
  }

  const numeric = Number(match[0].replace(",", ".")) || 0;
  const suffix = value.replace(match[0], "").trim();

  return { numeric, suffix };
}

export default function AnimatedNumber({
  value = 0,
  prefix = "",
  suffix: suffixProp = "",
  precision = 0,
  format = true,
  className = "",
  style
}) {
  const parsed = normalizeValue(value);
  const suffix = suffixProp || parsed.suffix;
  const spring = useSpring({
    from: { val: 0 },
    to: { val: parsed.numeric },
    config: { tension: 120, friction: 14 }
  });

  return (
    <animated.span className={className} style={style}>
      {spring.val.to((current) => {
        const rounded = precision > 0 ? Number(current).toFixed(precision) : Math.round(current);
        const formatted = format ? numberFormatter.format(Number(rounded)) : rounded;
        return `${prefix}${formatted}${suffix ? ` ${suffix}` : ""}`;
      })}
    </animated.span>
  );
}
