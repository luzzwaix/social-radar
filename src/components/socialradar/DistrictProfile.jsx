import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const numberFormatter = new Intl.NumberFormat("ru-RU");

const cardVariants = {
  initial: { opacity: 0, y: 14 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: "easeOut",
      delay: index * 0.04
    }
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } }
};

const rowVariants = {
  initial: { opacity: 0, x: -10 },
  animate: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.24,
      ease: "easeOut",
      delay: 0.03 + index * 0.03
    }
  })
};

function LiveDot() {
  return (
    <span className="inline-flex items-center gap-2">
      <motion.span
        className="relative flex h-2.5 w-2.5"
        animate={{ scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400/40 blur-[3px]" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(125,211,252,0.45)]" />
      </motion.span>
      <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">live</span>
    </span>
  );
}

function AgeTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-[4px] border border-white/10 bg-[#08111a]/95 px-3 py-2 text-sm text-slate-200 shadow-2xl">
      <p className="font-medium text-white">{point.label}</p>
      <p className="mt-1 font-mono text-cyan-200">{numberFormatter.format(point.value)}</p>
    </div>
  );
}

export default function DistrictProfile({ district, signals }) {
  const ageData = [
    { label: "0-15", value: district.age0to15, color: "#38bdf8" },
    { label: "Working", value: district.workingAge, color: "#60a5fa" },
    { label: "65+", value: district.senior, color: "#f97316" }
  ];

  const summaryCards = [
    {
      label: "Population",
      value: numberFormatter.format(district.total)
    },
    {
      label: "Male / Female",
      value: `${numberFormatter.format(district.male)} / ${numberFormatter.format(district.female)}`
    },
    {
      label: "Youth / Senior",
      value: `${district.youthShare.toFixed(1)}% / ${district.seniorShare.toFixed(1)}%`
    }
  ];

  const maxEthnicityValue = district.topEthnicities?.[0]?.value ?? 1;

  return (
    <motion.section
      className="surface overflow-hidden"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="border-b border-white/8 px-4 py-4">
        <p className="data-kicker">District profile</p>
        <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">Demography inspector</h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={district.district}
          className="space-y-4 p-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">{district.district}</h3>
              <p className="mt-2 text-sm text-slate-400">Population structure by age and dominant ethnicities</p>
            </div>
            <LiveDot />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {summaryCards.map((card, index) => (
              <motion.div
                key={card.label}
                className="rounded-[4px] border border-white/8 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                custom={index}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover={{ y: -2 }}
                layout
              >
                <div className="h-0.5 w-10 rounded-full bg-cyan-400/70" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">{card.label}</p>
                <p className="mt-2 font-mono text-lg text-white">{card.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-[4px] border border-white/8 bg-[#0a1119] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Age distribution</p>
              <p className="text-xs text-slate-500">Absolute residents</p>
            </div>

            <div className="mt-3 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} layout="vertical" margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="label"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    width={56}
                  />
                  <Tooltip cursor={false} content={<AgeTooltip />} />
                  <Bar dataKey="value" radius={[0, 2, 2, 0]} animationDuration={850}>
                    {ageData.map((entry) => (
                      <Cell key={entry.label} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Dominant ethnicities</p>
              <p className="text-xs text-slate-500">Top observed groups</p>
            </div>

            {district.topEthnicities.slice(0, 5).map((item, index) => {
              const width = `${(item.value / maxEthnicityValue) * 100}%`;
              const share = ((item.value / district.total) * 100).toFixed(1);

              return (
                <motion.div
                  key={item.ethnos}
                  className="rounded-[4px] border border-white/8 bg-white/[0.03] p-3"
                  custom={index}
                  variants={rowVariants}
                  initial="initial"
                  animate="animate"
                  whileHover={{ x: 2 }}
                  layout
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{item.ethnos}</p>
                      <p className="mt-1 text-xs text-slate-500">{share}% of district population</p>
                    </div>
                    <p className="font-mono text-sm text-slate-200">{numberFormatter.format(item.value)}</p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/6">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-200"
                      initial={{ width: 0 }}
                      animate={{ width }}
                      transition={{ duration: 0.5, delay: 0.03 + index * 0.03, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid gap-3">
            {signals.map((signal, index) => (
              <motion.div
                key={signal.id}
                className="rounded-[4px] border border-white/8 bg-white/[0.03] p-3"
                custom={index}
                variants={rowVariants}
                initial="initial"
                animate="animate"
                whileHover={{ x: 2 }}
                layout
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">{signal.title}</p>
                    <p className="mt-2 font-mono text-lg text-white">{signal.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{signal.description}</p>
                  </div>
                  <span className={`status-badge status-badge--${signal.score >= 68 ? "amber" : "cyan"}`}>
                    {signal.score}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
