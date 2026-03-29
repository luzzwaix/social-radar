import { DISTRICT_IDS } from "./constants.js";

const districtIdSet = new Set(DISTRICT_IDS);

export function clamp(value, min = 0, max = 100) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return min;
  }
  return Math.min(max, Math.max(min, numeric));
}

export function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeDistrictId(districtId) {
  return String(districtId || "").trim().toLowerCase();
}

export function isDistrictId(districtId) {
  return districtIdSet.has(normalizeDistrictId(districtId));
}

export function validateAdvicePayload(payload = {}) {
  return {
    district_id: normalizeDistrictId(payload.district_id || payload.districtId),
    decision_id: String(payload.decision_id || payload.decisionId || "decision"),
    context: payload.context && typeof payload.context === "object" ? payload.context : {},
  };
}

export function validateSimulationPayload(payload = {}) {
  return {
    district_id: normalizeDistrictId(payload.district_id || payload.districtId),
    decision_id: String(payload.decision_id || payload.decisionId || "decision"),
    current_state: payload.current_state && typeof payload.current_state === "object" ? payload.current_state : {},
  };
}

export function validateEndGamePayload(payload = {}) {
  return {
    district_id: normalizeDistrictId(payload.district_id || payload.districtId),
    history: Array.isArray(payload.history) ? payload.history : [],
    final_state: payload.final_state && typeof payload.final_state === "object" ? payload.final_state : {},
  };
}

export function validateLeaderboardEntry(entry = {}) {
  return {
    rank: Number(entry.rank) || 0,
    district_id: normalizeDistrictId(entry.district_id || entry.districtId),
    district_name: String(entry.district_name || entry.districtName || ""),
    score: Number(entry.score) || 0,
  };
}

