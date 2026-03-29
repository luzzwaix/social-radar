import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BellRing,
  Database,
  Layers3,
  MapPinned,
  Radar,
  ShieldCheck
} from "lucide-react";
import MetricStrip from "./components/socialradar/MetricStrip";
import DistrictMap from "./components/socialradar/DistrictMap";
import TrendPanel from "./components/socialradar/TrendPanel";
import DistrictProfile from "./components/socialradar/DistrictProfile";
import RegionsTable from "./components/socialradar/RegionsTable";
import socialRadarData from "./data/socialRadarData.json";
import { ALMATY_DISTRICT_GEOJSON } from "./data/almatyDistrictMap";
import { fetchDistrictRiskSnapshot, normalizeDistrictLabel } from "./api/socialRadar";

const numberFormatter = new Intl.NumberFormat("ru-RU");
const compactFormatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1
});

const DEFAULT_REGION = "\u0433. \u0410\u043b\u043c\u0430\u0442\u044b";
const DEFAULT_DISTRICT = "\u0411\u043e\u0441\u0442\u0430\u043d\u0434\u044b\u043a\u0441\u043a\u0438\u0439 \u0440\u0430\u0439\u043e\u043d";
const NATIONAL_REGION = "\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d";

const panelMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: "easeOut" }
};

