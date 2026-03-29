const buildCheck = (id, label, passed, details) => ({
  id,
  label,
  passed,
  details
});

export function runTechnicalAgent(context = {}) {
  const hasStateManagement = Boolean(context.hasStateManagement);
  const hasApiClient = Boolean(context.hasApiClient);
  const hasResponsiveLayout = Boolean(context.hasResponsiveLayout);
  const hasErrorHandling = Boolean(context.hasErrorHandling);
  const hasMapLayer = Boolean(context.hasMapLayer);
  const hasPerformancePlan = Boolean(context.hasPerformancePlan);

  const checks = [
    buildCheck(
      "state-management",
      "State management",
      hasStateManagement,
      hasStateManagement
        ? "Simulation state is centralized and replayable."
        : "Use a shared store so game state, advice, and timeline stay consistent."
    ),
    buildCheck(
      "api-client",
      "API resilience",
      hasApiClient && hasErrorHandling,
      hasApiClient && hasErrorHandling
        ? "The app has a timeout-aware API layer with graceful fallback to mocks."
        : "Add client-side timeout handling and fallback behavior for backend outages."
    ),
    buildCheck(
      "responsive",
      "Responsive layout",
      hasResponsiveLayout,
      hasResponsiveLayout
        ? "The layout is mobile-ready and keeps dashboard/map interaction intact."
        : "Tighten responsive behavior for mobile judges and tablet demos."
    ),
    buildCheck(
      "map",
      "Interactive map",
      hasMapLayer,
      hasMapLayer
        ? "Map layer supports district selection and infrastructure overlays."
        : "The prototype needs a working district map to match the chosen concept."
    ),
    buildCheck(
      "performance",
      "Performance guardrails",
      hasPerformancePlan,
      hasPerformancePlan
        ? "Heavy visuals use lightweight rendering and memoized data transforms where needed."
        : "Review render hotspots around charts, map layers, and hover interactions."
    )
  ];

  return {
    agent: "TECHNICAL AGENT",
    passed: checks.every((check) => check.passed),
    summary: checks.every((check) => check.passed)
      ? "Architecture is scalable enough for a hackathon MVP and ready for FastAPI integration."
      : "Some technical guardrails still need attention before the build is competition-ready.",
    checks
  };
}

export default runTechnicalAgent;
