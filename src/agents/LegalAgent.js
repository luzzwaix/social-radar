const APPROVED_DATA_SOURCES = [
  "data.egov.kz",
  "open.egov.kz",
  "adilet.zan.kz",
  "stat.gov.kz",
  "gov.kz"
];

const buildCheck = (id, label, passed, details) => ({
  id,
  label,
  passed,
  details
});

export function runLegalAgent(context = {}) {
  const advice = context.advice ?? {};
  const sources = context.dataSources ?? [];
  const hasExplanation =
    Boolean(advice.explanation) &&
    Array.isArray(advice.factors) &&
    advice.factors.length > 0;
  const hasHumanReview = Boolean(context.hasEscalateAction && context.hasRejectAction);
  const usesOpenSources =
    sources.length > 0 &&
    sources.every((source) =>
      APPROVED_DATA_SOURCES.some((approved) => source.toLowerCase().includes(approved))
    );
  const avoidsPersonalData = context.usesPersonalData !== true;
  const alignsWithHackathon =
    hasExplanation && hasHumanReview && usesOpenSources && avoidsPersonalData;

  const checks = [
    buildCheck(
      "human-in-loop",
      "Human-in-the-loop",
      hasHumanReview,
      hasHumanReview
        ? "AI only recommends and the operator can escalate, reject, or apply with oversight."
        : "Add visible expert review controls before final action."
    ),
    buildCheck(
      "explainability",
      "Explainability",
      hasExplanation,
      hasExplanation
        ? "Advice includes explanation text and factor-level reasoning."
        : "Each prediction must explain why the AI reached the recommendation."
    ),
    buildCheck(
      "open-data",
      "Open data sources",
      usesOpenSources,
      usesOpenSources
        ? "Configured data references point to public Kazakhstan government sources."
        : "Reference and document official open data sources such as data.egov.kz or adilet.zan.kz."
    ),
    buildCheck(
      "privacy",
      "Personal data protection",
      avoidsPersonalData,
      avoidsPersonalData
        ? "The prototype is scoped to aggregate municipal indicators and open data."
        : "Avoid personal or sensitive data unless a lawful basis and safeguards are defined."
    )
  ];

  return {
    agent: "LEGAL AGENT",
    passed: alignsWithHackathon,
    summary: alignsWithHackathon
      ? "Complies with case constraints: explainable recommendations, expert override, and public data positioning."
      : "Compliance gaps remain in explainability, review workflow, or source transparency.",
    checks
  };
}

export default runLegalAgent;
