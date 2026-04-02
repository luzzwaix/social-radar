import React from "react";
import { motion } from "framer-motion";
import { riskLevelTone } from "../../hooks/useSocialRadarWorkspace";
import { normalizeDisplayText } from "../../utils/text";

const severityTone = {
  critical: "rose",
  high: "amber",
  watch: "cyan",
  low: "slate"
};

const severityLabel = {
  critical: "\u041a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439",
  high: "\u0412\u044b\u0441\u043e\u043a\u0438\u0439",
  watch: "\u0421\u0440\u0435\u0434\u043d\u0438\u0439",
  low: "\u041d\u0438\u0437\u043a\u0438\u0439"
};

const statusLabel = {
  "under review": "\u043d\u0430 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0435",
  triage: "\u0442\u0440\u0438\u0430\u0436",
  "escalation candidate": "\u043d\u0430 \u044d\u0441\u043a\u0430\u043b\u0430\u0446\u0438\u044e",
  monitor: "\u043d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435",
  active: "\u0430\u043a\u0442\u0438\u0432\u0435\u043d",
  resolved: "\u0437\u0430\u043a\u0440\u044b\u0442"
};

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function CaseHeader({ caseItem, district }) {
  const liveRiskScore = typeof district?.riskScore === "number" ? district.riskScore.toFixed(1) : "\u041d/\u0434";
  const liveRiskLevel = district?.riskLevel ?? caseItem.severity;
  const topFactor = district?.topFactor ?? "\u041d/\u0434";

  return (
    <motion.section
      className="surface surface-command p-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="brand-chip">{safeText("\u041a\u0435\u0439\u0441")}</span>
            <span className={`status-badge status-badge--${severityTone[caseItem.severity] ?? "slate"}`}>
              {severityLabel[caseItem.severity] ?? safeText(caseItem.severity)}
            </span>
            <span className="status-badge status-badge--slate">{statusLabel[caseItem.status] ?? safeText(caseItem.status)}</span>
          </div>

          <h1 className="mt-4 text-[1.75rem] font-semibold tracking-[-0.05em] text-white md:text-[2rem]">
            {safeText(caseItem.title)}
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">{safeText(caseItem.summary)}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:w-[460px]">
          <div className="command-cell">
            <p className="data-kicker">{safeText("\u0420\u0430\u0439\u043e\u043d")}</p>
            <p className="mt-3 font-mono text-base text-white">{safeText(district?.district ?? caseItem.district)}</p>
          </div>
          <div className="command-cell">
            <p className="data-kicker">{safeText("\u0420\u0438\u0441\u043a")}</p>
            <p className="mt-3 font-mono text-base text-white">{liveRiskScore}</p>
          </div>
          <div className="command-cell">
            <p className="data-kicker">{safeText("\u0423\u0440\u043e\u0432\u0435\u043d\u044c")}</p>
            <div className="mt-3">
              <span className={`status-badge status-badge--${riskLevelTone(liveRiskLevel, district?.riskScore)}`}>
                {safeText(liveRiskLevel)}
              </span>
            </div>
          </div>
          <div className="command-cell">
            <p className="data-kicker">{safeText("\u0422\u043e\u043f-\u0444\u0430\u043a\u0442\u043e\u0440")}</p>
            <p className="mt-3 font-mono text-base text-white">{safeText(topFactor)}</p>
          </div>
          <div className="command-cell">
            <p className="data-kicker">{safeText("\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d")}</p>
            <p className="mt-3 font-mono text-base text-white">{safeText(caseItem.updatedAt)}</p>
          </div>
          <div className="command-cell">
            <p className="data-kicker">{safeText("\u0423\u0432\u0435\u0440\u0435\u043d\u043d\u043e\u0441\u0442\u044c")}</p>
            <p className="mt-3 font-mono text-base text-white">{caseItem.recommendation.confidence}%</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
