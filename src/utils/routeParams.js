const DISTRICT_SLUG_MAP = {
  "\u0430\u043b\u0430\u0442\u0430\u0443\u0441\u043a\u0438\u0439": "alatausky",
  "\u0430\u043b\u043c\u0430\u043b\u0438\u043d\u0441\u043a\u0438\u0439": "almalinsky",
  "\u0431\u043e\u0441\u0442\u0430\u043d\u0434\u044b\u043a\u0441\u043a\u0438\u0439": "bostandyksky",
  "\u0436\u0435\u0442\u044b\u0441\u0443\u0441\u043a\u0438\u0439": "zhetysusky",
  "\u0430\u0443\u044d\u0437\u043e\u0432\u0441\u043a\u0438\u0439": "auezovsky",
  "\u043c\u0435\u0434\u0435\u0443\u0441\u043a\u0438\u0439": "medeusky",
  "\u0442\u0443\u0440\u043a\u0441\u0438\u0431\u0441\u043a\u0438\u0439": "turksibsky",
  "\u043d\u0430\u0443\u0440\u044b\u0437\u0431\u0430\u0439\u0441\u043a\u0438\u0439": "nauryzbaysky"
};

function normalizeDistrictName(value = "") {
  return String(value)
    .trim()
    .replace(/\s+\u0440\u0430\u0439\u043e\u043d$/iu, "")
    .toLowerCase();
}

export function slugifyDistrictName(value = "") {
  const normalized = normalizeDistrictName(value);

  if (DISTRICT_SLUG_MAP[normalized]) {
    return DISTRICT_SLUG_MAP[normalized];
  }

  return normalized
    .replace(/[^a-z0-9\u0400-\u04ff\s-]/giu, "")
    .replace(/\s+/g, "-");
}

export function findDistrictBySlug(districts = [], slug = "") {
  return districts.find((district) => slugifyDistrictName(district.district) === slug) ?? null;
}

export function buildDistrictHref(districtName = "") {
  return `/district/${slugifyDistrictName(districtName)}`;
}

export function buildCaseHref(caseId = "") {
  return `/case/${caseId}`;
}
