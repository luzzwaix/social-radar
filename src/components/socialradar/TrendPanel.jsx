import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatPercent(value) {
  return isFiniteNumber(value) ? `${value.toFixed(1)}%` : "N/A";
}

function formatThousands(value) {
  return isFiniteNumber(value) ? `${value.toFixed(1)}k` : "N/A";
}

function safeDelta(current, previous) {
  if (!isFiniteNumber(current) || !isFiniteNumber(previous)) {
    return null;
  }

  return Number((current - previous).toFixed(1));
}

function TrendTooltip({ active, label, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const unemployment = payload.find((entry) => entry.dataKey === "unemploymentRate");
  const employment = payload.find((entry) => entry.dataKey === "employmentRate");
  const outsideLaborForce = payload.find((entry) => entry.dataKey === "outsideLaborForce");

  return (
    <div className="rounded-[14px] border border-white/10 bg-[#09121b]/95 px-3 py-2 text-sm text-slate-200 shadow-2xl">
      <p className="data-kicker">{label}</p>
      <div className="mt-2 space-y-1">
        <p className="font-mono text-cyan-200">Employment: {formatPercent(employment?.value)}</p>
        <p className="font-mono text-amber-200">Unemployment: {formatPercent(unemployment?.value)}</p>
        <p className="font-mono text-slate-300">Outside labor force: {formatThousands(outsideLaborForce?.value)}</p>
      </div>
    </div>
  );
}

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: "easeOut",
      delay: 0.04 + index * 0.03
    }
  })
};

const chartVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.06 }
  }
};

export default function TrendPanel({ regionLabel, data, regionRow, nationalUnemployment }) {
  const firstPoint = data[0];
  const lastPoint = data[data.length - 1];
  const unemploymentDelta = data.length > 1 ? safeDelta(data[data.length - 1].unemploymentRate, data[data.length - 2].unemploymentRate) : null;
  const employmentDelta = data.length > 1 ? safeDelta(data[data.length - 1].employmentRate, data[data.length - 2].employmentRate) : null;

  return (
    <motion.section
      className="surface p-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut", delay: 0.05 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="data-kicker">Trend workspace</p>
          <h2 className="mt-2 text-[1.45rem] font-semibold tracking-[-0.04em] text-white">
            {regionLabel} versus national baseline
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Smooth chart transitions and dense readouts keep the workspace feeling live without looking noisy.
          </p>
        </div>

        <span className="status-badge status-badge--slate">{firstPoint?.year} - {lastPoint?.year}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          {
            label: "Employment",
            value: formatPercent(regionRow.employmentRate),
            tone: "text-cyan-200"
          },
          {
            label: "Unemployment",
            value: formatPercent(regionRow.unemploymentRate),
            tone: "text-amber-200"
          },
          {
            label: "Employment delta",
            value: employmentDelta === null ? "N/A" : `${employmentDelta > 0 ? "+" : ""}${employmentDelta.toFixed(1)} p.p.`,
            tone: employmentDelta === null ? "text-slate-100" : employmentDelta >= 0 ? "text-emerald-200" : "text-rose-200"
          },
          {
            label: "National benchmark",
            value: formatPercent(nationalUnemployment),
            tone: "text-slate-100"
          }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            className="glass-block overflow-hidden p-3"
            custom={index}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover={{ y: -2, scale: 1.01 }}
            layout
          >
            <motion.div
              className="h-0.5 w-10 rounded-full bg-cyan-400/70"
              initial={{ opacity: 0, scaleX: 0.55 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.28, delay: 0.08 + index * 0.03 }}
              style={{ transformOrigin: "left center" }}
            />
            <p className="mt-3 data-kicker">{item.label}</p>
            <p className={`mt-2 font-mono text-lg ${item.tone}`}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div className="chart-shell mt-4" variants={chartVariants} initial="initial" animate="animate" layout>
        <div className="pointer-events-none absolute inset-x-4 top-0 z-10 h-px overflow-hidden">
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
            animate={{ x: ["-30%", "120%"] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={regionLabel}
            className="h-[320px] w-full md:h-[360px]"
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 16, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="employment-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  minTickGap={14}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  width={40}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#475569"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  width={46}
                />
                <Tooltip content={<TrendTooltip />} />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="outsideLaborForce"
                  stroke="#0ea5e9"
                  fill="url(#employment-fill)"
                  strokeWidth={1.4}
                  animationDuration={1100}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="employmentRate"
                  stroke="#7dd3fc"
                  strokeWidth={2.1}
                  dot={false}
                  activeDot={{ r: 3.5, strokeWidth: 0 }}
                  animationDuration={900}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="unemploymentRate"
                  stroke="#f59e0b"
                  strokeWidth={2.1}
                  dot={false}
                  activeDot={{ r: 3.5, strokeWidth: 0 }}
                  animationDuration={900}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="mt-4 text-xs leading-6 text-slate-500">
        Latest point is compared against the national unemployment benchmark of {formatPercent(nationalUnemployment)}.
      </div>
    </motion.section>
  );
}
