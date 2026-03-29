import { startTransition, useEffect, useMemo } from "react";
import { Bot, Construction, GraduationCap, HeartPulse, MessagesSquare, ShieldCheck } from "lucide-react";
import { useMap } from "./useMap";
import { useAdvice } from "./useAdvice";
import { useGameStore } from "../store/gameStore";
import { useUiStore } from "../store/uiStore";
import { OPEN_DATA_SOURCES } from "../utils/constants";

const iconMap = {
  Construction,
  GraduationCap,
  HeartPulse,
  MessagesSquare,
  ShieldCheck
};

const apiDistrictIdMap = {
  almaly: "almalinsky",
  bostandyk: "bostandyk",
  zhetysu: "zhetysu",
  auezov: "auezov",
  medeu: "medeu",
  turksib: "turksib",
  nauryzbay: "nauryzbay"
};

const nf = new Intl.NumberFormat("ru-RU");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const averageImpact = (impact = {}) => {
  const values = Object.values(impact).filter((value) => typeof value === "number");
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
};

const formatBudget = (value) => `${nf.format(value)} KZT`;

const toTimelineTone = (type) => {
  if (type === "applied") return "success";
  if (type === "escalated") return "warning";
  if (type === "rejected") return "danger";
  return "info";
};

const buildEvidence = (decision, district, metrics) => {
  const name = district?.properties?.name ?? "District";
  const complaints = Number(district?.properties?.complaints ?? 0);
  const roads = Number(district?.properties?.roads ?? 0);
  const schools = Number(district?.properties?.schools ?? 0);
  const hospitals = Number(district?.properties?.hospitals ?? 0);

  return [
    `District: ${name}`,
    `Citizen complaints: ${complaints}`,
    `Road issue count: ${roads}`,
    `Schools in scope: ${schools}`,
    `Hospitals in scope: ${hospitals}`,
    `Current district rating: ${metrics.rating}/100`
  ];
};

const buildSimilarCases = (decision, district) => {
  const districtName = district?.properties?.name ?? "Almaty";

  const library = {
    "roads-priority": [
      {
        id: "case-roads-1",
        title: "Road triage by complaints and incident density",
        summary: `${districtName}: a comparable profile where repeated complaints and visible road wear were used to justify a repair pilot.`,
        similarity: 91,
        source: "open.egov.kz / mock synthesis",
        result: "Expected reduction in repeat complaints"
      },
      {
        id: "case-roads-2",
        title: "Heatmap-led repair pilot",
        summary: "A strong scenario for visible public benefit with an explainable ranking layer.",
        similarity: 84,
        source: "data.egov.kz / urban signals",
        result: "Trust up, mobility pressure down"
      }
    ],
    "school-load-balancer": [
      {
        id: "case-schools-1",
        title: "Overloaded schools and second-shift balancing",
        summary: "The model surfaced pressure zones, while the department kept approval and rollout control.",
        similarity: 88,
        source: "education planning mock",
        result: "Reduced classroom overload"
      },
      {
        id: "case-schools-2",
        title: "Education capacity map",
        summary: "A similar case that prioritized neighborhoods by population growth and access gaps.",
        similarity: 79,
        source: "government open data",
        result: "Better access to education services"
      }
    ],
    "clinic-flow": [
      {
        id: "case-clinic-1",
        title: "Clinic triage by patient flow",
        summary: "Recommendations were used to improve scheduling and routing without replacing a medical expert.",
        similarity: 87,
        source: "health open data / mock",
        result: "Queue pressure reduced"
      },
      {
        id: "case-clinic-2",
        title: "Hourly peak forecast",
        summary: "The system highlighted load by time of day, while operators chose the intervention.",
        similarity: 81,
        source: "public service reports",
        result: "Higher service resilience"
      }
    ],
    "complaint-triage": [
      {
        id: "case-complaints-1",
        title: "Complaint routing with explainable triage",
        summary: "Every recommendation could be rejected or escalated instead of being accepted automatically.",
        similarity: 92,
        source: "citizen service reports",
        result: "Faster reaction to public signals"
      },
      {
        id: "case-complaints-2",
        title: "Repeat-incident forecasting by district",
        summary: "The model highlighted areas where recurring incidents were likely to return without intervention.",
        similarity: 85,
        source: "data.egov.kz / mock",
        result: "Sharper field prioritization"
      }
    ],
    "smart-lighting": [
      {
        id: "case-light-1",
        title: "Lighting upgrades for evening complaint clusters",
        summary: "Street-level signals were combined with public safety priorities to target the first pilot blocks.",
        similarity: 83,
        source: "urban infrastructure open data",
        result: "Perceived safety improved"
      },
      {
        id: "case-light-2",
        title: "District safety pilot",
        summary: "AI identified the first target zones, while the operations team confirmed the final rollout.",
        similarity: 77,
        source: "govtech demo archive",
        result: "Fewer late-evening complaints"
      }
    ]
  };

  return library[decision?.id] ?? [];
};

