const buildCheck = (id, label, passed, details) => ({
  id,
  label,
  passed,
  details
});

export function runDesignAgent(context = {}) {
  const hasDarkTheme = Boolean(context.hasDarkTheme);
  const hasGlass = Boolean(context.hasGlassmorphism);
  const hasMotion = Boolean(context.hasMotion);
  const hasContrast = Boolean(context.hasAccessibleContrast);
  const hasMobileReadability = Boolean(context.hasMobileReadability);

  const checks = [
    buildCheck(
      "theme",
      "Premium dark system",
      hasDarkTheme,
      hasDarkTheme
        ? "The interface follows the requested dark GovTech presentation with accent gradients."
        : "The visual system should align with the agreed dark look and gradient emphasis."
    ),
    buildCheck(
      "glassmorphism",
      "Glass cards and surfaces",
      hasGlass,
      hasGlass
        ? "Glass panels and elevated cards create a focused enterprise dashboard feel."
        : "Key surfaces still need a stronger card treatment and visual hierarchy."
    ),
    buildCheck(
      "motion",
      "Meaningful motion",
      hasMotion,
      hasMotion
        ? "Micro-interactions and transitions support comprehension without distracting the user."
        : "Add purposeful motion to loading, selection, and score feedback states."
    ),
    buildCheck(
      "contrast",
      "Accessibility contrast",
      hasContrast,
      hasContrast
        ? "Foreground and interactive states maintain readable contrast for office environments."
        : "Revisit muted text and action states to keep contrast safe."
    ),
    buildCheck(
      "mobile",
      "Mobile readability",
      hasMobileReadability,
      hasMobileReadability
        ? "Key information stays usable on smaller screens for demo portability."
        : "Refine vertical stacking and touch targets for mobile demos."
    )
  ];

  return {
    agent: "DESIGN AGENT",
    passed: checks.every((check) => check.passed),
    summary: checks.every((check) => check.passed)
      ? "The experience matches the requested premium dashboard direction and remains accessible."
      : "The design system needs another pass in motion, hierarchy, or responsive polish.",
    checks
  };
}

export default runDesignAgent;
