import { request } from "./client.js";
import { districtsMock, buildDistrictFeatureCollection, getDistrictById as getMockDistrictById } from "../data/districts.mock.js";
import { isDistrictId, normalizeDistrictId } from "../utils/validators.js";

const RAILWAY_BASE_URL = "https://social-radar-production.up.railway.app";

function createDistrictListResponse() {
  return {
    districts: districtsMock,
    meta: {
      count: districtsMock.length,
      source: "mock",
    },
  };
}

export async function getDistricts() {
  return request("/api/v1/districts", {
    mockFactory: async () => createDistrictListResponse(),
  });
}

export async function getDistrictById(districtId) {
  const normalizedId = normalizeDistrictId(districtId);
  const safeId = normalizedId || "unknown";
  if (!isDistrictId(normalizedId)) {
    return request(`/api/v1/districts/${safeId}`, {
      mockFactory: async () => ({
        district: null,
        error: "Unknown district",
      }),
    });
  }

  return request(`/api/v1/districts/${safeId}`, {
    mockFactory: async () => ({
      district: getMockDistrictById(normalizedId),
    }),
  });
}

export async function getDistrictMapPreview() {
  return buildDistrictFeatureCollection();
}

export async function getRailwayDistrictSnapshot() {
  return request("/api/districts", {
    baseUrl: RAILWAY_BASE_URL,
    timeoutMs: 10000,
    useMockFallback: false,
  });
}
