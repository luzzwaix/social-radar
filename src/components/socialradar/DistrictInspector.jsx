import React from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactNumber, formatNumber, formatRate } from "../../utils/socialRadar";

function EthnicityTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-white/10 bg-[#0f1720]/95 p-3 shadow-2xl">
      <div className="text-sm font-medium text-slate-100">{payload[0].payload.ethnos}</div>
      <div className="mt-1 text-xs text-slate-400">{formatNumber(payload[0].value)} жителей</div>
    </div>
  );
}

function ProgressRow({ label, value, total, accent }) {
  const width = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono text-slate-100">{formatCompactNumber(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06]">
        <div className={`h-full rounded-full ${accent}`} style={{ width: `${Math.max(width, 8)}%` }} />
      </div>
    </div>
  );
}

export default function DistrictInspector({ district, districts, onSelectDistrict, onOpenDossier }) {
  const ethnicityData = district.topEthnicities.slice(0, 5);

  return (
    <motion.aside
      className="radar-panel flex min-h-[560px] flex-col p-4"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.04 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">District intelligence</p>
          <h2 className="mt-2 text-[1.4rem] font-semibold tracking-[-0.03em] text-slate-50">{district.district}</h2>
        </div>
        <button
          type="button"
          onClick={onOpenDossier}
          className="inline-flex h-9 items-center justify-center rounded-sm border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-200 transition-colors duration-150 hover:border-sky-400/30 hover:bg-sky-400/[0.08]"
        >
          Open dossier
        </button>
      </div>

      <div className="mt-4">
        <label className="eyebrow">Переключить район</label>
        <select
          value={district.district}
          onChange={(event) => onSelectDistrict(event.target.value)}
          className="mt-2 h-10 w-full rounded-sm border border-white/10 bg-white/[0.03] px-3 text-sm text-slate-100 outline-none transition-colors duration-150 focus:border-sky-400/40"
        >
          {districts.map((item) => (
            <option key={item.district} value={item.district} className="bg-[#0f1720] text-slate-100">
              {item.district}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-white/8 bg-white/[0.03] p-3">
          <div className="eyebrow">Total population</div>
          <div className="mt-2 font-mono text-lg text-slate-100">{formatCompactNumber(district.total)}</div>
        </div>
        <div className="rounded-sm border border-white/8 bg-white/[0.03] p-3">
          <div className="eyebrow">Working age</div>
          <div className="mt-2 font-mono text-lg text-slate-100">{formatCompactNumber(district.workingAge)}</div>
        </div>
        <div className="rounded-sm border border-white/8 bg-white/[0.03] p-3">
          <div className="eyebrow">Youth share</div>
          <div className="mt-2 font-mono text-lg text-sky-200">{formatRate(district.youthShare)}</div>
        </div>
        <div className="rounded-sm border border-white/8 bg-white/[0.03] p-3">
          <div className="eyebrow">Senior share</div>
          <div className="mt-2 font-mono text-lg text-amber-300">{formatRate(district.seniorShare)}</div>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-white/8 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="eyebrow">Возрастная структура</div>
            <h3 className="mt-2 text-base font-medium text-slate-100">Age composition</h3>
          </div>
          <div className="font-mono text-xs text-slate-500">{formatCompactNumber(district.total)} total</div>
        </div>
        <div className="mt-4 space-y-4">
          <ProgressRow label="0-15 лет" value={district.age0to15} total={district.total} accent="bg-sky-400" />
          <ProgressRow label="Рабочий возраст" value={district.workingAge} total={district.total} accent="bg-emerald-400" />
          <ProgressRow label="65+" value={district.senior} total={district.total} accent="bg-amber-400" />
        </div>
      </div>

      <div className="mt-5 min-h-0 flex-1 rounded-md border border-white/8 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="eyebrow">Ethnicity mix</div>
            <h3 className="mt-2 text-base font-medium text-slate-100">Top population groups</h3>
          </div>
          <div className="font-mono text-xs text-slate-500">{ethnicityData.length} categories</div>
        </div>

        <div className="mt-4 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ethnicityData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="ethnos"
                width={76}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<EthnicityTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.08)" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={900}>
                {ethnicityData.map((entry, index) => (
                  <Cell
                    key={entry.ethnos}
                    fill={["#60a5fa", "#38bdf8", "#34d399", "#f59e0b", "#f472b6"][index % 5]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.aside>
  );
}
