import { useMemo, useState } from "react";

export const DEFAULT_MAP_CENTER = [43.238949, 76.889709];
export const DEFAULT_MAP_ZOOM = 11.2;

const DISTRICT_COLLECTION = {
  type: "FeatureCollection",
  name: "almaty-districts",
  features: [
    {
      type: "Feature",
      properties: { id: "almaly", name: "Almaly District", center: [43.225, 76.835], schools: 18, hospitals: 5, roads: 12, complaints: 34 },
      geometry: { type: "Polygon", coordinates: [[[76.79, 43.2], [76.88, 43.2], [76.88, 43.26], [76.79, 43.26], [76.79, 43.2]]] }
    },
    {
      type: "Feature",
      properties: { id: "bostandyk", name: "Bostandyk District", center: [43.225, 76.94], schools: 24, hospitals: 7, roads: 14, complaints: 27 },
      geometry: { type: "Polygon", coordinates: [[[76.88, 43.18], [77.0, 43.18], [77.0, 43.27], [76.88, 43.27], [76.88, 43.18]]] }
    },
    {
      type: "Feature",
      properties: { id: "zhetysu", name: "Zhetysu District", center: [43.15, 76.845], schools: 15, hospitals: 4, roads: 9, complaints: 21 },
      geometry: { type: "Polygon", coordinates: [[[76.8, 43.11], [76.89, 43.11], [76.89, 43.2], [76.8, 43.2], [76.8, 43.11]]] }
    },
    {
      type: "Feature",
      properties: { id: "auezov", name: "Auezov District", center: [43.225, 76.78], schools: 22, hospitals: 6, roads: 16, complaints: 31 },
      geometry: { type: "Polygon", coordinates: [[[76.72, 43.18], [76.82, 43.18], [76.82, 43.28], [76.72, 43.28], [76.72, 43.18]]] }
    },
    {
      type: "Feature",
      properties: { id: "medeu", name: "Medeu District", center: [43.305, 76.94], schools: 11, hospitals: 4, roads: 10, complaints: 18 },
      geometry: { type: "Polygon", coordinates: [[[76.88, 43.26], [77.02, 43.26], [77.02, 43.36], [76.88, 43.36], [76.88, 43.26]]] }
    },
    {
      type: "Feature",
      properties: { id: "turksib", name: "Turksib District", center: [43.135, 76.94], schools: 16, hospitals: 5, roads: 11, complaints: 24 },
      geometry: { type: "Polygon", coordinates: [[[76.88, 43.09], [77.0, 43.09], [77.0, 43.18], [76.88, 43.18], [76.88, 43.09]]] }
    },
    {
      type: "Feature",
      properties: { id: "nauryzbay", name: "Nauryzbay District", center: [43.24, 76.72], schools: 13, hospitals: 3, roads: 8, complaints: 19 },
      geometry: { type: "Polygon", coordinates: [[[76.66, 43.17], [76.77, 43.17], [76.77, 43.31], [76.66, 43.31], [76.66, 43.17]]] }
    }
  ]
};

const DEFAULT_INVENTORY = {
  schools: [
    { id: "school-1", name: "School No. 12", type: "school", districtId: "almaly", position: [43.228, 76.841], status: "Gym renovation needed" },
    { id: "school-2", name: "Lyceum No. 39", type: "school", districtId: "bostandyk", position: [43.232, 76.951], status: "Morning peak overload" },
    { id: "school-3", name: "School No. 57", type: "school", districtId: "auezov", position: [43.224, 76.779], status: "Canteen queue pressure" },
    { id: "school-4", name: "Gymnasium No. 160", type: "school", districtId: "medeu", position: [43.307, 76.944], status: "Equipment refresh needed" }
  ],
  hospitals: [
    { id: "hospital-1", name: "City Hospital No. 7", type: "hospital", districtId: "almaly", position: [43.233, 76.827], status: "High ER load" },
    { id: "hospital-2", name: "Clinic No. 4", type: "hospital", districtId: "zhetysu", position: [43.152, 76.854], status: "Scheduling flow needs review" },
    { id: "hospital-3", name: "Children's Hospital", type: "hospital", districtId: "turksib", position: [43.141, 76.945], status: "Evening peak load" }
  ],
  roads: [
    {
      id: "road-1",
      name: "Abai Avenue",
      type: "road",
      districtId: "auezov",
      geometry: [
        [43.238, 76.745],
        [43.238, 76.79],
        [43.241, 76.835]
      ],
      status: "Surface damage and settlement",
      severity: 4
    },
    {
      id: "road-2",
      name: "Satpaev Street",
      type: "road",
      districtId: "bostandyk",
      geometry: [
        [43.23, 76.89],
        [43.229, 76.93],
        [43.225, 76.98]
      ],
      status: "Rush-hour congestion",
      severity: 3
    },
    {
      id: "road-3",
      name: "Northern Ring",
      type: "road",
      districtId: "turksib",
      geometry: [
        [43.137, 76.885],
        [43.141, 76.94],
        [43.146, 76.993]
      ],
      status: "Road marking degradation",
      severity: 2
    }
  ]
};

