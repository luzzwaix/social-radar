import { districtsMock, getDistrictById } from "./districts.mock.js";

function offsetPoint(center, latShift, lngShift) {
  return {
    lat: Number((center.lat + latShift).toFixed(6)),
    lng: Number((center.lng + lngShift).toFixed(6)),
  };
}

function makeSchool(district, index, latShift, lngShift) {
  const point = offsetPoint(district.center, latShift, lngShift);
  return {
    id: `${district.id}-school-${index}`,
    districtId: district.id,
    type: "school",
    name: `${district.shortName} School ${index}`,
    nameRu: `Школа №${index} (${district.shortName})`,
    lat: point.lat,
    lng: point.lng,
    address: `${district.nameRu}, учебный квартал ${index}`,
    capacity: 850 + index * 70,
    occupancy: 0.72 + index * 0.03,
    status: index % 3 === 0 ? "needs_review" : "operational",
    source: "open.egov.kz",
  };
}

function makeHospital(district, index, latShift, lngShift) {
  const point = offsetPoint(district.center, latShift, lngShift);
  return {
    id: `${district.id}-hospital-${index}`,
    districtId: district.id,
    type: "hospital",
    name: `${district.shortName} Clinic ${index}`,
    nameRu: `Поликлиника №${index} (${district.shortName})`,
    lat: point.lat,
    lng: point.lng,
    address: `${district.nameRu}, медквартал ${index}`,
    beds: 140 + index * 18,
    occupancy: 0.66 + index * 0.04,
    status: index % 2 === 0 ? "operational" : "capacity_risk",
    source: "open.egov.kz",
  };
}

function makeRoadIssue(district, index, latShift, lngShift) {
  const point = offsetPoint(district.center, latShift, lngShift);
  const severities = ["low", "medium", "high"];
  return {
    id: `${district.id}-road-${index}`,
    districtId: district.id,
    type: "road",
    name: `${district.shortName} Road Issue ${index}`,
    nameRu: `Проблемный участок дороги ${index} (${district.shortName})`,
    lat: point.lat,
    lng: point.lng,
    severity: severities[index % severities.length],
    status: index % 2 === 0 ? "needs_repair" : "monitoring",
    description: `Mock road segment for ${district.nameRu}.`,
    source: "mock",
  };
}

function makeComplaint(district, index, latShift, lngShift) {
  const point = offsetPoint(district.center, latShift, lngShift);
  const categories = ["transport", "schools", "utilities", "roads", "public-services"];
  return {
    id: `${district.id}-complaint-${index}`,
    districtId: district.id,
    type: "complaint",
    category: categories[index % categories.length],
    title: `Обращение ${index}`,
    message: `Жители отмечают локальную проблему в ${district.nameRu}.`,
    lat: point.lat,
    lng: point.lng,
    weight: 1 + (index % 5),
    createdAt: `2026-03-${String(10 + index).padStart(2, "0")}T10:00:00.000Z`,
    source: "mock",
  };
}

const districtInfrastructurePlan = {
  almalinsky: { schools: 3, hospitals: 2, roads: 2, complaints: 4 },
  bostandyk: { schools: 4, hospitals: 2, roads: 2, complaints: 5 },
  zhetysu: { schools: 3, hospitals: 1, roads: 2, complaints: 4 },
  auezov: { schools: 4, hospitals: 2, roads: 2, complaints: 5 },
  medeu: { schools: 2, hospitals: 1, roads: 2, complaints: 3 },
  turksib: { schools: 3, hospitals: 1, roads: 3, complaints: 4 },
  nauryzbay: { schools: 2, hospitals: 1, roads: 2, complaints: 3 },
};

const generated = districtsMock.map((district) => {
  const plan = districtInfrastructurePlan[district.id] || districtInfrastructurePlan.almalinsky;
  const schools = Array.from({ length: plan.schools }, (_, index) =>
    makeSchool(district, index + 1, -0.008 + index * 0.004, -0.01 + index * 0.006)
  );
  const hospitals = Array.from({ length: plan.hospitals }, (_, index) =>
    makeHospital(district, index + 1, 0.006 - index * 0.004, 0.005 + index * 0.004)
  );
  const roads = Array.from({ length: plan.roads }, (_, index) =>
    makeRoadIssue(district, index + 1, 0.012 - index * 0.006, -0.012 + index * 0.007)
  );
  const complaints = Array.from({ length: plan.complaints }, (_, index) =>
    makeComplaint(district, index + 1, -0.015 + index * 0.007, 0.014 - index * 0.005)
  );

  return { districtId: district.id, schools, hospitals, roads, complaints };
});

export const schoolsMock = generated.flatMap((entry) => entry.schools);
export const hospitalsMock = generated.flatMap((entry) => entry.hospitals);
export const roadsMock = generated.flatMap((entry) => entry.roads);
export const complaintsMock = generated.flatMap((entry) => entry.complaints);

export const infrastructureMock = {
  schools: schoolsMock,
  hospitals: hospitalsMock,
  roads: roadsMock,
  complaints: complaintsMock,
};

export function getInfrastructureByDistrict(districtId, type = "all") {
  const normalizedDistrictId = String(districtId || "").toLowerCase();
  const district = getDistrictById(normalizedDistrictId);
  if (!district) {
    return {
      districtId: normalizedDistrictId,
      schools: [],
      hospitals: [],
      roads: [],
      complaints: [],
    };
  }

  const slice = generated.find((entry) => entry.districtId === district.id) || {
    schools: [],
    hospitals: [],
    roads: [],
    complaints: [],
  };

  if (type === "school" || type === "schools") {
    return { districtId: district.id, schools: slice.schools, hospitals: [], roads: [], complaints: [] };
  }

  if (type === "hospital" || type === "hospitals") {
    return { districtId: district.id, schools: [], hospitals: slice.hospitals, roads: [], complaints: [] };
  }

  if (type === "road" || type === "roads") {
    return { districtId: district.id, schools: [], hospitals: [], roads: slice.roads, complaints: [] };
  }

  if (type === "complaint" || type === "complaints" || type === "heatmap") {
    return { districtId: district.id, schools: [], hospitals: [], roads: [], complaints: slice.complaints };
  }

  return {
    districtId: district.id,
    schools: slice.schools,
    hospitals: slice.hospitals,
    roads: slice.roads,
    complaints: slice.complaints,
  };
}

export function getHeatmapPoints(districtId = null) {
  if (!districtId) {
    return complaintsMock.map(({ lat, lng, weight, category, districtId: id }) => ({
      lat,
      lng,
      weight,
      category,
      districtId: id,
    }));
  }

  return getInfrastructureByDistrict(districtId, "complaints").complaints.map(
    ({ lat, lng, weight, category, districtId: id }) => ({
      lat,
      lng,
      weight,
      category,
      districtId: id,
    })
  );
}

