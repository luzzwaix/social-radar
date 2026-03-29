export const APP_NAME = "SocialRadar";
export const APP_TAGLINE = "Explainable social risk intelligence for Almaty";

export const API_PREFIX = "/api/v1";
export const API_ENDPOINTS = {
  districts: `${API_PREFIX}/districts`,
  districtMapData: (districtId) => `${API_PREFIX}/districts/${districtId}/map-data`,
  infrastructure: `${API_PREFIX}/infrastructure`,
  advice: `${API_PREFIX}/advice`,
  simulate: `${API_PREFIX}/simulate`,
  endGame: `${API_PREFIX}/end-game`,
  leaderboard: `${API_PREFIX}/leaderboard`,
};

export const DEFAULT_API_TIMEOUT_MS = 8000;
export const DEFAULT_MOCK_DELAY_MS = 180;

export const ALMATY_CENTER = {
  lat: 43.238949,
  lng: 76.889709,
};

export const DISTRICT_IDS = [
  "almalinsky",
  "bostandyk",
  "zhetysu",
  "auezov",
  "medeu",
  "turksib",
  "nauryzbay",
];

export const OPEN_DATA_SOURCES = [
  {
    id: "open-egov",
    title: "open.egov.kz",
    url: "https://open.egov.kz/",
    description: "Open government datasets and administrative data.",
  },
  {
    id: "data-egov",
    title: "data.egov.kz",
    url: "https://data.egov.kz/",
    description: "Public datasets and catalog entries from Kazakhstan.",
  },
  {
    id: "stat-gov",
    title: "stat.gov.kz",
    url: "https://stat.gov.kz/",
    description: "Official statistics for demographic and socio-economic context.",
  },
];

export const CASE_THREE_FRAMING = {
  whyAI: "AI/ML is used here to rank competing signals, surface patterns across districts, and explain why one recommendation is stronger than another. It is not a replacement for an expert decision-maker.",
  humanInTheLoop: "Every recommendation requires a human reviewer to approve, revise, or escalate the decision.",
  limitations: [
    "Mock data is used in the MVP until official open datasets are wired in.",
    "The model provides recommendations and explanations, not final administrative decisions.",
    "All outputs must be validated against official/open data sources before production use.",
  ],
};

export const GOVERNANCE_NOTES = [
  "Explain every recommendation in plain language.",
  "Document open data sources and label mock data clearly.",
  "Keep a human reviewer in the loop for every decision.",
  "Show limitations and uncertainty instead of black-box outputs.",
];
