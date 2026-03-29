import { create } from "zustand";

const MAX_TURNS = 6;
const INITIAL_BUDGET = 124_000_000;

const DECISION_CATALOG = [
  {
    id: "roads-priority",
    title: "Road repair prioritization",
    description: "Concentrate budget on streets with the strongest complaint load, safety risk, and transport pressure.",
    category: "Infrastructure",
    cost: 32_000_000,
    impact: {
      citizenTrust: 6,
      infrastructureHealth: 14,
      educationAccess: 0,
      healthcareResilience: 0,
      mobility: 12
    },
    constraints: ["Requires akimat engineering review", "Roll out in stages across the district"],
    tags: ["Open data", "Explainable ranking", "Road safety"],
    icon: "Construction"
  },
  {
    id: "school-load-balancer",
    title: "School load balancing",
    description: "Spot overloaded schools, rebalance shifts, and surface priority zones for classroom upgrades.",
    category: "Education",
    cost: 24_000_000,
    impact: {
      citizenTrust: 5,
      infrastructureHealth: 3,
      educationAccess: 16,
      healthcareResilience: 0,
      mobility: 2
    },
    constraints: ["Coordinate with the city education department"],
    tags: ["School capacity", "Predictive demand", "Human review"],
    icon: "GraduationCap"
  },
  {
    id: "clinic-flow",
    title: "Clinic flow routing",
    description: "Reduce queue overload by routing patients through time slots and service points with manual supervision.",
    category: "Healthcare",
    cost: 21_000_000,
    impact: {
      citizenTrust: 4,
      infrastructureHealth: 2,
      educationAccess: 0,
      healthcareResilience: 17,
      mobility: 4
    },
    constraints: ["No personal data without full anonymization"],
    tags: ["Queue optimization", "Operational AI", "Public services"],
    icon: "HeartPulse"
  },
  {
    id: "complaint-triage",
    title: "Complaint triage and forecasting",
    description: "Pilot a routing model for citizen complaints and highlight repeat-incident zones before they escalate.",
    category: "Citizen services",
    cost: 18_000_000,
    impact: {
      citizenTrust: 11,
      infrastructureHealth: 2,
      educationAccess: 1,
      healthcareResilience: 1,
      mobility: 3
    },
    constraints: ["Every recommendation must stay under operator control"],
    tags: ["Citizen voice", "NLP triage", "Human-in-the-loop"],
    icon: "MessagesSquare"
  },
  {
    id: "smart-lighting",
    title: "Smart lighting and patrol planning",
    description: "Target blocks with the strongest evening risk signal and coordinate maintenance with visible local impact.",
    category: "Public safety",
    cost: 27_000_000,
    impact: {
      citizenTrust: 9,
      infrastructureHealth: 8,
      educationAccess: 0,
      healthcareResilience: 2,
      mobility: 7
    },
    constraints: ["Signal quality must be checked manually before rollout"],
    tags: ["Urban safety", "Sensor planning", "Pilot rollout"],
    icon: "ShieldCheck"
  }
];

const INITIAL_LEADERBOARD = [
  { districtId: "almaly", district: "Almaly District", score: 1710, rating: 79, level: "Urban Strategist" },
  { districtId: "bostandyk", district: "Bostandyk District", score: 1665, rating: 76, level: "Data Mayor" },
  { districtId: "medeu", district: "Medeu District", score: 1580, rating: 74, level: "Balanced Operator" }
];

const clampMetric = (value) => Math.max(0, Math.min(100, Math.round(value)));

const calculateRating = (metrics) =>
  clampMetric(
    metrics.citizenTrust * 0.27 +
      metrics.infrastructureHealth * 0.24 +
      metrics.educationAccess * 0.15 +
      metrics.healthcareResilience * 0.14 +
      metrics.mobility * 0.2
  );

const buildLevel = (score) => {
  if (score >= 2100) return "Crisis Architect";
  if (score >= 1800) return "Urban Strategist";
  if (score >= 1550) return "Data Mayor";
  if (score >= 1300) return "Balanced Operator";
  return "Rising Governor";
};

const buildDistrictMetrics = (district) => {
  const schools = Number(district?.properties?.schools ?? 12);
  const hospitals = Number(district?.properties?.hospitals ?? 4);
  const roads = Number(district?.properties?.roads ?? 10);
  const complaints = Number(district?.properties?.complaints ?? 18);

  return {
    citizenTrust: clampMetric(84 - complaints * 1.05),
    infrastructureHealth: clampMetric(79 - roads * 2.15),
    educationAccess: clampMetric(52 + schools * 1.18),
    healthcareResilience: clampMetric(48 + hospitals * 4.2),
    mobility: clampMetric(78 - roads * 1.55 - complaints * 0.45)
  };
};

