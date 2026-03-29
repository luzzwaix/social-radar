import { request } from "./client.js";
import { districtsMock } from "../data/districts.mock.js";
import { clamp, isDistrictId, validateAdvicePayload } from "../utils/validators.js";
import { formatRiskLabel } from "../utils/formatters.js";

function hashString(input = "") {
  return String(input)
    .split("")
    .reduce((accumulator, char) => (accumulator * 31 + char.charCodeAt(0)) % 100000, 7);
}

function pickDistrict(districtId) {
  return districtsMock.find((district) => district.id === districtId) || districtsMock[0];
}

function buildSimilarCases(district, decisionId, confidence) {
  return districtsMock
    .filter((entry) => entry.id !== district.id)
    .slice(0, 3)
    .map((entry, index) => ({
      id: `case-${entry.id}-${index + 1}`,
      district_id: entry.id,
      district_name: entry.nameRu,
      decision_id: decisionId,
      year: 2024 - index,
      outcome: index % 2 === 0 ? "Улучшение доступности услуг" : "Требовалась доработка",
      confidence: clamp(confidence - index * 0.08, 0.34, 0.96),
      note:
        index === 0
          ? "Похожий профиль нагрузки и транспортных жалоб."
          : index === 1
            ? "Параметры бюджета были ближе к пороговым."
            : "Решение проходило через экспертную эскалацию.",
    }));
}

function buildAdviceMock(payload = {}) {
  const normalized = validateAdvicePayload(payload);
  const district = isDistrictId(normalized.district_id) ? pickDistrict(normalized.district_id) : pickDistrict();
  const signal = hashString(JSON.stringify(normalized));
  const budgetPressure = clamp((district.complaintsPerMonth / 200) + district.riskIndex * 0.6, 0, 1);
  const patternConfidence = clamp(0.52 + (signal % 18) / 100 + budgetPressure * 0.18, 0.48, 0.94);
  const needsEscalation = district.riskIndex > 0.55 || patternConfidence < 0.65;

  const action = needsEscalation ? "escalate" : patternConfidence > 0.78 ? "approve" : "revise";
  const label = action === "approve" ? "Рекомендуется одобрить" : action === "revise" ? "Рекомендуется доработка" : "Рекомендуется эскалация";

  const explanation = {
    summary: `Для ${district.nameRu} система видит ${formatRiskLabel(district.riskIndex)} и предлагает решение с обязательной проверкой экспертом.`,
    why_ai_needed:
      "AI/ML нужен не для замены чиновника, а для сопоставления нескольких сигналов одновременно: жалобы, бюджет, инфраструктурная нагрузка, районный профиль и похожие случаи. Простая автоматизация не объяснит такие компромиссы и не выделит скрытые закономерности.",
    data_used: [
      "Открытые сведения об инфраструктуре и статистике",
      "Моковые геоданные района Алматы для прототипа",
      "История похожих кейсов и сценарные признаки",
    ],
    factors: [
      {
        name: "Инфраструктурная нагрузка",
        value: formatRiskLabel(district.riskIndex),
        weight: 0.31,
        impact: district.riskIndex > 0.5 ? "Повышает приоритет эскалации" : "Сдерживает риск",
      },
      {
        name: "Обращения жителей",
        value: `${district.complaintsPerMonth} жалоб в месяц`,
        weight: 0.27,
        impact: district.complaintsPerMonth > 120 ? "Сигнал к срочной проверке" : "Умеренная нагрузка",
      },
      {
        name: "Бюджетный запас",
        value: `${Math.round((district.budgetKzt / 1000000000) * 10) / 10} млрд ₸`,
        weight: 0.19,
        impact: district.budgetKzt > 10000000000 ? "Есть пространство для вмешательства" : "Ограничивает масштаб",
      },
      {
        name: "Сходство с прошлыми кейсами",
        value: `${Math.round(patternConfidence * 100)}%`,
        weight: 0.23,
        impact: "Повышает качество рекомендации, но не заменяет эксперта",
      },
    ],
    limitations: [
      "Это прототип с mock-данными, а не production-модель.",
      "Финальное решение всегда принимает человек.",
      "Официальные источники должны быть подключены перед запуском в реальном контуре.",
    ],
    human_in_the_loop: [
      "Подтвердить решение",
      "Доработать и отправить на повторный расчет",
      "Эскалировать старшему эксперту",
    ],
    source_policy:
      "Рекомендация должна сопровождаться ссылкой на официальные/open data источники и пометкой о синтетических данных, если они используются в демонстрации.",
  };

  return {
    prediction: {
      label,
      action,
      decision_id: normalized.decision_id,
      district_id: district.id,
      confidence: patternConfidence,
      expected_outcome:
        action === "approve"
          ? "Высокая вероятность полезного эффекта при экспертном подтверждении"
          : action === "revise"
            ? "Нужна точечная доработка перед утверждением"
            : "Нужна экспертная проверка и дополнительные данные",
    },
    confidence: patternConfidence,
    explanation,
    similar_cases: buildSimilarCases(district, normalized.decision_id, patternConfidence),
    recommendation: {
      human_action: action === "approve" ? "approve" : action === "revise" ? "revise" : "escalate",
      reason: needsEscalation
        ? "Высокий риск или недостаток уверенности требуют human-in-the-loop."
        : "Данные достаточно согласованы для рекомендации, но человек все равно утверждает финальный шаг.",
    },
    metadata: {
      source: "mock",
      generated_at: new Date().toISOString(),
    },
  };
}

export async function getAdvice(payload = {}) {
  return request("/api/v1/advice", {
    method: "POST",
    body: payload,
    mockFactory: async () => buildAdviceMock(payload),
  });
}

