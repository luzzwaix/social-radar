import { request } from "./client.js";
import { districtsMock } from "../data/districts.mock.js";
import { clamp } from "../utils/validators.js";

function makeLeaderboardRows() {
  return districtsMock
    .map((district, index) => {
      const score = Math.round(
        1000 - district.riskIndex * 220 + (district.schoolsCount + district.hospitalsCount) * 4 + (district.budgetKzt / 1000000000) * 6 - index * 12
      );

      return {
        district_id: district.id,
        district_name: district.nameRu,
        score,
        level: score >= 930 ? "Gold" : score >= 820 ? "Silver" : score >= 700 ? "Bronze" : "Starter",
        trend: score > 900 ? "rising" : score > 800 ? "stable" : "watch",
        achievements: Math.max(1, Math.round(clamp((100 - district.riskIndex * 100) / 20, 1, 5))),
        last_decision: district.priority,
      };
    })
    .sort((left, right) => right.score - left.score)
    .map((row, index) => ({
      ...row,
      rank: index + 1,
    }));
}

export async function getLeaderboard() {
  return request("/api/v1/leaderboard", {
    mockFactory: async () => ({
      leaderboard: makeLeaderboardRows(),
      meta: {
        count: districtsMock.length,
        source: "mock",
      },
    }),
  });
}

