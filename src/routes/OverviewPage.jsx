import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BellRing } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import MetricStrip from "../components/socialradar/MetricStrip";
import DistrictMap from "../components/socialradar/DistrictMap";
import TrendPanel from "../components/socialradar/TrendPanel";
import DistrictProfile from "../components/socialradar/DistrictProfile";
import RegionsTable from "../components/socialradar/RegionsTable";
import AlertRail from "../components/socialradar/AlertRail";
import SkeletonDashboard from "../components/socialradar/SkeletonDashboard";
import cases from "../data/cases.mock";
import { buildDistrictHref } from "../utils/routeParams";
import { numericOr, scoreLabel, scoreTone } from "../hooks/useSocialRadarWorkspace";
import { normalizeDisplayText } from "../utils/text";

const panelMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: "easeOut" }
};

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function OverviewPage() {
  const workspace = useOutletContext();
  const navigate = useNavigate();

  const topCases = useMemo(() => {
    const districtCases = cases.filter((caseItem) => caseItem.district === workspace.selectedDistrict.district);
    return districtCases.length ? districtCases : cases.slice(0, 3);
  }, [workspace.selectedDistrict.district]);

  if (!workspace.isReady) {
    return <SkeletonDashboard />;
  }

  return (
    <>
      <motion.header className="surface surface-command p-4 md:p-5" {...panelMotion}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="brand-chip">SocialRadar</span>
              <span className="status-badge status-badge--slate">
                {safeText("\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043a\u043e\u043d\u0441\u043e\u043b\u044c")}
              </span>
              <span className={`status-badge status-badge--${workspace.liveRiskSnapshot.status === "ready" ? "emerald" : "slate"}`}>
                <span className={`live-dot ${workspace.liveRiskSnapshot.status === "ready" ? "live-dot--active" : ""}`} />
                {workspace.liveRiskSnapshot.status === "ready"
                  ? safeText("ML \u0430\u043a\u0442\u0438\u0432\u0435\u043d")
                  : safeText("\u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0430\u0446\u0438\u044f")}
              </span>
            </div>

            <div className="mt-4 max-w-4xl">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-white md:text-[2.15rem]">
                  {safeText(
                    "SocialRadar: \u043c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0438\u0441\u043a\u0430 \u043f\u043e \u0440\u0430\u0439\u043e\u043d\u0430\u043c \u0410\u043b\u043c\u0430\u0442\u044b"
                  )}
                </h2>
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  {safeText("\u041a\u043e\u043d\u0441\u043e\u043b\u044c \u0440\u0430\u043d\u043d\u0435\u0433\u043e \u043f\u0440\u0435\u0434\u0443\u043f\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u044f")}
                </span>
              </div>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                {safeText(
                  "\u041a\u0430\u0440\u0442\u0430 \u0440\u0430\u0439\u043e\u043d\u043e\u0432, \u0441\u0438\u0433\u043d\u0430\u043b\u044b \u0440\u044b\u043d\u043a\u0430 \u0442\u0440\u0443\u0434\u0430, \u043c\u0438\u0433\u0440\u0430\u0446\u0438\u044f, \u0440\u0435\u0439\u0442\u0438\u043d\u0433\u0438 \u0438 \u043f\u0440\u0430\u0432\u0438\u043b\u0430 \u043a\u043e\u043c\u043f\u043b\u0430\u0435\u043d\u0441\u0430 \u0432 \u043e\u0434\u043d\u043e\u043c \u0440\u0430\u0431\u043e\u0447\u0435\u043c \u044d\u043a\u0440\u0430\u043d\u0435. \u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u0432 \u0434\u043e\u0441\u044c\u0435 \u0438 \u043a\u0435\u0439\u0441\u044b \u0431\u0435\u0437 \u0441\u043c\u0435\u043d\u044b \u0441\u043b\u043e\u044f \u0434\u0430\u043d\u043d\u044b\u0445."
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:max-w-[340px] xl:justify-end">
            <span className="pill pill--ghost">{safeText("\u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435")}</span>
            <span className="pill pill--ghost">{safeText("\u0411\u0435\u0437 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445")}</span>
            <span className={`pill ${workspace.liveRiskSnapshot.status === "ready" ? "pill--active" : "pill--ghost"}`}>
              {workspace.liveRiskSnapshot.status === "ready"
                ? safeText("ML \u0430\u043a\u0442\u0438\u0432\u0435\u043d")
                : safeText("ML \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0430\u0446\u0438\u044f")}
            </span>
            <button
              type="button"
              className="control-button"
              onClick={() => navigate(buildDistrictHref(workspace.selectedDistrict.district))}
            >
              {safeText("\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0434\u043e\u0441\u044c\u0435 \u0440\u0430\u0439\u043e\u043d\u0430")}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-4">
          {workspace.commandCells.map((item, index) => (
            <motion.article
              key={item.label}
              className="command-cell"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: index * 0.04 }}
              whileHover={{ y: -3 }}
            >
              <p className="data-kicker">{safeText(item.label)}</p>
              <p className="mt-3 font-mono text-base text-white md:text-lg">{safeText(item.value)}</p>
              <p className="mt-2 text-sm text-slate-500">{safeText(item.helper)}</p>
            </motion.article>
          ))}
        </div>
      </motion.header>

      {workspace.liveRiskSnapshot.alerts ? (
        <motion.section
          className="surface alert-strip p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="alert-strip__pulse" />
              <div className="min-w-0">
                <p className="data-kicker">{safeText("\u0410\u043b\u0435\u0440\u0442\u044b \u043f\u043e \u0440\u0430\u0439\u043e\u043d\u0430\u043c")}</p>
                <p className="alert-strip__message">{safeText(workspace.liveRiskSnapshot.alerts.message)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="status-badge status-badge--rose">
                {numericOr(workspace.liveRiskSnapshot.alerts.critical_count, 0)} {safeText("\u043a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0445")}
              </span>
              <span className="status-badge status-badge--amber">
                {numericOr(workspace.liveRiskSnapshot.alerts.high_count, 0)} {safeText("\u0432\u044b\u0441\u043e\u043a\u0438\u0445")}
              </span>
              {workspace.liveRiskSnapshot.summary ? (
                <span className="status-badge status-badge--cyan">
                  {safeText("\u0441\u0440. \u0440\u0438\u0441\u043a")} {workspace.liveRiskSnapshot.summary.avg_risk}
                </span>
              ) : null}
            </div>
          </div>
        </motion.section>
      ) : null}

      <MetricStrip metrics={workspace.topMetrics} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_390px]">
        <DistrictMap
          geoJson={workspace.geoJson}
          districts={workspace.almatyDistricts}
          metric={workspace.mapMetric}
          metricOptions={workspace.mapMetricOptions}
          selectedDistrictName={workspace.selectedDistrict.district}
          onSelectDistrict={workspace.setSelectedDistrictName}
          onMetricChange={workspace.setMapMetric}
          liveStatus={workspace.liveRiskSnapshot.status}
          liveAlerts={workspace.liveRiskSnapshot.alerts}
          onOpenDistrict={(districtName) => navigate(buildDistrictHref(districtName))}
        />

        <div className="space-y-4">
          <DistrictProfile
            district={workspace.selectedDistrict}
            signals={workspace.districtSignals}
            liveStatus={workspace.liveRiskSnapshot.status}
          />

          <AlertRail
            cases={topCases}
            districts={workspace.almatyDistricts}
            title="\u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0435 \u043a\u0435\u0439\u0441\u044b"
            description="\u041b\u0435\u043d\u0442\u0430 \u043a\u0435\u0439\u0441\u043e\u0432 \u0434\u043b\u044f \u0431\u044b\u0441\u0442\u0440\u043e\u0433\u043e \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0430 \u043a \u0440\u0430\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044e \u0438 \u0437\u043e\u043d\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0439."
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <TrendPanel
          regionLabel={workspace.selectedRegionRow.region}
          data={workspace.selectedSeries}
          regionRow={workspace.selectedRegionRow}
          nationalUnemployment={workspace.nationalRow.unemploymentRate}
        />

        <motion.section className="surface p-4" {...panelMotion}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="data-kicker">{safeText("\u0421\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u0422\u0417")}</p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                {safeText("\u0421\u0438\u0433\u043d\u0430\u043b\u044b \u0438 \u043a\u043e\u043c\u043f\u043b\u0430\u0435\u043d\u0441")}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-badge status-badge--cyan">{safeText("\u0420\u041a: \u0431\u0430\u0437\u043e\u0432\u044b\u0439 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c")}</span>
              <BellRing size={16} className="text-slate-500" />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {workspace.regionSignals.map((signal, index) => (
              <motion.article
                key={signal.id}
                className="glass-block surface-hover-subtle p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: index * 0.03 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="data-kicker">{safeText(signal.title)}</p>
                    <p className="mt-2 font-mono text-lg text-white">{safeText(signal.value)}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{safeText(signal.description)}</p>
                  </div>
                  <span className={`status-badge status-badge--${scoreTone(signal.score)}`}>
                    {safeText(scoreLabel(signal.score))}
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/6">
                  <motion.div
                    className={`h-full signal-bar signal-bar--${scoreTone(signal.score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${signal.score}%` }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: 0.05 + index * 0.03 }}
                  />
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-4 grid gap-3 border-t border-white/8 pt-4">
            {workspace.complianceChecks.map((item, index) => (
              <motion.article
                key={item.id}
                className="glass-block surface-hover-subtle p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: 0.06 + index * 0.03 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="data-kicker">{safeText(item.label)}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{safeText(item.description)}</p>
                  </div>
                  <span className={`status-badge status-badge--${item.tone}`}>{safeText(item.tone)}</span>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-4 rounded-[8px] border border-white/8 bg-white/[0.02] p-3 text-xs leading-6 text-slate-500">
            {safeText(
              "\u0412 \u043f\u0440\u043e\u0442\u043e\u0442\u0438\u043f\u0435 \u0443\u0436\u0435 \u043e\u0442\u0440\u0430\u0436\u0435\u043d\u044b \u0431\u0430\u0437\u043e\u0432\u044b\u0435 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f: \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435 \u041f\u0414\u043d, human-in-the-loop, \u043e\u0431\u044a\u044f\u0441\u043d\u0438\u043c\u043e\u0441\u0442\u044c \u0438 \u043c\u0430\u0440\u043a\u0438\u0440\u043e\u0432\u043a\u0430 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u043e\u0432. \u042e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0441\u0441\u044b\u043b\u043a\u0438 \u0438 \u043c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u044b \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u043c \u0440\u0430\u0437\u0434\u0435\u043b\u043e\u043c."
            )}
          </div>
        </motion.section>
      </div>

      <RegionsTable
        regions={workspace.data.regions}
        selectedRegion={workspace.selectedRegionRow.region}
        onSelectRegion={workspace.setSelectedRegion}
      />
    </>
  );
}
