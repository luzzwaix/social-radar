const integerFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0
});

const compactFormatter = new Intl.NumberFormat("ru-RU", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1
});

export function getRegionName(region) {
  return region?.region ?? region?.name ?? "Unknown";
}

export function formatNumber(value) {
  return integerFormatter.format(Number(value ?? 0));
}

export function formatCompactNumber(value) {
  return compactFormatter.format(Number(value ?? 0));
}

export function formatRate(value, digits = 1) {
  return `${Number(value ?? 0).toFixed(digits)}%`;
}

export function formatSignedNumber(value) {
  const numeric = Number(value ?? 0);

  return `${numeric > 0 ? "+" : ""}${formatNumber(numeric)}`;
}

export function getDelta(series, key) {
  if (!Array.isArray(series) || series.length < 2) {
    return 0;
  }

  const current = Number(series[series.length - 1]?.[key] ?? 0);
  const previous = Number(series[series.length - 2]?.[key] ?? 0);

  return current - previous;
}

export function mergeTrendSeries(series = [], baseline = []) {
  const baselineMap = new Map(baseline.map((item) => [item.year, item]));

  return series.map((item) => ({
    ...item,
    nationalUnemploymentRate: baselineMap.get(item.year)?.unemploymentRate ?? null,
    nationalEmploymentRate: baselineMap.get(item.year)?.employmentRate ?? null
  }));
}

export function getDistrictFill(youthShare) {
  const value = Number(youthShare ?? 0);

  if (value >= 24) {
    return "#2563eb";
  }

  if (value >= 22) {
    return "#1d4ed8";
  }

  if (value >= 20) {
    return "#1e3a5f";
  }

  return "#162230";
}
