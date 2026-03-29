import { request } from "./client.js";
import { districtsMock } from "../data/districts.mock.js";
import { clamp, validateEndGamePayload, validateSimulationPayload } from "../utils/validators.js";
import { formatCurrencyKzt, formatIntegerRu, formatSignedDelta } from "../utils/formatters.js";

function hashString(input = "") {
  return String(input)
    .split("")
    .reduce((accumulator, char) => (accumulator * 33 + char.charCodeAt(0)) % 100000, 13);
}

function getDistrict(districtId) {
  return districtsMock.find((district) => district.id === districtId) || districtsMock[0];
}

function deriveMetrics(district, normalized) {
  const seed = hashString(`${normalized.decision_id}:${district.id}`);
  const decisionWeight = (seed % 17) / 16;
  const baseBudget = Number(normalized.current_state.budget ?? district.budgetKzt);
  const currentRating = Number(normalized.current_state.rating ?? 62);
  const currentTrust = Number(normalized.current_state.trust ?? 58);
  const currentSatisfaction = Number(normalized.current_state.satisfaction ?? 61);
  const backlog = Number(normalized.current_state.backlog ?? district.complaintsPerMonth);

  const budgetCost = Math.round((district.budgetKzt * (0.012 + decisionWeight * 0.02)) / 1000000) * 1000000;
  const ratingDelta = clamp((district.riskIndex < 0.45 ? 4 : -2) + decisionWeight * 6, -8, 12);
  const trustDelta = clamp((district.riskIndex < 0.45 ? 3 : 0) + decisionWeight * 5, -5, 10);
  const satisfactionDelta = clamp((district.complaintsPerMonth < 120 ? 2 : -1) + decisionWeight * 4, -6, 9);
  const backlogDelta = clamp(8 + decisionWeight * 10, 4, 18);

  return {
    baseBudget,
    currentRating,
    currentTrust,
    currentSatisfaction,
    backlog,
    budgetCost,
    ratingDelta,
    trustDelta,
    satisfactionDelta,
    backlogDelta,
  };
}

function makeAchievement(district, key, title, description, icon) {
  return {
    id: `${district.id}-${key}`,
    title,
    description,
    icon,
  };
}

function buildSimulationMock(payload = {}) {
  const normalized = validateSimulationPayload(payload);
  const district = getDistrict(normalized.district_id);
  const metrics = deriveMetrics(district, normalized);

  const newState = {
    ...normalized.current_state,
    district_id: district.id,
    rating: Math.round(clamp(metrics.currentRating + metrics.ratingDelta, 0, 100)),
    trust: Math.round(clamp(metrics.currentTrust + metrics.trustDelta, 0, 100)),
    satisfaction: Math.round(clamp(metrics.currentSatisfaction + metrics.satisfactionDelta, 0, 100)),
    backlog: Math.max(0, Math.round(metrics.backlog - metrics.backlogDelta)),
    budget: Math.max(0, metrics.baseBudget - metrics.budgetCost),
    turn: Number(normalized.current_state.turn || 0) + 1,
  };

  const events = [
    {
      id: `${district.id}-event-1`,
      title: "Экспертная проверка активирована",
      description: "AI сгенерировал объяснение, но решение ушло на человеческую валидацию.",
      impact: "human_in_the_loop",
    },
    {
      id: `${district.id}-event-2`,
      title: "Приоритет обновлен",
      description:
        metrics.ratingDelta >= 0
          ? "Район получил более высокий приоритет после оценки риска и обратной связи жителей."
          : "Система предложила доработку из-за конфликтующих сигналов и ограничений бюджета.",
      impact: metrics.ratingDelta >= 0 ? "positive" : "needs_revision",
    },
    {
      id: `${district.id}-event-3`,
      title: "Объяснение сгенерировано",
      description: "AI сравнил ситуацию с похожими кейсами и показал why/what/what-next на русском языке.",
      impact: "explainability",
    },
  ];

  const achievements = [
    metrics.ratingDelta > 0
      ? makeAchievement(district, "trusted-decision", "Доверие выросло", "Решение улучшило рейтинг района.", "Award")
      : null,
    metrics.trustDelta > 2
      ? makeAchievement(district, "human-reviewer", "Human-in-the-loop", "Решение прошло экспертное подтверждение.", "ShieldCheck")
      : null,
    metrics.backlogDelta > 10
      ? makeAchievement(district, "backlog-reducer", "Снижение очереди", "Система помогла сократить накопленные обращения.", "TrendingDown")
      : null,
  ].filter(Boolean);

  return {
    new_state: newState,
    events,
    achievements,
    summary: {
      budget_spent: formatCurrencyKzt(metrics.budgetCost),
      rating_delta: formatSignedDelta(metrics.ratingDelta),
      trust_delta: formatSignedDelta(metrics.trustDelta),
      satisfaction_delta: formatSignedDelta(metrics.satisfactionDelta),
      backlog_reduced: formatIntegerRu(metrics.backlogDelta),
    },
    metadata: {
      source: "mock",
      district_name: district.nameRu,
      generated_at: new Date().toISOString(),
    },
  };
}

function buildEndGameMock(payload = {}) {
  const normalized = validateEndGamePayload(payload);
  const district = getDistrict(normalized.district_id);
  const historyLength = normalized.history.length;
  const finalState = normalized.final_state || {};
  const rating = Math.round(clamp(finalState.rating ?? 0, 0, 100));
  const trust = Math.round(clamp(finalState.trust ?? 0, 0, 100));
  const satisfaction = Math.round(clamp(finalState.satisfaction ?? 0, 0, 100));

  const score = Math.round(rating * 10 + trust * 6 + satisfaction * 4 + historyLength * 12);
  const level =
    score >= 1200 ? "Platinum" : score >= 950 ? "Gold" : score >= 700 ? "Silver" : score >= 450 ? "Bronze" : "Starter";

  const finalAchievements = [
    makeAchievement(district, "case-closed", "Case closed", "Прототип завершил цикл решений для района.", "CircleCheck"),
    ...(rating >= 80
      ? [makeAchievement(district, "high-rating", "Сильный рейтинг", "Финальный рейтинг района превысил 80.", "Star")]
      : []),
    ...(trust >= 70
      ? [makeAchievement(district, "trusted-rules", "Доверие команды", "Жители и эксперты получили понятную логику решения.", "Handshake")]
      : []),
  ];

  return {
    final_rating: rating,
    level,
    achievements: finalAchievements,
    score,
    leaderboard_hint: {
      district_id: district.id,
      district_name: district.nameRu,
      rank_estimate: Math.max(1, 8 - Math.floor(score / 200)),
    },
    narrative: {
      summary:
        "Прототип показал, как AI/ML помогает сравнивать сигналы, объяснять компромиссы и не подменять финальное решение человека.",
      limitations: [
        "Mock-данные остаются демонстрационными и требуют замены на официальные open datasets.",
        "Окончательное решение нельзя автоматизировать без изменения кейсовых требований.",
      ],
    },
    metadata: {
      source: "mock",
      generated_at: new Date().toISOString(),
      history_length: historyLength,
      district_name: district.nameRu,
    },
  };
}

export async function simulateDecision(payload = {}) {
  return request("/api/v1/simulate", {
    method: "POST",
    body: payload,
    mockFactory: async () => buildSimulationMock(payload),
  });
}

export async function endGame(payload = {}) {
  return request("/api/v1/end-game", {
    method: "POST",
    body: payload,
    mockFactory: async () => buildEndGameMock(payload),
  });
}

