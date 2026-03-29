import React from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "../common/AnimatedNumber";

const tones = {
  amber: "border-amber-400/20 bg-amber-400/[0.05]",
  blue: "border-sky-400/20 bg-sky-400/[0.05]",
  teal: "border-teal-400/20 bg-teal-400/[0.05]",
  slate: "border-white/8 bg-white/[0.03]"
};

export default function KpiStrip({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.article
            key={item.label}
            className={`radar-panel p-4 ${tones[item.tone] ?? tones.slate}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">{item.label}</p>
              {Icon ? <Icon className="h-4 w-4 text-slate-500" /> : null}
            </div>

            <div className="mt-4">
              <AnimatedNumber
                value={item.value}
                precision={item.precision}
                suffix={item.suffix}
                className="font-mono text-[1.85rem] font-semibold tracking-[-0.04em] text-slate-50"
              />
              <p className="mt-1 text-xs text-slate-500">{item.delta}</p>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">{item.helper}</p>
          </motion.article>
        );
      })}
    </div>
  );
}