const baseMapMetricOptions = [
  { id: "total", label: "Population" },
  { id: "youthShare", label: "Youth share" },
  { id: "seniorShare", label: "Senior share" }
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function numericOr(value, fallback = 0) {
  return isFiniteNumber(value) ? value : fallback;
}

function scoreTone(score) {
  if (score >= 70) {
    return "emerald";
  }

  if (score >= 45) {
    return "amber";
  }

  return "rose";
}

function scoreLabel(score) {
  if (score >= 70) {
    return "stable";
  }

  if (score >= 45) {
    return "watch";
  }

  return "critical";
}

function createRegionSignals(regionRow, nationalRow) {
  const regionUnemployment = numericOr(regionRow.unemploymentRate, numericOr(nationalRow.unemploymentRate, 0));
  const nationalUnemployment = numericOr(nationalRow.unemploymentRate, 0);
  const outsideLaborForce = numericOr(regionRow.outsideLaborForce, 0);
  const migrationBalance = numericOr(regionRow.migrationBalance, 0);
  const unemploymentGap = Number((regionUnemployment - nationalUnemployment).toFixed(1));
  const laborPressureScore = clamp(Math.round(50 + unemploymentGap * 18), 12, 96);
  const dependencyScore = clamp(Math.round(outsideLaborForce / 3.5), 18, 95);
  const migrationScore = clamp(Math.round(55 + migrationBalance / 160), 8, 95);

  return [
    {
      id: "labor",
      title: "Labor pressure",
      value: isFiniteNumber(regionRow.unemploymentRate) ? `${regionRow.unemploymentRate.toFixed(1)}%` : "N/A",
      score: laborPressureScore,
      description:
        unemploymentGap >= 0
          ? `Above national baseline by ${unemploymentGap.toFixed(1)} p.p.`
          : `${Math.abs(unemploymentGap).toFixed(1)} p.p. below national baseline`
    },
    {
      id: "dependency",
      title: "Outside labor force",
      value: isFiniteNumber(regionRow.outsideLaborForce) ? `${regionRow.outsideLaborForce.toFixed(1)}k` : "N/A",
      score: dependencyScore,
      description: "Population outside the active labor force that may require targeted services"
    },
    {
      id: "mobility",
      title: "Migration signal",
      value: isFiniteNumber(regionRow.migrationBalance) ? numberFormatter.format(Math.round(regionRow.migrationBalance)) : "N/A",
      score: migrationScore,
      description:
        migrationBalance >= 0
          ? "Net inflow suggests infrastructure pressure and service demand growth"
          : "Net outflow may indicate economic drag or talent leakage"
    }
  ];
}

function createDistrictSignals(district) {
  const youthScore = clamp(Math.round(district.youthShare * 3), 12, 92);
  const seniorScore = clamp(Math.round(district.seniorShare * 4), 10, 92);
  const densityProxy = clamp(Math.round(district.total / 6000), 20, 97);

  return [
    {
      id: "youth",
      title: "Youth concentration",
      value: `${district.youthShare.toFixed(1)}%`,
      score: youthScore,
      description: "District share of residents aged 0-15"
    },
    {
      id: "senior",
      title: "Senior load",
      value: `${district.seniorShare.toFixed(1)}%`,
      score: seniorScore,
      description: "Share of 65+ residents requiring service accessibility"
    },
    {
      id: "density",
      title: "Population mass",
      value: compactFormatter.format(district.total),
      score: densityProxy,
      description: "Population volume used as a proxy for service demand intensity"
    }
  ];
}

function SkeletonDashboard() {
  return (
    <motion.div className="mt-4 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="surface p-4">
        <div className="grid gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-shell p-3">
              <div className="skeleton-bar h-3 w-24" />
              <div className="mt-4 skeleton-bar h-8 w-32" />
              <div className="mt-4 skeleton-bar h-3 w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_390px]">
        <div className="surface h-[620px] p-4">
          <div className="skeleton-bar h-4 w-44" />
          <div className="mt-3 skeleton-bar h-3 w-80" />
          <div className="mt-6 h-[520px] rounded-[8px] border border-white/6 bg-[#0a1017]" />
        </div>
        <div className="space-y-4">
          <div className="surface h-[390px] p-4" />
          <div className="surface h-[220px] p-4" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="surface h-[420px] p-4" />
        <div className="surface h-[420px] p-4" />
      </div>
    </motion.div>
  );
}

function MethodologyModal({ latestYear, open, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060b]/78 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="surface w-full max-w-2xl p-6"
            initial={{ opacity: 0, scale: 0.97, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 18 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="data-kicker">Methodology</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Frontend delivery and compliance notes
                </h2>
              </div>
              <button
                type="button"
                className="rounded-[8px] border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/5"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="glass-block p-4">
                <p className="data-kicker">Data layer</p>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                  <li>`dataset.zip` is normalized into a local frontend JSON model.</li>
                  <li>The current interface shows aggregated indicators only.</li>
                  <li>Latest normalized year in the build: {latestYear}.</li>
                </ul>
              </div>

              <div className="glass-block p-4">
                <p className="data-kicker">Guardrails</p>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                  <li>No personal data is surfaced in the current UI.</li>
                  <li>The map is approximate until official GIS arrives.</li>
                  <li>FastAPI and ML are intentionally deferred for the frontend stage.</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-[8px] border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-50">
              This stage is intentionally optimized for jury impact: stable frontend, premium interactions, visible
              governance constraints, and a shell that can attach to FastAPI and ML later without redesign.
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_REGION);
  const [selectedDistrictName, setSelectedDistrictName] = useState(DEFAULT_DISTRICT);
  const [mapMetric, setMapMetric] = useState("total");
  const [isReady, setIsReady] = useState(false);
  const [isMethodologyOpen, setMethodologyOpen] = useState(false);
  const [liveRiskSnapshot, setLiveRiskSnapshot] = useState({
    status: "loading",
    districts: [],
    alerts: null,
    summary: null,
    error: null
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 380);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadRiskSnapshot() {
      try {
        const payload = await fetchDistrictRiskSnapshot(controller.signal);

        if (cancelled) {
          return;
        }

        setLiveRiskSnapshot({
          status: "ready",
          districts: Array.isArray(payload?.districts) ? payload.districts : [],
          alerts: payload?.alerts ?? null,
          summary: payload?.summary ?? null,
          error: null
        });
      } catch (error) {
        if (cancelled || error?.name === "AbortError") {
          return;
        }

        setLiveRiskSnapshot({
          status: "error",
          districts: [],
          alerts: null,
          summary: null,
          error
        });
      }
    }

    loadRiskSnapshot();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const nationalRow = useMemo(
    () => socialRadarData.regions.find((row) => row.region === NATIONAL_REGION) ?? socialRadarData.regions[0],
    []
  );

  const selectedRegionRow = useMemo(
    () => socialRadarData.regions.find((row) => row.region === selectedRegion) ?? nationalRow,
    [nationalRow, selectedRegion]
  );

  const liveRiskLookup = useMemo(
    () =>
      new Map(
        liveRiskSnapshot.districts.map((district) => [normalizeDistrictLabel(district.district), district])
      ),
    [liveRiskSnapshot.districts]
  );

  const almatyDistricts = useMemo(
    () =>
      socialRadarData.almatyDistricts.map((district) => {
        const liveDistrict = liveRiskLookup.get(normalizeDistrictLabel(district.district));

        return {
          ...district,
          riskScore: liveDistrict?.risk_score ?? null,
          riskLevel: liveDistrict?.risk_level ?? null,
          topFactor: liveDistrict?.top_factor ?? null,
          isAnomaly: Boolean(liveDistrict?.is_anomaly),
          riskCode: liveDistrict?.code ?? null,
          liveLat: liveDistrict?.lat ?? null,
          liveLng: liveDistrict?.lng ?? null
        };
      }),
    [liveRiskLookup]
  );

  const selectedDistrict = useMemo(
    () => almatyDistricts.find((district) => district.district === selectedDistrictName) ?? almatyDistricts[0],
    [almatyDistricts, selectedDistrictName]
  );

  const selectedSeries = socialRadarData.timeSeries[selectedRegion] ?? socialRadarData.timeSeries[NATIONAL_REGION] ?? [];
  const regionSignals = createRegionSignals(selectedRegionRow, nationalRow);
  const districtSignals = createDistrictSignals(selectedDistrict);
  const mapMetricOptions = useMemo(
    () =>
      liveRiskSnapshot.status === "ready"
        ? [...baseMapMetricOptions, { id: "riskScore", label: "Risk score" }]
        : baseMapMetricOptions,
    [liveRiskSnapshot.status]
  );

  useEffect(() => {
    if (mapMetric === "riskScore" && liveRiskSnapshot.status !== "ready") {
      setMapMetric("total");
    }
  }, [liveRiskSnapshot.status, mapMetric]);

  const topMetrics = [
    {
      id: "unemployment",
      label: "National unemployment",
      value: nationalRow.unemploymentRate,
      suffix: "%",
      precision: 1,
      helper: `Latest benchmark / ${socialRadarData.meta.latestYear}`,
      change: selectedRegionRow.unemploymentRate >= nationalRow.unemploymentRate ? "elevated" : "below baseline",
      icon: Activity
    },
    {
      id: "employment",
      label: "Employment rate",
      value: selectedRegionRow.employmentRate,
      suffix: "%",
      precision: 1,
      helper: selectedRegionRow.region,
      change: `${selectedSeries.length} yearly observations`,
      icon: Radar
    },
    {
      id: "migration",
      label: "Migration balance",
      value: numericOr(selectedRegionRow.migrationBalance, 0),
      helper: "Regional mobility signal",
      change: isFiniteNumber(selectedRegionRow.migrationBalance)
        ? selectedRegionRow.migrationBalance >= 0
          ? "net inflow"
          : "net outflow"
        : "partial data",
      icon: ArrowUpRight
    },
    {
      id: "district",
      label: "Selected district",
      value: Math.round(selectedDistrict.total),
      helper: selectedDistrict.district,
      change: `${selectedDistrict.youthShare.toFixed(1)}% youth share`,
      icon: MapPinned
    }
  ];

  const commandCells = [
    {
      label: "Region",
      value: selectedRegionRow.region,
      helper: "Primary regional scope"
    },
    {
      label: "District",
      value: selectedDistrict.district,
      helper: "Active spatial readout"
    },
    {
      label: "Data snapshot",
      value: socialRadarData.meta.latestYear,
      helper: `${socialRadarData.regions.length} regional entities`
    },
    {
      label: "Delivery mode",
      value: liveRiskSnapshot.status === "ready" ? "Hybrid live" : "Frontend only",
      helper:
        liveRiskSnapshot.status === "ready"
          ? "Railway district API connected"
          : liveRiskSnapshot.status === "error"
            ? "Using local fallback"
            : "Connecting Railway API"
    }
  ];

  const operationalFeed = [
    liveRiskSnapshot.alerts
      ? {
          id: "live-alerts",
          title: "Live alerts",
          body: liveRiskSnapshot.alerts.message,
          tone:
            numericOr(liveRiskSnapshot.alerts.critical_count, 0) > 0
              ? "rose"
              : numericOr(liveRiskSnapshot.alerts.high_count, 0) > 0
                ? "amber"
                : "emerald"
        }
      : null,
    {
      id: "watchlist",
      title: "Regional watchlist",
      body: `${selectedRegionRow.region}: labor pressure is ${scoreLabel(regionSignals[0].score)} relative to the national curve.`,
      tone: scoreTone(regionSignals[0].score)
    },
    {
      id: "district",
      title: "District insight",
      body: `${selectedDistrict.district}: demographic mix indicates ${scoreLabel(
        Math.round((districtSignals[0].score + districtSignals[1].score) / 2)
      )} dependency pressure.`,
      tone: scoreTone(Math.round((districtSignals[0].score + districtSignals[1].score) / 2))
    },
    {
      id: "status",
      title: "Platform state",
      body:
        liveRiskSnapshot.status === "ready"
          ? "Live district risk feed is connected from Railway while the rest of the platform stays frontend-first."
          : "Stable local frontend. Backend, model inference, and explainable scoring connect later without shell changes.",
      tone: liveRiskSnapshot.status === "ready" ? "cyan" : "slate"
    }
  ].filter(Boolean);

  const complianceChecks = [
    {
      id: "open-data",
      label: "Open-data baseline",
      tone: "emerald",
      description: "Aggregated statistics only, structured from the provided archive and aligned with the open-data approach in the brief."
    },
    {
      id: "personal-data",
      label: "No personal data",
      tone: "emerald",
      description: "The current surface avoids identity-linked records and keeps the jury demo in a safe compliance zone."
    },
    {
      id: "human-loop",
      label: "Human review required",
      tone: "amber",
      description: "Any future AI output is framed as decision support only. Final action remains with a human operator."
    },
    {
      id: "explainability",
      label: "Explainability ready",
      tone: "amber",
      description: "This stage exposes methodology and source context now so the future ML layer can attach with transparent reasoning."
    }
  ];

  return (
    <>
      <div className="radar-page min-h-screen text-slate-100">
        <div className="radar-page__mesh" />
        <div className="radar-page__glow radar-page__glow--left" />
        <div className="radar-page__glow radar-page__glow--right" />
        <div className="radar-page__scanline" />

        <div className="relative z-10 mx-auto max-w-[1680px] px-4 py-5 sm:px-6 lg:px-8">
          <motion.header className="surface surface-command p-4 md:p-5" {...panelMotion}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="brand-chip">Mayor Simulator</span>
                  <span className="status-badge status-badge--slate">Palantir-style shell</span>
                  <span className="status-badge status-badge--cyan">
                    <span className={`live-dot ${liveRiskSnapshot.status === "ready" ? "live-dot--active" : ""}`} />
                    Frontend build
                  </span>
                </div>

                <div className="mt-4 max-w-4xl">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h1 className="text-[1.75rem] font-semibold tracking-[-0.05em] text-white md:text-[2.15rem]">
                      Mayor Simulator civic operations console
                    </h1>
                    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      Almaty urban command surface
                    </span>
                  </div>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    District map, regional monitoring, sortable rankings, and visible governance guardrails in one
                    dense console ready for demo now and FastAPI later.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 xl:max-w-[340px] xl:justify-end">
                <span className="pill pill--ghost">Open data</span>
                <span className="pill pill--ghost">No personal data</span>
                <span className="pill pill--ghost">ML pending</span>
                <button type="button" className="control-button" onClick={() => setMethodologyOpen(true)}>
                  <ShieldCheck size={16} />
                  Methodology
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              {commandCells.map((item, index) => (
                <motion.article
                  key={item.label}
                  className="command-cell"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, delay: index * 0.04 }}
                  whileHover={{ y: -3, rotateX: 4, rotateY: -2 }}
                  whileTap={{ scale: 0.995 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <p className="data-kicker">{item.label}</p>
                  {item.label === "Delivery mode" ? (
                    <motion.div
                      key={`${item.value}-${item.helper}`}
                      className="command-cell__content"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <p className="mt-3 font-mono text-base text-white md:text-lg">{item.value}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
                    </motion.div>
                  ) : (
                    <>
                      <p className="mt-3 font-mono text-base text-white md:text-lg">{item.value}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
                    </>
                  )}
                </motion.article>
              ))}
            </div>
          </motion.header>

          <AnimatePresence mode="wait">
            {isReady ? (
              <motion.main
                key="content"
                className="mt-4 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                {liveRiskSnapshot.alerts ? (
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
                          <p className="data-kicker">Live district alerts</p>
                          <p className="alert-strip__message">{liveRiskSnapshot.alerts.message}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="status-badge status-badge--rose">
                          {numericOr(liveRiskSnapshot.alerts.critical_count, 0)} critical
                        </span>
                        <span className="status-badge status-badge--amber">
                          {numericOr(liveRiskSnapshot.alerts.high_count, 0)} high
                        </span>
                        {liveRiskSnapshot.summary ? (
                          <span className="status-badge status-badge--cyan">
                            avg risk {liveRiskSnapshot.summary.avg_risk}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </motion.section>
                ) : null}

                <MetricStrip metrics={topMetrics} />

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_390px]">
                  <DistrictMap
                    geoJson={ALMATY_DISTRICT_GEOJSON}
                    districts={almatyDistricts}
                    metric={mapMetric}
                    metricOptions={mapMetricOptions}
                    selectedDistrictName={selectedDistrict.district}
                    onSelectDistrict={setSelectedDistrictName}
                    onMetricChange={setMapMetric}
                    liveStatus={liveRiskSnapshot.status}
                    liveAlerts={liveRiskSnapshot.alerts}
                  />

                  <div className="space-y-4">
                    <DistrictProfile
                      district={selectedDistrict}
                      signals={districtSignals}
                      liveStatus={liveRiskSnapshot.status}
                    />

                    <motion.section className="surface p-4" {...panelMotion}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="data-kicker">Operations feed</p>
                          <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">Mission control</h2>
                        </div>
                        <BellRing size={16} className="text-slate-500" />
                      </div>

                      <div className="mt-4 space-y-3">
                        {operationalFeed.map((item, index) => (
                          <motion.article
                            key={item.id}
                            className="glass-block surface-hover-subtle p-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: index * 0.04 }}
                            whileHover={{ y: -2 }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="data-kicker">{item.title}</p>
                                <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                              </div>
                              <span className={`status-badge status-badge--${item.tone}`}>{item.tone}</span>
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    </motion.section>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                  <TrendPanel
                    regionLabel={selectedRegionRow.region}
                    data={selectedSeries}
                    regionRow={selectedRegionRow}
                    nationalUnemployment={nationalRow.unemploymentRate}
                  />

                  <motion.section className="surface p-4" {...panelMotion}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="data-kicker">Hackathon fit</p>
                        <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                          Signals and compliance
                        </h2>
                      </div>
                      <span className="status-badge status-badge--cyan">RK baseline checked</span>
                    </div>

                    <div className="mt-4 grid gap-3">
                      {regionSignals.map((signal, index) => (
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
                              <p className="data-kicker">{signal.title}</p>
                              <p className="mt-2 font-mono text-lg text-white">{signal.value}</p>
                              <p className="mt-2 text-sm leading-6 text-slate-400">{signal.description}</p>
                            </div>
                            <span className={`status-badge status-badge--${scoreTone(signal.score)}`}>
                              {scoreLabel(signal.score)}
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
                      {complianceChecks.map((item, index) => (
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
                              <p className="data-kicker">{item.label}</p>
                              <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                            </div>
                            <span className={`status-badge status-badge--${item.tone}`}>{item.tone}</span>
                          </div>
                        </motion.article>
                      ))}
                    </div>

                    <div className="mt-4 rounded-[8px] border border-white/8 bg-white/[0.02] p-3 text-xs leading-6 text-slate-500">
                      References already reflected in the current frontend: RK laws on personal data, informatization,
                      access to information, and AI. The build stays intentionally conservative until backend and ML are
                      delivered.
                    </div>
                  </motion.section>
                </div>

                <RegionsTable
                  regions={socialRadarData.regions}
                  selectedRegion={selectedRegionRow.region}
                  onSelectRegion={setSelectedRegion}
                />
              </motion.main>
            ) : (
              <SkeletonDashboard key="skeleton" />
            )}
          </AnimatePresence>
        </div>
      </div>

      <MethodologyModal
        latestYear={socialRadarData.meta.latestYear}
        open={isMethodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </>
  );
}
