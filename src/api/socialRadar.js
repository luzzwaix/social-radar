import { decodeUnicodeEscapesDeep } from "../utils/text";

const DISTRICTS_ENDPOINT =
  process.env.DISTRICTS_ENDPOINT || "https://social-radar-final.onrender.com/api/districts";

export async function fetchDistrictRiskSnapshot(signal) {
  const response = await fetch(DISTRICTS_ENDPOINT, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`District risk request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return decodeUnicodeEscapesDeep(payload);
}

export function normalizeDistrictLabel(value = "") {
  return String(value)
    .trim()
    .replace(/\s+\u0440\u0430\u0439\u043e\u043d$/iu, "")
    .toLowerCase();
}