const buildAchievementSet = (state) => {
  const achievements = [];

  if (state.rating >= 80) {
    achievements.push({
      id: "strategist",
      title: "Urban strategist",
      description: "Raised the district rating above 80.",
      tone: "success"
    });
  }

  if (state.budget >= 35_000_000) {
    achievements.push({
      id: "efficient-budget",
      title: "Budget reserve",
      description: "Finished the round with a strong reserve still intact.",
      tone: "info"
    });
  }

  if (state.history.some((item) => item.type === "escalated")) {
    achievements.push({
      id: "human-review",
      title: "Human in the loop",
      description: "Escalated a recommendation instead of blindly accepting it.",
      tone: "warning"
    });
  }

  if (state.history.filter((item) => item.type === "applied").length >= 3) {
    achievements.push({
      id: "pilot-portfolio",
      title: "Pilot portfolio",
      description: "Launched at least three initiatives in one run.",
      tone: "success"
    });
  }

  if (state.history.some((item) => item.type === "rejected")) {
    achievements.push({
      id: "skeptical-operator",
      title: "Critical review",
      description: "Rejected a weak recommendation and kept the decision under expert control.",
      tone: "info"
    });
  }

  return achievements;
};

const createHistoryEntry = ({ type, districtName, decision, note, delta, turn, budget }) => ({
  id: `${type}-${turn}-${Date.now()}`,
  type,
  turn,
  districtName,
  decisionId: decision?.id ?? null,
  title: decision?.title ?? note,
  note,
  delta,
  budget,
  timestamp: new Date().toISOString()
});

const getDecisionById = (decisionId) => DECISION_CATALOG.find((decision) => decision.id === decisionId) ?? null;

const buildDefaultState = () => {
  const metrics = {
    citizenTrust: 61,
    infrastructureHealth: 58,
    educationAccess: 68,
    healthcareResilience: 64,
    mobility: 57
  };

  const rating = calculateRating(metrics);

  return {
    districts: [],
    selectedDistrictId: null,
    infrastructure: { schools: [], hospitals: [], roads: [] },
    complaints: [],
    leaderboard: INITIAL_LEADERBOARD,
    decisions: DECISION_CATALOG,
    activeDecisionId: null,
    hoveredDecisionId: null,
    adviceByDecision: {},
    currentTurn: 1,
    maxTurns: MAX_TURNS,
    budget: INITIAL_BUDGET,
    metrics,
    rating,
    score: 1440,
    level: buildLevel(1440),
    history: [],
    achievements: [],
    isSimulating: false,
    gameOver: false,
    sources: ["https://open.egov.kz", "https://data.egov.kz", "https://adilet.zan.kz"]
  };
};

