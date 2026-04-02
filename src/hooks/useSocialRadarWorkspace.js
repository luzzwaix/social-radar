import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, MapPinned, Radar } from "lucide-react";
import socialRadarData from "../data/socialRadarData.json";
import { fetchDistrictRiskSnapshot, normalizeDistrictLabel } from "../api/socialRadar";
import { ALMATY_DISTRICT_GEOJSON } from "../data/almatyDistrictMap";
import { decodeUnicodeEscapesDeep } from "../utils/text";

const numberFormatter = new Intl.NumberFormat("ru-RU");
const compactFormatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1
});

const DEFAULT_REGION = "\u0433. \u0410\u043b\u043c\u0430\u0442\u044b";
const DEFAULT_DISTRICT = "\u0411\u043e\u0441\u0442\u0430\u043d\u0434\u044b\u043a\u0441\u043a\u0438\u0439 \u0440\u0430\u0439\u043e\u043d";
const NATIONAL_REGION = "\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d";

const baseMapMetricOptions = [
  { id: "total", label: "\u041d\u0430\u0441\u0435\u043b\u0435\u043d\u0438\u0435" },
  { id: "youthShare", label: "\u0414\u043e\u043b\u044f 0\u201315" },
  { id: "seniorShare", label: "\u0414\u043e\u043b\u044f 65+" }
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
    return "стабильно";
  }

  if (score >= 45) {
    return "наблюдение";
  }

  return "критично";
}

function riskLevelTone(riskLevel, riskScore) {
  const normalized = String(riskLevel ?? "").trim().toLowerCase();

  if (normalized === "\u043a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439") {
    return "rose";
  }

  if (normalized === "\u0432\u044b\u0441\u043e\u043a\u0438\u0439") {
    return "amber";
  }

  if (normalized === "\u0441\u0440\u0435\u0434\u043d\u0438\u0439") {
    return "yellow";
  }

  if (normalized === "\u043d\u0438\u0437\u043a\u0438\u0439") {
    return "emerald";
  }

  return scoreTone(typeof riskScore === "number" ? riskScore : 46);
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
      title: "Давление на рынок труда",
      value: isFiniteNumber(regionRow.unemploymentRate) ? `${regionRow.unemploymentRate.toFixed(1)}%` : "н/д",
      score: laborPressureScore,
      description:
        unemploymentGap >= 0
          ? `Выше национального уровня на ${unemploymentGap.toFixed(1)} п.п.`
          : `Ниже национального уровня на ${Math.abs(unemploymentGap).toFixed(1)} п.п.`
    },
    {
      id: "dependency",
      title: "Вне рабочей силы",
      value: isFiniteNumber(regionRow.outsideLaborForce) ? `${regionRow.outsideLaborForce.toFixed(1)}k` : "н/д",
      score: dependencyScore,
      description: "Часть населения вне активной занятости: сигнал к адресным мерам и услугам"
    },
    {
      id: "mobility",
      title: "Сигнал миграции",
      value: isFiniteNumber(regionRow.migrationBalance) ? numberFormatter.format(Math.round(regionRow.migrationBalance)) : "н/д",
      score: migrationScore,
      description:
        migrationBalance >= 0
          ? "Чистый приток: давление на инфраструктуру и рост спроса на услуги"
          : "Чистый отток: возможный экономический спад или утечка кадров"
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
      title: "Концентрация молодежи",
      value: `${district.youthShare.toFixed(1)}%`,
      score: youthScore,
      description: "Доля жителей 0–15 лет"
    },
    {
      id: "senior",
      title: "Нагрузка 65+",
      value: `${district.seniorShare.toFixed(1)}%`,
      score: seniorScore,
      description: "Доля жителей 65+: сигнал к доступности услуг и инфраструктуры"
    },
    {
      id: "density",
      title: "Масштаб населения",
      value: compactFormatter.format(district.total),
      score: densityProxy,
      description: "Объем населения как прокси спроса на услуги"
    }
  ];
}