const transformRemoteAdvice = (response, decision, district, rating) => {
  if (!response || !decision || !district) return null;

  const confidence = clamp(Math.round((response.confidence ?? response.prediction?.confidence ?? 0) * 100), 0, 100);
  const factorLines = (response.explanation?.factors ?? []).map(
    (factor) => `${factor.name}: ${factor.value}. ${factor.impact}`
  );

  return {
    decisionId: decision.id,
    confidence,
    metricsDelta: decision.impact,
    summary: response.explanation?.summary ?? `AI prepared an explainable recommendation for ${district.properties.name}.`,
    prediction: {
      label: response.prediction?.label ?? "AI forecast",
      value: response.prediction?.expected_outcome ?? `District rating ${rating}/100`,
      confidence,
      delta: response.recommendation?.reason,
      summary: response.explanation?.why_ai_needed
    },
    explanation: [
      response.explanation?.summary,
      response.explanation?.why_ai_needed,
      ...factorLines,
      ...(response.explanation?.limitations ?? [])
    ].filter(Boolean),
    evidence: [...(response.explanation?.data_used ?? []), ...(response.explanation?.human_in_the_loop ?? [])],
    similarCases: (response.similar_cases ?? []).map((item) => ({
      id: item.id,
      title: item.district_name ?? item.title,
      summary: item.note ?? item.outcome,
      similarity: Math.round((item.confidence ?? 0) * 100),
      source: item.year ? `Case ${item.year}` : "Historical case",
      result: item.outcome
    })),
    sources: OPEN_DATA_SOURCES.map((source) => source.title)
  };
};

const buildAdvice = ({ decision, district, rating, metrics }) => {
  if (!decision || !district) return null;

  const weakestKey = Object.entries(metrics).sort((a, b) => a[1] - b[1])[0]?.[0];
  const impact = decision.impact ?? {};
  const alignmentBoost = weakestKey && impact[weakestKey] ? impact[weakestKey] : averageImpact(impact);
  const confidence = clamp(Math.round(64 + alignmentBoost * 1.6 + Number(district.properties.complaints ?? 0) * 0.18), 52, 96);
  const predictedGain = clamp(Math.round(averageImpact(impact) * 1.2), 3, 18);
  const predictedRating = clamp(rating + predictedGain, 0, 100);

  return {
    decisionId: decision.id,
    confidence,
    metricsDelta: impact,
    summary: `Expected effect: district rating may rise to ${predictedRating} with staged rollout and expert approval.`,
    prediction: {
      label: "AI forecast",
      value: `Rating ${predictedRating}/100`,
      confidence,
      delta: `Potential change: +${predictedGain} points`,
      summary: `The model sees a strong match between the district pain points and "${decision.title}".`
    },
    explanation: [
      `"${decision.title}" directly addresses the current weak spots in ${district.properties.name}.`,
      "The strongest signals in the forecast are complaint pressure, infrastructure load, and current service balance.",
      "AI suggests the pilot and explains its trade-offs, but the final action still belongs to the human expert."
    ],
    evidence: buildEvidence(decision, district, { rating }),
    similarCases: buildSimilarCases(decision, district),
    sources: ["open.egov.kz", "data.egov.kz", "adilet.zan.kz"]
  };
};

