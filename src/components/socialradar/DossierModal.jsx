import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { formatCompactNumber, formatNumber, formatRate } from "../../utils/socialRadar";

function DossierFact({ label, value }) {
  return (
    <div className="rounded-sm border border-white/8 bg-white/[0.03] p-3">
      <div className="eyebrow">{label}</div>
      <div className="mt-2 font-mono text-base text-slate-100">{value}</div>
    </div>
  );
}

export default function DossierModal({ open, district, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="radar-panel relative w-full max-w-4xl p-4 sm:p-5"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 290 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 bg-white/[0.03] text-slate-300 transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.06]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="max-w-3xl">
              <p className="eyebrow">District dossier</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-50">{district.district}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Расширенный паспорт района для демонстрации drilldown-сценария. Здесь собраны основные показатели по
                населению, возрастной структуре и крупнейшим этническим группам.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DossierFact label="Население" value={formatCompactNumber(district.total)} />
              <DossierFact label="Мужчины" value={formatCompactNumber(district.male)} />
              <DossierFact label="Женщины" value={formatCompactNumber(district.female)} />
              <DossierFact label="Рабочий возраст" value={formatCompactNumber(district.workingAge)} />
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="rounded-md border border-white/8 bg-white/[0.02] p-4">
                <div className="eyebrow">Age profile</div>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      label: "0-15 лет",
                      value: district.age0to15,
                      share: (district.age0to15 / district.total) * 100,
                      tone: "bg-sky-400"
                    },
                    {
                      label: "Рабочий возраст",
                      value: district.workingAge,
                      share: (district.workingAge / district.total) * 100,
                      tone: "bg-emerald-400"
                    },
                    {
                      label: "65+",
                      value: district.senior,
                      share: (district.senior / district.total) * 100,
                      tone: "bg-amber-400"
                    }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="font-mono text-slate-100">
                          {formatCompactNumber(item.value)} / {formatRate(item.share)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.06]">
                        <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${Math.max(item.share, 8)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-white/8 bg-white/[0.02] p-4">
                <div className="eyebrow">Top ethnicities</div>
                <div className="mt-4 space-y-3">
                  {district.topEthnicities.map((item, index) => (
                    <div
                      key={item.ethnos}
                      className="flex items-center justify-between gap-3 rounded-sm border border-white/6 bg-white/[0.03] px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                        <span className="text-sm text-slate-200">{item.ethnos}</span>
                      </div>
                      <span className="font-mono text-sm text-slate-100">{formatNumber(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