export function useSocialRadarWorkspace() {
  const [selectedRegion, setSelectedRegion] = useState(DEFAULT_REGION);
  const [selectedDistrictName, setSelectedDistrictName] = useState(DEFAULT_DISTRICT);
  const [mapMetric, setMapMetric] = useState("total");
  const [isReady, setIsReady] = useState(false);
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
        const rawPayload = await fetchDistrictRiskSnapshot(controller.signal);
        const payload = decodeUnicodeEscapesDeep(rawPayload);

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

  const almatyRegionRow = useMemo(
    () => socialRadarData.regions.find((row) => row.region === DEFAULT_REGION) ?? nationalRow,
    [nationalRow]
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
  const almatySeries = socialRadarData.timeSeries[DEFAULT_REGION] ?? socialRadarData.timeSeries[NATIONAL_REGION] ?? [];
  const regionSignals = createRegionSignals(selectedRegionRow, nationalRow);
  const districtSignals = createDistrictSignals(selectedDistrict);

  const mapMetricOptions = useMemo(
    () =>
      liveRiskSnapshot.status === "ready"
        ? [...baseMapMetricOptions, { id: "riskScore", label: "Оценка риска" }]
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
      label: "Безработица (нац.)",
      value: nationalRow.unemploymentRate,
      suffix: "%",
      precision: 1,
      helper: `Последний бенчмарк / ${socialRadarData.meta.latestYear}`,
      change: selectedRegionRow.unemploymentRate >= nationalRow.unemploymentRate ? "выше нормы" : "ниже нормы",
      icon: Activity
    },
    {
      id: "employment",
      label: "Занятость",
      value: selectedRegionRow.employmentRate,
      suffix: "%",
      precision: 1,
      helper: selectedRegionRow.region,
      change: `${selectedSeries.length} наблюдений`,
      icon: Radar
    },
    {
      id: "migration",
      label: "Миграционный баланс",
      value: numericOr(selectedRegionRow.migrationBalance, 0),
      helper: "Сигнал мобильности населения",
      change: isFiniteNumber(selectedRegionRow.migrationBalance)
        ? selectedRegionRow.migrationBalance >= 0
          ? "чистый приток"
          : "чистый отток"
        : "частичные данные",
      icon: ArrowUpRight
    },
    {
      id: "district",
      label: "Выбранный район",
      value: Math.round(selectedDistrict.total),
      helper: selectedDistrict.district,
      change: `${selectedDistrict.youthShare.toFixed(1)}% (0–15)`,
      icon: MapPinned
    }
  ];

  const commandCells = [
    {
      label: "Регион",
      value: selectedRegionRow.region,
      helper: "Основной масштаб"
    },
    {
      label: "Район",
      value: selectedDistrict.district,
      helper: "Активный фокус"
    },
    {
      label: "Средний риск",
      value: liveRiskSnapshot.summary?.avg_risk ?? "н/д",
      helper:
        liveRiskSnapshot.status === "ready"
          ? "Live ML сводка (Railway)"
          : `${socialRadarData.regions.length} региональных сущностей`
    },
    {
      label: "Режим",
      value: liveRiskSnapshot.status === "ready" ? "ML активен" : "Только фронт",
      helper:
        liveRiskSnapshot.status === "ready"
          ? "Railway API подключен"
          : liveRiskSnapshot.status === "error"
            ? "Локальный фоллбек"
            : "Подключаем Railway API"
    }
  ];

  const operationalFeed = [
    liveRiskSnapshot.alerts
      ? {
          id: "live-alerts",
          title: "Алерты",
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
      title: "Региональный контроль",
      body: `${selectedRegionRow.region}: давление на рынок труда — ${scoreLabel(regionSignals[0].score)} относительно национальной динамики.`,
      tone: scoreTone(regionSignals[0].score)
    },
    {
      id: "district",
      title: "Сигнал по району",
      body: `${selectedDistrict.district}: демография указывает на ${scoreLabel(
        Math.round((districtSignals[0].score + districtSignals[1].score) / 2)
      )} нагрузку на услуги.`,
      tone: scoreTone(Math.round((districtSignals[0].score + districtSignals[1].score) / 2))
    },
    {
      id: "status",
      title: "Состояние платформы",
      body:
        liveRiskSnapshot.status === "ready"
          ? "Live лента риска по районам подключена через Railway. Остальные модули пока работают в режиме фронта."
          : "Стабильный фронт. Бэкенд, инференс модели и explainability подключаются без редизайна оболочки.",
      tone: liveRiskSnapshot.status === "ready" ? "cyan" : "slate"
    }
  ].filter(Boolean);

  const complianceChecks = [
    {
      id: "open-data",
      label: "\u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435",
      tone: "emerald",
      description: "\u0422\u043e\u043b\u044c\u043a\u043e \u0430\u0433\u0440\u0435\u0433\u0430\u0442\u044b. \u0414\u0430\u043d\u043d\u044b\u0435 \u043d\u043e\u0440\u043c\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u044b \u0438 \u043c\u043e\u0433\u0443\u0442 \u0431\u044b\u0442\u044c \u0437\u0430\u043c\u0435\u043d\u0435\u043d\u044b \u043d\u0430 \u043d\u0430\u0431\u043e\u0440\u044b data.egov.kz/stat.gov.kz \u0431\u0435\u0437 \u0441\u043c\u0435\u043d\u044b UI-\u043a\u0430\u0440\u043a\u0430\u0441\u0430."
    },
    {
      id: "personal-data",
      label: "\u0411\u0435\u0437 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445",
      tone: "emerald",
      description: "\u0421\u0438\u0441\u0442\u0435\u043c\u0430 \u043d\u0435 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442 \u0438\u0434\u0435\u043d\u0442\u0438\u0444\u0438\u043a\u0430\u0442\u043e\u0440\u044b \u0438 \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0441 \u0434\u0430\u043d\u043d\u044b\u043c\u0438 \u043d\u0430 \u0443\u0440\u043e\u0432\u043d\u0435 \u0440\u0430\u0439\u043e\u043d\u0430/\u043f\u0435\u0440\u0438\u043e\u0434\u0430."
    },
    {
      id: "human-loop",
      label: "Человек в контуре (HITL)",
      tone: "amber",
      description: "\u041b\u044e\u0431\u043e\u0439 AI-\u0432\u044b\u0432\u043e\u0434 \u2014 \u0442\u043e\u043b\u044c\u043a\u043e \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u044f. \u0424\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0432\u0441\u0435\u0433\u0434\u0430 \u043e\u0441\u0442\u0430\u0435\u0442\u0441\u044f \u0437\u0430 \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u043e\u043c."
    },
    {
      id: "explainability",
      label: "\u041e\u0431\u044a\u044f\u0441\u043d\u0438\u043c\u043e\u0441\u0442\u044c",
      tone: "amber",
      description: "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u043c \u0444\u0430\u043a\u0442\u043e\u0440\u044b, \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438 \u0438 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u044f \u2014 \u0431\u0443\u0434\u0443\u0449\u0438\u0439 ML \u0438 SHAP \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0430\u044e\u0442\u0441\u044f \u043a\u0443\u0441\u043a\u043e\u043c \u0431\u0435\u0437 \u043b\u043e\u043c\u043a\u0438 UX."
    }
  ];

  return {
    data: socialRadarData,
    geoJson: ALMATY_DISTRICT_GEOJSON,
    latestYear: socialRadarData.meta.latestYear,
    nationalRow,
    almatyRegionRow,
    selectedRegion,
    setSelectedRegion,
    selectedRegionRow,
    selectedSeries,
    almatySeries,
    selectedDistrict,
    selectedDistrictName,
    setSelectedDistrictName,
    almatyDistricts,
    mapMetric,
    setMapMetric,
    mapMetricOptions,
    liveRiskSnapshot,
    regionSignals,
    districtSignals,
    topMetrics,
    commandCells,
    operationalFeed,
    complianceChecks,
    isReady
  };
}

export {
  DEFAULT_REGION,
  DEFAULT_DISTRICT,
  NATIONAL_REGION,
  clamp,
  createDistrictSignals,
  isFiniteNumber,
  numericOr,
  riskLevelTone,
  scoreTone,
  scoreLabel
};