const DEFAULT_COMPLAINTS = [
  { id: "complaint-1", districtId: "almaly", position: [43.227, 76.833], intensity: 0.95, label: "Courtyard road damage" },
  { id: "complaint-2", districtId: "almaly", position: [43.219, 76.846], intensity: 0.82, label: "Waste collection delay" },
  { id: "complaint-3", districtId: "bostandyk", position: [43.233, 76.943], intensity: 0.73, label: "Night noise" },
  { id: "complaint-4", districtId: "bostandyk", position: [43.221, 76.957], intensity: 0.67, label: "Overloaded transit stop" },
  { id: "complaint-5", districtId: "auezov", position: [43.224, 76.772], intensity: 0.91, label: "Street lighting issue" },
  { id: "complaint-6", districtId: "medeu", position: [43.303, 76.953], intensity: 0.55, label: "Snow removal delay" },
  { id: "complaint-7", districtId: "turksib", position: [43.142, 76.956], intensity: 0.7, label: "Flooding after rain" }
];

function normalizeFeatureCollection(input) {
  if (!input) return DISTRICT_COLLECTION;
  if (input.type === "FeatureCollection") return input;
  if (Array.isArray(input)) {
    return { type: "FeatureCollection", features: input };
  }
  return DISTRICT_COLLECTION;
}

function resolveSelectedDistrictId(districts, explicitId) {
  if (explicitId) return explicitId;
  return districts?.features?.[0]?.properties?.id ?? null;
}

export function getDistrictById(districts, districtId) {
  const collection = normalizeFeatureCollection(districts);
  return collection.features.find((feature) => feature?.properties?.id === districtId) ?? null;
}

export function buildDistrictSummary(feature) {
  const properties = feature?.properties ?? {};
  return {
    id: properties.id ?? null,
    name: properties.name ?? "District",
    schools: Number(properties.schools ?? 0),
    hospitals: Number(properties.hospitals ?? 0),
    roads: Number(properties.roads ?? 0),
    complaints: Number(properties.complaints ?? 0)
  };
}

export function useMap(options = {}) {
  const districts = useMemo(() => normalizeFeatureCollection(options.districts ?? DISTRICT_COLLECTION), [options.districts]);
  const infrastructure = useMemo(() => options.infrastructure ?? DEFAULT_INVENTORY, [options.infrastructure]);
  const complaints = useMemo(() => options.complaints ?? DEFAULT_COMPLAINTS, [options.complaints]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(() => resolveSelectedDistrictId(districts, options.initialSelectedDistrictId));

  const selectedDistrict = useMemo(() => getDistrictById(districts, selectedDistrictId), [districts, selectedDistrictId]);
  const districtSummaries = useMemo(() => districts.features.map(buildDistrictSummary), [districts]);

  return {
    districts,
    infrastructure,
    complaints,
    districtSummaries,
    selectedDistrict,
    selectedDistrictId,
    setSelectedDistrictId,
    mapCenter: options.center ?? DEFAULT_MAP_CENTER,
    mapZoom: options.zoom ?? DEFAULT_MAP_ZOOM,
    handleDistrictSelect: (districtId) => setSelectedDistrictId(districtId)
  };
}

export default useMap;