export const useGameStore = create((set, get) => ({
  ...buildDefaultState(),

  hydrateReferenceData: ({ districts = [], infrastructure, complaints, leaderboard } = {}) =>
    set((state) => {
      const selectedDistrictId = state.selectedDistrictId ?? districts?.[0]?.properties?.id ?? districts?.[0]?.id ?? null;

      return {
        districts,
        infrastructure: infrastructure ?? state.infrastructure,
        complaints: complaints ?? state.complaints,
        leaderboard: leaderboard?.length ? leaderboard : state.leaderboard,
        selectedDistrictId
      };
    }),

  selectDistrict: (districtId) =>
    set((state) => {
      const selectedDistrict = state.districts.find((item) => item?.properties?.id === districtId) ?? state.districts[0];
      const metrics = buildDistrictMetrics(selectedDistrict);
      const rating = calculateRating(metrics);

      return {
        selectedDistrictId: selectedDistrict?.properties?.id ?? districtId,
        metrics,
        rating,
        score: Math.max(state.score, 1400 + rating * 2),
        level: buildLevel(Math.max(state.score, 1400 + rating * 2)),
        history: selectedDistrict
          ? [
              createHistoryEntry({
                type: "district",
                districtName: selectedDistrict.properties.name,
                decision: null,
                note: `${selectedDistrict.properties.name} was selected for the next planning round.`,
                delta: null,
                turn: state.currentTurn,
                budget: state.budget
              }),
              ...state.history
            ].slice(0, 12)
          : state.history
      };
    }),

  setHoveredDecision: (decisionId) => set({ hoveredDecisionId: decisionId }),
  setActiveDecision: (decisionId) => set({ activeDecisionId: decisionId }),

  upsertAdvice: (decisionId, payload) =>
    set((state) => ({
      adviceByDecision: {
        ...state.adviceByDecision,
        [decisionId]: payload
      }
    })),

  setSimulating: (value) => set({ isSimulating: Boolean(value) }),

  applyDecision: ({ decisionId, simulation, note } = {}) =>
    set((state) => {
      const decision = getDecisionById(decisionId);
      if (!decision || state.gameOver) {
        return state;
      }

      const metricsDelta = simulation?.metricsDelta ?? decision.impact;
      const nextMetrics = Object.fromEntries(
        Object.entries(state.metrics).map(([key, value]) => [key, clampMetric(value + (metricsDelta[key] ?? 0))])
      );
      const budgetDelta = simulation?.budgetDelta ?? -decision.cost;
      const nextBudget = Math.max(0, state.budget + budgetDelta);
      const rating = calculateRating(nextMetrics);
      const scoreGain = Math.max(70, Math.round(rating + (simulation?.confidence ?? 0.72) * 90));
      const nextScore = state.score + scoreGain;
      const nextTurn = state.currentTurn + 1;
      const selectedDistrict = state.districts.find((item) => item?.properties?.id === state.selectedDistrictId) ?? null;

      const nextState = {
        ...state,
        metrics: nextMetrics,
        budget: nextBudget,
        rating,
        score: nextScore,
        level: buildLevel(nextScore),
        activeDecisionId: decisionId,
        hoveredDecisionId: null,
        currentTurn: nextTurn,
        history: [
          createHistoryEntry({
            type: "applied",
            districtName: selectedDistrict?.properties?.name ?? "Almaty",
            decision,
            note: note ?? simulation?.summary ?? `"${decision.title}" was deployed with expert oversight.`,
            delta: metricsDelta,
            turn: state.currentTurn,
            budget: nextBudget
          }),
          ...state.history
        ].slice(0, 18)
      };

      const gameOver = nextTurn > state.maxTurns || nextBudget <= 0;
      return {
        ...nextState,
        gameOver,
        achievements: buildAchievementSet({ ...nextState, gameOver })
      };
    }),

  escalateDecision: ({ decisionId, note } = {}) =>
    set((state) => {
      if (state.gameOver) {
        return state;
      }

      const decision = getDecisionById(decisionId);
      const trust = clampMetric(state.metrics.citizenTrust + 2);
      const nextMetrics = { ...state.metrics, citizenTrust: trust };
      const rating = calculateRating(nextMetrics);
      const nextScore = state.score + 35;
      const nextTurn = state.currentTurn + 1;
      const selectedDistrict = state.districts.find((item) => item?.properties?.id === state.selectedDistrictId) ?? null;

      const nextState = {
        ...state,
        metrics: nextMetrics,
        rating,
        score: nextScore,
        level: buildLevel(nextScore),
        currentTurn: nextTurn,
        history: [
          createHistoryEntry({
            type: "escalated",
            districtName: selectedDistrict?.properties?.name ?? "Almaty",
            decision,
            note: note ?? `"${decision?.title ?? "Scenario"}" was escalated to expert review.`,
            delta: { citizenTrust: 2 },
            turn: state.currentTurn,
            budget: state.budget
          }),
          ...state.history
        ].slice(0, 18)
      };

      return {
        ...nextState,
        gameOver: nextTurn > state.maxTurns,
        achievements: buildAchievementSet(nextState)
      };
    }),

  rejectDecision: ({ decisionId, note } = {}) =>
    set((state) => {
      if (state.gameOver) {
        return state;
      }

      const decision = getDecisionById(decisionId);
      const nextMetrics = {
        ...state.metrics,
        citizenTrust: clampMetric(state.metrics.citizenTrust + 1),
        mobility: clampMetric(state.metrics.mobility - 1)
      };
      const rating = calculateRating(nextMetrics);
      const nextScore = state.score + 15;
      const nextTurn = state.currentTurn + 1;
      const selectedDistrict = state.districts.find((item) => item?.properties?.id === state.selectedDistrictId) ?? null;

      const nextState = {
        ...state,
        metrics: nextMetrics,
        rating,
        score: nextScore,
        level: buildLevel(nextScore),
        currentTurn: nextTurn,
        history: [
          createHistoryEntry({
            type: "rejected",
            districtName: selectedDistrict?.properties?.name ?? "Almaty",
            decision,
            note: note ?? `"${decision?.title ?? "AI advice"}" was rejected after manual review.`,
            delta: { citizenTrust: 1, mobility: -1 },
            turn: state.currentTurn,
            budget: state.budget
          }),
          ...state.history
        ].slice(0, 18)
      };

      return {
        ...nextState,
        gameOver: nextTurn > state.maxTurns,
        achievements: buildAchievementSet(nextState)
      };
    }),

  closeGameOver: () => set({ gameOver: false }),
  resetGame: () => set(buildDefaultState()),
  getSelectedDistrict: () => {
    const state = get();
    return state.districts.find((item) => item?.properties?.id === state.selectedDistrictId) ?? null;
  }
}));

export { DECISION_CATALOG, INITIAL_LEADERBOARD, calculateRating, buildDistrictMetrics };
