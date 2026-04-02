import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Layers3, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Breadcrumbs from "../components/socialradar/Breadcrumbs";
import DistrictMap from "../components/socialradar/DistrictMap";
import DistrictProfile from "../components/socialradar/DistrictProfile";
import TrendPanel from "../components/socialradar/TrendPanel";
import AlertRail from "../components/socialradar/AlertRail";
import DataProvenancePanel from "../components/socialradar/DataProvenancePanel";
import cases from "../data/cases.mock";
import { buildCaseHref, buildDistrictHref, findDistrictBySlug } from "../utils/routeParams";
import { createDistrictSignals, riskLevelTone, scoreTone } from "../hooks/useSocialRadarWorkspace";
import { normalizeDisplayText } from "../utils/text";

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function DistrictPage() {
  const workspace = useOutletContext();
  const navigate = useNavigate();
  const { districtSlug } = useParams();

  const district = useMemo(
    () => findDistrictBySlug(workspace.almatyDistricts, districtSlug) ?? workspace.selectedDistrict,
    [districtSlug, workspace.almatyDistricts, workspace.selectedDistrict]
  );

  const districtCases = useMemo(
    () => cases.filter((caseItem) => caseItem.district === district?.district),
    [district?.district]
  );
  const districtSignals = useMemo(() => createDistrictSignals(district), [district]);

  useEffect(() => {
    if (district?.district && district.district !== workspace.selectedDistrictName) {
      workspace.setSelectedDistrictName(district.district);
    }
  }, [district, workspace]);

  if (!district) {
    return (
      <div className="route-empty">
        <p className="data-kicker">{safeText("\u0420\u0430\u0439\u043e\u043d \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d")}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {safeText(
            "\u0417\u0430\u043f\u0440\u043e\u0448\u0435\u043d\u043d\u043e\u0435 \u0434\u043e\u0441\u044c\u0435 \u0440\u0430\u0439\u043e\u043d\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e \u0432 \u0442\u0435\u043a\u0443\u0449\u0435\u043c \u0441\u043b\u043e\u0435 \u0434\u0430\u043d\u043d\u044b\u0445 \u0444\u0440\u043e\u043d\u0442\u0435\u043d\u0434\u0430."
          )}
        </p>
      </div>
    );
  }

  const leadCase = districtCases[0];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "\u041e\u0431\u0437\u043e\u0440", to: "/" },
          { label: "\u0420\u0430\u0439\u043e\u043d\u044b \u0410\u043b\u043c\u0430\u0442\u044b", to: "/" },
          { label: safeText(district.district) }
        ]}
      />

      <motion.section
        className="surface surface-command p-5"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="brand-chip">{safeText("\u0414\u043e\u0441\u044c\u0435 \u0440\u0430\u0439\u043e\u043d\u0430")}</span>
              <span className={`status-badge status-badge--${riskLevelTone(district.riskLevel, district.riskScore)}`}>
                {safeText(district.riskLevel ?? "\u041d/\u0434")}
              </span>
              <span className="status-badge status-badge--slate">
                {safeText("\u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u0444\u043e\u043a\u0443\u0441")}
              </span>
            </div>

            <h1 className="mt-4 text-[1.75rem] font-semibold tracking-[-0.03em] text-white md:text-[2.05rem]">
              {safeText(district.district)}
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
              {safeText(
                "\u0422\u0438\u0445\u0438\u0439 \u044d\u043a\u0440\u0430\u043d \u0434\u043e\u0441\u044c\u0435: \u043a\u0430\u0440\u0442\u0430 \u043e\u0441\u0442\u0430\u0435\u0442\u0441\u044f \u0432\u0438\u0434\u0438\u043c\u043e\u0439, \u043d\u043e \u0444\u043e\u043a\u0443\u0441 \u043d\u0430 \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u044b\u0445 \u0441\u0438\u0433\u043d\u0430\u043b\u0430\u0445, \u0434\u0440\u0430\u0439\u0432\u0435\u0440\u0430\u0445 \u0440\u0438\u0441\u043a\u0430 \u0438 \u0432\u0445\u043e\u0434\u0435 \u0432 \u043a\u0435\u0439\u0441\u044b."
              )}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[520px]">
            <div className="command-cell">
              <p className="data-kicker">{safeText("\u041e\u0446\u0435\u043d\u043a\u0430 \u0440\u0438\u0441\u043a\u0430")}</p>
              <p className="mt-3 font-mono text-base text-white">
                {typeof district.riskScore === "number" ? district.riskScore.toFixed(1) : "\u041d/\u0434"}
              </p>
            </div>
            <div className="command-cell">
              <p className="data-kicker">{safeText("\u0423\u0440\u043e\u0432\u0435\u043d\u044c")}</p>
              <div className="mt-3">
                <span className={`status-badge status-badge--${riskLevelTone(district.riskLevel, district.riskScore)}`}>
                  {safeText(district.riskLevel ?? "\u041d/\u0434")}
                </span>
              </div>
            </div>
            <div className="command-cell">
              <p className="data-kicker">{safeText("\u0422\u043e\u043f-\u0444\u0430\u043a\u0442\u043e\u0440")}</p>
              <p className="mt-3 font-mono text-base text-white">{safeText(district.topFactor ?? "\u041d/\u0434")}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:max-w-[420px] xl:justify-end xl:col-span-2">
            {leadCase ? (
              <Link to={buildCaseHref(leadCase.id)} className="control-button">
                {safeText("\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u0435\u0439\u0441")}
                <ArrowUpRight size={14} />
              </Link>
            ) : null}
            {!leadCase ? (
              <Link to="/" className="control-button">
                {safeText("\u0412\u0435\u0440\u043d\u0443\u0442\u044c\u0441\u044f \u0432 \u043e\u0431\u0437\u043e\u0440")}
                <ArrowUpRight size={14} />
              </Link>
            ) : null}
            <Link to="/methodology" className="control-button">
              <ShieldCheck size={16} />
              {safeText("\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f")}
            </Link>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_390px]">
        <DistrictMap
          geoJson={workspace.geoJson}
          districts={workspace.almatyDistricts}
          metric={workspace.mapMetric}
          metricOptions={workspace.mapMetricOptions}
          selectedDistrictName={district.district}
          onSelectDistrict={(districtName) => navigate(buildDistrictHref(districtName))}
          onMetricChange={workspace.setMapMetric}
          liveStatus={workspace.liveRiskSnapshot.status}
          liveAlerts={workspace.liveRiskSnapshot.alerts}
          onOpenDistrict={(districtName) => navigate(buildDistrictHref(districtName))}
          openDistrictLabel="\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0430\u0439\u043e\u043d"
        />

        <DistrictProfile district={district} signals={districtSignals} liveStatus={workspace.liveRiskSnapshot.status} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <TrendPanel
          regionLabel={workspace.almatyRegionRow.region}
          data={workspace.almatySeries}
          regionRow={workspace.almatyRegionRow}
          nationalUnemployment={workspace.nationalRow.unemploymentRate}
        />

        <motion.section
          className="surface p-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="data-kicker">{safeText("\u0414\u0440\u0430\u0439\u0432\u0435\u0440\u044b \u0440\u0438\u0441\u043a\u0430")}</p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                {safeText("\u0421\u043a\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0434\u0430\u0432\u043b\u0435\u043d\u0438\u044f")}
              </h2>
            </div>
            <Layers3 size={16} className="text-slate-500" />
          </div>

          <div className="mt-4 grid gap-3">
            {districtSignals.map((signal, index) => (
              <motion.article
                key={signal.id}
                className="glass-block surface-hover-subtle p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: index * 0.04 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="data-kicker">{safeText(signal.title)}</p>
                    <p className="mt-2 font-mono text-lg text-white">{safeText(signal.value)}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{safeText(signal.description)}</p>
                  </div>
                  <span className={`status-badge status-badge--${scoreTone(signal.score)}`}>{signal.score}</span>
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
        </motion.section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <AlertRail
          cases={districtCases}
          districts={workspace.almatyDistricts}
          title="\u0421\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0435 \u043a\u0435\u0439\u0441\u044b"
          description="\u041e\u0442\u043a\u0440\u044b\u0432\u0430\u0439\u0442\u0435 \u043a\u0435\u0439\u0441\u044b, \u0447\u0442\u043e\u0431\u044b \u0443\u0433\u043b\u0443\u0431\u0438\u0442\u044c\u0441\u044f \u0432 \u043e\u0431\u044a\u044f\u0441\u043d\u0435\u043d\u0438\u044f \u0438 \u0444\u0438\u043a\u0441\u0430\u0446\u0438\u044e \u0440\u0435\u0448\u0435\u043d\u0438\u044f."
        />

        <DataProvenancePanel
          title="\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438 \u043f\u043e \u0440\u0430\u0439\u043e\u043d\u0443"
          subtitle="\u041f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c: \u043e\u0442\u043a\u0443\u0434\u0430 \u0434\u0430\u043d\u043d\u044b\u0435, \u0443\u0440\u043e\u0432\u0435\u043d\u044c \u0430\u0433\u0440\u0435\u0433\u0430\u0446\u0438\u0438, \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u044f."
          sources={[
            "dataset.zip (\u043d\u043e\u0440\u043c\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0438\u043d\u0434\u0438\u043a\u0430\u0442\u043e\u0440\u044b)",
            "Railway (\u0441\u043d\u044d\u043f\u0448\u043e\u0442 \u043f\u043e \u0440\u0430\u0439\u043e\u043d\u0430\u043c)",
            "\u0413\u0435\u043e\u043c\u0435\u0442\u0440\u0438\u044f \u0440\u0430\u0439\u043e\u043d\u043e\u0432: \u043f\u0440\u0438\u0431\u043b\u0438\u0436\u0435\u043d\u043d\u0430\u044f (\u044d\u0442\u0430\u043f \u0444\u0440\u043e\u043d\u0442\u0430)"
          ]}
          notes={[
            "\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u044b \u0442\u043e\u043b\u044c\u043a\u043e \u0430\u0433\u0440\u0435\u0433\u0430\u0442\u044b \u043f\u043e \u0440\u0430\u0439\u043e\u043d\u0443 \u0438 \u043f\u0435\u0440\u0438\u043e\u0434\u0443.",
            "\u041a\u0430\u0440\u0442\u0430 \u043d\u0443\u0436\u043d\u0430 \u0434\u043b\u044f \u043e\u0440\u0438\u0435\u043d\u0442\u0438\u0440\u0430\u0446\u0438\u0438 \u043e\u043f\u0435\u0440\u0430\u0442\u043e\u0440\u0430 \u0438 \u0434\u0435\u043c\u043e, \u043d\u0435 \u0434\u043b\u044f \u043e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0439 GIS-\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438.",
            "\u041b\u044e\u0431\u0430\u044f AI-\u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u044f \u043e\u0441\u0442\u0430\u0435\u0442\u0441\u044f \u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0442\u0438\u0432\u043d\u043e\u0439 \u0434\u043e \u0440\u0435\u0448\u0435\u043d\u0438\u044f \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u0430."
          ]}
        />
      </div>
    </>
  );
}
