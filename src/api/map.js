import { request } from "./client.js";
import { buildDistrictFeatureCollection, getDistrictById } from "../data/districts.mock.js";
import { getInfrastructureByDistrict, getHeatmapPoints } from "../data/infrastructure.mock.js";
import { normalizeDistrictId } from "../utils/validators.js";

function createMapDataResponse(districtId = null) {
  const district = districtId ? getDistrictById(districtId) : null;
  const districts = district ? [district] : [];
  return buildDistrictFeatureCollection(districts);
}

export async function getDistrictMapData(districtId) {
  const normalizedId = normalizeDistrictId(districtId);
  const safeId = normalizedId || "unknown";
  return request(`/api/v1/districts/${safeId}/map-data`, {
    mockFactory: async () => createMapDataResponse(normalizedId),
  });
}

export async function getInfrastructure({ district_id, type } = {}) {
  const normalizedId = normalizeDistrictId(district_id);
  return request("/api/v1/infrastructure", {
    params: {
      district_id: normalizedId || undefined,
      type: type || undefined,
    },
    mockFactory: async () => {
      const data = normalizedId
        ? getInfrastructureByDistrict(normalizedId, type || "all")
        : {
            districtId: null,
            schools: [],
            hospitals: [],
            roads: [],
            complaints: [],
          };

      return {
        ...data,
        heatmap: getHeatmapPoints(normalizedId || null),
        source: "mock",
      };
    },
  });
}

export async function getAlmatyMapData() {
  return request("/api/v1/districts/map-data", {
    mockFactory: async () => buildDistrictFeatureCollection(),
  });
}
