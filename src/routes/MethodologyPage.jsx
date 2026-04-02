import React from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import Breadcrumbs from "../components/socialradar/Breadcrumbs";
import MethodologySections from "../components/socialradar/MethodologySections";
import { methodologySections, roadmapSteps } from "../data/methodology.mock";
import { normalizeDisplayText } from "../utils/text";

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function MethodologyPage() {
  const workspace = useOutletContext();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "\u041e\u0431\u0437\u043e\u0440", to: "/" },
          { label: "\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f" }
        ]}
      />

      <motion.section
        className="surface surface-command p-5"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="brand-chip">{safeText("\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f")}</span>
            <span className="status-badge status-badge--slate">{safeText("\u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c")}</span>
          </div>

          <h1 className="mt-4 text-[1.75rem] font-semibold tracking-[-0.03em] text-white md:text-[2rem]">
            {safeText("\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f, \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438 \u0434\u0430\u043d\u043d\u044b\u0445 \u0438 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c \u0440\u0435\u0448\u0435\u043d\u0438\u0439")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {safeText(
              "\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u043a\u0430\u0437\u0430\u043d\u043e, \u043e\u0442\u043a\u0443\u0434\u0430 \u0431\u0435\u0440\u0443\u0442\u0441\u044f \u0434\u0430\u043d\u043d\u044b\u0435, \u043a\u0430\u043a \u0444\u043e\u0440\u043c\u0438\u0440\u0443\u0435\u0442\u0441\u044f \u043e\u0431\u044a\u044f\u0441\u043d\u0435\u043d\u0438\u0435 \u043c\u043e\u0434\u0435\u043b\u0438 \u0438 \u043f\u043e\u0447\u0435\u043c\u0443 \u0444\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u0432\u0441\u0435\u0433\u0434\u0430 \u043e\u0441\u0442\u0430\u0435\u0442\u0441\u044f \u0437\u0430 \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u043e\u043c."
            )}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="pill pill--ghost">
              {safeText("\u041f\u0435\u0440\u0438\u043e\u0434 \u0434\u0430\u043d\u043d\u044b\u0445")}: {workspace.latestYear}
            </span>
            <span className="pill pill--ghost">
              {safeText("\u0421\u0442\u0430\u0442\u0443\u0441")}: {workspace.liveRiskSnapshot.status === "ready" ? safeText("ML \u0430\u043a\u0442\u0438\u0432\u0435\u043d") : safeText("\u0444\u0440\u043e\u043d\u0442\u0435\u043d\u0434")}
            </span>
            <span className="pill pill--ghost">{safeText("AI \u0442\u043e\u043b\u044c\u043a\u043e \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u0442")}</span>
          </div>
        </div>
      </motion.section>

      <MethodologySections
        sections={methodologySections}
        roadmap={roadmapSteps}
        complianceChecks={workspace.complianceChecks}
        liveStatus={workspace.liveRiskSnapshot.status}
      />
    </>
  );
}
