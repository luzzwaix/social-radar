import React from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "../common/AnimatedNumber";

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: index * 0.06, ease: "easeOut" }
  })
};

export default function MetricStrip({ metrics }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const accentClass =
          metric.id === "unemployment"
            ? "metric-card--amber"
            : metric.id === "employment"
              ? "metric-card--cyan"
              : metric.id === "migration"
                ? "metric-card--slate"
                : "metric-card--emerald";

        return (
          <motion.article
            key={metric.id}
            className={`surface surface-hover metric-card overflow-hidden p-4 ${accentClass}`}
            variants={reveal}
            initial="initial"
            animate="animate"
            custom={index}
            whileTap={{ scale: 0.995 }}
          >
            <div className="metric-card__accent" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="data-kicker">{metric.label}</p>
                <AnimatedNumber
                  className="mt-4 block font-mono text-[2rem] leading-none tracking-[-0.04em] text-white"
                  value={metric.value}
                  suffix={metric.suffix}
                  precision={metric.precision}
                />
              </div>
              <motion.div
                className="metric-card__icon flex h-10 w-10 items-center justify-center rounded-[4px] border border-white/10 bg-white/[0.04] text-slate-300"
                initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.28, delay: 0.06 + index * 0.05, ease: "easeOut" }}
                whileHover={{ scale: 1.04, rotate: -4 }}
              >
                <Icon size={18} />
              </motion.div>
            </div>

            <div className="mt-5 border-t border-white/6 pt-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">{metric.helper}</p>
                <motion.span
                  className="rounded-[4px] border border-white/8 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.12 + index * 0.04 }}
                >
                  {metric.change}
                </motion.span>
              </div>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}