export function useGame() {
  const mapState = useMap();
  const gameState = useGameStore();
  const uiState = useUiStore();

  const {
    districts,
    infrastructure,
    complaints,
    decisions,
    adviceByDecision,
    selectedDistrictId,
    hoveredDecisionId,
    activeDecisionId,
    currentTurn,
    maxTurns,
    budget,
    metrics,
    rating,
    score,
    level,
    history,
    leaderboard,
    gameOver,
    sources
  } = gameState;

  useEffect(() => {
    if (districts.length) return;
    gameState.hydrateReferenceData({
      districts: mapState.districts.features,
      infrastructure: mapState.infrastructure,
      complaints: mapState.complaints
    });
  }, [districts.length, gameState, mapState.complaints, mapState.districts.features, mapState.infrastructure]);

  useEffect(() => {
    if (!gameState.districts.length) return;

    if (!selectedDistrictId) {
      gameState.selectDistrict(gameState.districts[0]?.properties?.id);
      return;
    }

    if (!history.length && currentTurn === 1) {
      gameState.selectDistrict(selectedDistrictId);
    }
  }, [currentTurn, gameState, history.length, selectedDistrictId]);

  useEffect(() => {
    if (currentTurn > 1) {
      uiState.pulseTurnFlash();
    }
  }, [currentTurn, uiState]);

  const selectedDistrict = useMemo(
    () => gameState.districts.find((item) => item?.properties?.id === selectedDistrictId) ?? null,
    [gameState.districts, selectedDistrictId]
  );

  const activeDecision = useMemo(
    () => decisions.find((decision) => decision.id === (activeDecisionId ?? hoveredDecisionId)) ?? null,
    [activeDecisionId, decisions, hoveredDecisionId]
  );

  const advicePayload = useMemo(() => {
    if (!activeDecision || !selectedDistrict) return null;

    return {
      district_id: apiDistrictIdMap[selectedDistrict.properties.id] ?? selectedDistrict.properties.id,
      decision_id: activeDecision.id,
      context: {
        district_name: selectedDistrict.properties.name,
        current_turn: currentTurn,
        rating,
        budget,
        metrics
      }
    };
  }, [activeDecision, budget, currentTurn, metrics, rating, selectedDistrict]);

  const { data: remoteAdvice } = useAdvice(advicePayload, {
    enabled: Boolean(advicePayload),
    debounceMs: 180
  });

  const activeAdvice = useMemo(() => {
    if (!activeDecision || !selectedDistrict) return null;

    const normalizedRemoteAdvice = transformRemoteAdvice(remoteAdvice, activeDecision, selectedDistrict, rating);
    if (normalizedRemoteAdvice) return normalizedRemoteAdvice;

    return (
      adviceByDecision[activeDecision.id] ??
      buildAdvice({
        decision: activeDecision,
        district: selectedDistrict,
        rating,
        metrics
      })
    );
  }, [activeDecision, adviceByDecision, metrics, rating, remoteAdvice, selectedDistrict]);

  const decisionCards = useMemo(
    () =>
      decisions.map((decision) => {
        const advice =
          adviceByDecision[decision.id] ??
          buildAdvice({
            decision,
            district: selectedDistrict,
            rating,
            metrics
          });

        return {
          ...decision,
          icon: iconMap[decision.icon] ?? Bot,
          cost: decision.cost,
          costLabel: formatBudget(decision.cost),
          numericCost: decision.cost,
          aiAdvice: advice?.summary,
          impact: Object.entries(decision.impact ?? {}).map(([key, value]) => ({
            label:
              key === "citizenTrust"
                ? "Trust"
                : key === "infrastructureHealth"
                  ? "Infra"
                  : key === "educationAccess"
                    ? "Education"
                    : key === "healthcareResilience"
                      ? "Health"
                      : "Mobility",
            value: `${value > 0 ? "+" : ""}${value}`
          })),
          disabled: decision.cost > budget
        };
      }),
    [adviceByDecision, budget, decisions, metrics, rating, selectedDistrict]
  );

  const metricsCards = useMemo(
    () => [
      {
        label: "Budget",
        value: formatBudget(budget),
        description: "Funds still available for pilots and district interventions."
      },
      {
        label: "Trust",
        value: metrics.citizenTrust,
        suffix: "/100",
        delta: activeAdvice ? Math.round((activeAdvice.metricsDelta?.citizenTrust ?? 0) / 2) : undefined,
        description: "How visible and credible the response feels to residents."
      },
      {
        label: "Infrastructure",
        value: metrics.infrastructureHealth,
        suffix: "/100",
        description: "Readiness of roads, utilities, and local maintenance capacity."
      },
      {
        label: "Mobility",
        value: metrics.mobility,
        suffix: "/100",
        description: "Transport resilience and reaction speed to road pressure."
      }
    ],
    [activeAdvice, budget, metrics]
  );

  const trendData = useMemo(() => {
    const timeline = history
      .slice()
      .reverse()
      .map((item, index) => ({
        label: `T${index + 1}`,
        value: clamp(rating - (history.length - index) * 2 + index * 3, 30, 100)
      }));

    if (!timeline.length) {
      return [
        { label: "T1", value: clamp(rating - 6, 0, 100) },
        { label: "T2", value: clamp(rating - 2, 0, 100) },
        { label: "T3", value: rating }
      ];
    }

    return [...timeline.slice(-5), { label: `T${timeline.length + 1}`, value: rating }];
  }, [history, rating]);

  const timelineEvents = useMemo(
    () =>
      history.map((item) => ({
        id: item.id,
        title: item.title,
        time: `Turn ${item.turn}`,
        description: item.note,
        meta: [item.districtName, item.budget ? `Budget: ${formatBudget(item.budget)}` : null].filter(Boolean),
        tone: toTimelineTone(item.type)
      })),
    [history]
  );

  const leaderboardRows = useMemo(() => {
    const currentRow = selectedDistrict
      ? {
          id: `current-${selectedDistrict.properties.id}`,
          name: selectedDistrict.properties.name,
          score,
          percent: clamp(Math.round((score / 2200) * 100), 18, 100)
        }
      : null;

    const baseRows = leaderboard.map((item) => ({
      id: item.districtId ?? item.id ?? item.name,
      name: item.district ?? item.name,
      score: item.score,
      percent: clamp(Math.round(((item.score ?? 0) / 2200) * 100), 18, 100)
    }));

    return [currentRow, ...baseRows].filter(Boolean).slice(0, 5);
  }, [leaderboard, score, selectedDistrict]);

  const handleDistrictSelect = (districtId) => {
    startTransition(() => {
      gameState.selectDistrict(districtId);
      uiState.addToast({
        title: "District updated",
        description: "Map, metrics, and advisory context were refreshed for the selected district.",
        type: "info"
      });
    });
  };

  const handleDecisionSelect = (decision) => {
    const advice =
      adviceByDecision[decision.id] ??
      buildAdvice({
        decision,
        district: selectedDistrict,
        rating,
        metrics
      });

    startTransition(() => {
      gameState.setActiveDecision(decision.id);
      gameState.setHoveredDecision(decision.id);
      if (advice) {
        gameState.upsertAdvice(decision.id, advice);
      }
      uiState.openExplainability();
      uiState.addToast({
        title: "Decision selected",
        description: "The advisor synced a forecast and explainability layer for this scenario.",
        type: "info",
        duration: 2200
      });
    });
  };

  const handleApplyDecision = () => {
    if (!activeDecision || !activeAdvice) return;

    startTransition(() => {
      gameState.applyDecision({
        decisionId: activeDecision.id,
        simulation: {
          metricsDelta: activeAdvice.metricsDelta,
          confidence: activeAdvice.confidence / 100,
          summary: activeAdvice.summary
        }
      });
      uiState.addToast({
        title: "Decision deployed",
        description: "District state advanced and the next turn is now active.",
        type: "success"
      });
    });
  };

  const handleEscalate = () => {
    if (!activeDecision) return;

    startTransition(() => {
      gameState.escalateDecision({ decisionId: activeDecision.id });
      uiState.addToast({
        title: "Escalated for review",
        description: "Human approval remains in the loop for this recommendation.",
        type: "info"
      });
    });
  };

  const handleReject = () => {
    if (!activeDecision) return;

    startTransition(() => {
      gameState.rejectDecision({ decisionId: activeDecision.id });
      uiState.addToast({
        title: "Decision rejected",
        description: "The AI suggestion was declined and logged for manual review.",
        type: "error"
      });
    });
  };

  const handleShare = async () => {
    const shareText = `SocialRadar: ${selectedDistrict?.properties?.name ?? "Almaty"}, rating ${rating}, level ${level}, score ${score}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      }
      uiState.addToast({
        title: "Result copied",
        description: "The simulation summary is ready for the pitch deck.",
        type: "success"
      });
    } catch {
      uiState.addToast({
        title: "Share unavailable",
        description: "Clipboard access is blocked in this browser session.",
        type: "error"
      });
    }
  };

  return {
    uiState,
    gameState,
    selectedDistrict,
    decisionCards,
    activeDecision,
    activeAdvice,
    metricsCards,
    trendData,
    timelineEvents,
    leaderboardRows,
    handleDistrictSelect,
    handleDecisionSelect,
    handleApplyDecision,
    handleEscalate,
    handleReject,
    handleShare,
    mapState,
    sources
  };
}

export default useGame;
