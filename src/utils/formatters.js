const ruIntegerFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const ruCurrencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});
const ruCompactFormatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatNumberRu(value, options = {}) {
  if (Object.keys(options).length === 0) {
    return new Intl.NumberFormat("ru-RU").format(Number(value) || 0);
  }

  return new Intl.NumberFormat("ru-RU", options).format(Number(value) || 0);
}

export function formatIntegerRu(value) {
  return ruIntegerFormatter.format(Number(value) || 0);
}

export function formatCurrencyKzt(value) {
  return ruCurrencyFormatter.format(Number(value) || 0);
}

export function formatPercent(value, fractionDigits = 0) {
  const ratio = Number(value) > 1 ? Number(value) / 100 : Number(value) || 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "percent",
    maximumFractionDigits: fractionDigits,
  }).format(ratio);
}

export function formatPercentValue(value, fractionDigits = 0) {
  return `${formatNumberRu(value, {
    maximumFractionDigits: fractionDigits,
  })}%`;
}

export function formatConfidence(value) {
  return `${Math.round((Number(value) || 0) * 100)}%`;
}

export function formatCompact(value) {
  return ruCompactFormatter.format(Number(value) || 0);
}

export function formatSignedDelta(value, suffix = "") {
  const numeric = Number(value) || 0;
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${formatNumberRu(numeric)}${suffix}`;
}

export function formatDistrictLabel(district) {
  if (!district) {
    return "Неизвестный район";
  }

  return district.nameRu || district.name || district.shortName || "Неизвестный район";
}

export function formatShortDateRu(dateInput) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateInput));
}

export function formatRiskLabel(score) {
  const value = Number(score) || 0;
  if (value < 0.4) return "Низкий риск";
  if (value < 0.7) return "Средний риск";
  return "Высокий риск";
}

export function formatTurnLabel(turn) {
  return `Ход ${formatIntegerRu(turn)}`;
}
