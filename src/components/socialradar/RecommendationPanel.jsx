import React from "react";
import { motion } from "framer-motion";
import { normalizeDisplayText } from "../../utils/text";

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function RecommendationPanel({ caseItem }) {
  return (
    <motion.section
      className="surface p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.04 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="data-kicker">{safeText("\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u044f AI")}</p>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">{safeText(caseItem.recommendation.headline)}</h2>
        </div>
        <span className="status-badge status-badge--cyan">{safeText("\u0442\u043e\u043b\u044c\u043a\u043e \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u044f")}</span>
      </div>

      <div className="mt-4 rounded-[10px] border border-cyan-400/18 bg-cyan-400/[0.06] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="data-kicker">{safeText("\u0423\u0432\u0435\u0440\u0435\u043d\u043d\u043e\u0441\u0442\u044c")}</p>
            <p className="mt-3 font-mono text-[2.35rem] leading-none tracking-[-0.05em] text-white">
              {caseItem.recommendation.confidence}%
            </p>
          </div>
          <div className="text-sm leading-6 text-cyan-50 md:max-w-[280px] md:text-right">
            {safeText(caseItem.recommendation.expectedImpact)}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/6">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-100"
            initial={{ width: 0 }}
            animate={{ width: `${caseItem.recommendation.confidence}%` }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
          />
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-200">{safeText(caseItem.recommendation.summary)}</p>
      </div>

      <div className="mt-4 grid gap-4">
        <div className="glass-block p-4">
          <p className="data-kicker">{safeText("\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u044f")}</p>
          <div className="mt-3 grid gap-2">
            {caseItem.explainability.limitations.map((item) => (
              <div key={item} className="provenance-note">
                {safeText(item)}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-block p-4">
          <p className="data-kicker">{safeText("\u041f\u043e\u0445\u043e\u0436\u0438\u0435 \u043a\u0435\u0439\u0441\u044b")}</p>
          <div className="mt-3 grid gap-2">
            {caseItem.similarCases.map((item, index) => (
              <div key={item} className="factor-row">
                <span className="factor-row__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-sm leading-6 text-slate-300">{safeText(item)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
