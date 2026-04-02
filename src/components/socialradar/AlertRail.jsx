import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BellRing } from "lucide-react";
import { Link } from "react-router-dom";
import { buildCaseHref } from "../../utils/routeParams";
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
  monitor: "\u043d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435",
  "escalation candidate": "\u043d\u0430 \u044d\u0441\u043a\u0430\u043b\u0430\u0446\u0438\u044e",
  active: "\u0430\u043a\u0442\u0438\u0432\u0435\u043d",
  resolved: "\u0437\u0430\u043a\u0440\u044b\u0442"
};

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function AlertRail({
  cases,
  districts = [],
  title = "\u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0435 \u043a\u0435\u0439\u0441\u044b",
  description = "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043a\u0435\u0439\u0441, \u0447\u0442\u043e\u0431\u044b \u043f\u0435\u0440\u0435\u0439\u0442\u0438 \u0438\u0437 \u043e\u0431\u0437\u043e\u0440\u0430 \u0432 \u0440\u0430\u0431\u043e\u0447\u0435\u0435 \u0440\u0430\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0435."
}) {
  const districtLookup = useMemo(() => {
    function normalize(value = "") {
      return String(value).trim().replace(/\s+\u0440\u0430\u0439\u043e\u043d$/iu, "").toLowerCase();
    }

    return new Map(districts.map((district) => [normalize(district.district), district]));
  }, [districts]);

  return (
    <motion.section
      className="surface p-4"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="data-kicker">{safeText("\u041b\u0435\u043d\u0442\u0430 \u043a\u0435\u0439\u0441\u043e\u0432")}</p>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">{safeText(title)}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{safeText(description)}</p>
        </div>
        <BellRing size={16} className="text-slate-500" />
      </div>

      <div className="mt-4 grid gap-3">
        {cases.length ? (
          cases.map((caseItem, index) => {
            const normalizedDistrict = String(caseItem.district ?? "")
              .trim()
              .replace(/\s+\u0440\u0430\u0439\u043e\u043d$/iu, "")
              .toLowerCase();
            const liveDistrict = districtLookup.get(normalizedDistrict);

            const riskScore =
              typeof liveDistrict?.riskScore === "number" ? liveDistrict.riskScore.toFixed(1) : null;
            const riskLevel = liveDistrict?.riskLevel ?? null;
            const topFactor = liveDistrict?.topFactor ?? null;

            return (
              <motion.article
                key={caseItem.id}
                className="alert-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: index * 0.04 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="data-kicker">{safeText(caseItem.district)}</p>
                      <span className={`status-badge status-badge--${severityTone[caseItem.severity] ?? "slate"}`}>
                        {severityLabel[caseItem.severity] ?? safeText(caseItem.severity)}
                      </span>
                      {riskLevel ? (
                        <span className={`status-badge status-badge--${riskLevelTone(riskLevel, liveDistrict?.riskScore)}`}>
                          {safeText(riskLevel)}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-base font-semibold tracking-[-0.03em] text-white">
                      {safeText(caseItem.title)}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{safeText(caseItem.summary)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {riskScore ? (
                      <span className="status-badge status-badge--slate">
                        {safeText("\u0440\u0438\u0441\u043a")} {riskScore}
                      </span>
                    ) : null}
                    <span className="status-badge status-badge--slate">{safeText(caseItem.updatedAt)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/8 pt-3">
                  <div className="space-y-1">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      {statusLabel[caseItem.status] ?? safeText(caseItem.status)}
                    </div>
                    {topFactor ? (
                      <div className="text-xs text-slate-500">
                        {safeText("\u0424\u0430\u043a\u0442\u043e\u0440")}:{" "}
                        <span className="text-slate-300">{safeText(topFactor)}</span>
                      </div>
                    ) : null}
                  </div>
                  <Link to={buildCaseHref(caseItem.id)} className="alert-card__link">
                    {safeText("\u041e\u0442\u043a\u0440\u044b\u0442\u044c")}
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.article>
            );
          })
        ) : (
          <div className="route-empty">
            <p className="data-kicker">{safeText("\u041a\u0435\u0439\u0441\u044b \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b")}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {safeText(
                "\u041a\u0435\u0439\u0441\u044b \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f \u0431\u044d\u043a\u0435\u043d\u0434\u0430 \u043a\u0435\u0439\u0441\u043e\u0432 \u0438\u043b\u0438 \u043f\u0440\u0430\u0432\u0438\u043b \u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u0441\u0438\u0433\u043d\u0430\u043b\u043e\u0432."
              )}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
