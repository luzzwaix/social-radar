import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, ShieldCheck, XCircle } from "lucide-react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import Breadcrumbs from "../components/socialradar/Breadcrumbs";
import CaseHeader from "../components/socialradar/CaseHeader";
import EvidenceBoard from "../components/socialradar/EvidenceBoard";
import RecommendationPanel from "../components/socialradar/RecommendationPanel";
import DataProvenancePanel from "../components/socialradar/DataProvenancePanel";
import DistrictProfile from "../components/socialradar/DistrictProfile";
import AdvisorPanel from "../components/advisor/AdvisorPanel";
import cases from "../data/cases.mock";
import { buildDistrictHref, findDistrictBySlug } from "../utils/routeParams";
import { createDistrictSignals } from "../hooks/useSocialRadarWorkspace";
import { normalizeDisplayText } from "../utils/text";

const actions = [
  {
    id: "approve",
    label: "\u041f\u0440\u0438\u043d\u044f\u0442\u044c",
    helper: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435, \u0435\u0441\u043b\u0438 \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u044f \u043f\u0440\u0438\u043d\u044f\u0442\u0430 \u043a \u0438\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u044e"
  },
  {
    id: "escalate",
    label: "\u042d\u0441\u043a\u0430\u043b\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
    helper: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435, \u0435\u0441\u043b\u0438 \u043d\u0443\u0436\u043d\u0430 \u043a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0446\u0438\u044f \u0438\u043b\u0438 \u0434\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u0430\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430"
  },
  {
    id: "reject",
    label: "\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c",
    helper: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435, \u0435\u0441\u043b\u0438 \u0441\u0438\u0433\u043d\u0430\u043b \u043d\u0435\u0434\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u0435\u043d \u0438\u043b\u0438 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043f\u0435\u0440\u0435\u0444\u043e\u0440\u043c\u0443\u043b\u0438\u0440\u043e\u0432\u043a\u0438"
  }
];

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function CasePage() {
  const workspace = useOutletContext();
  const { caseId } = useParams();
  const [activeAction, setActiveAction] = useState("escalate");
  const [auditLog, setAuditLog] = useState([]);
  const [showWhy, setShowWhy] = useState(false);

  const caseItem = useMemo(() => cases.find((item) => item.id === caseId) ?? null, [caseId]);
  const district = useMemo(
    () => (caseItem ? findDistrictBySlug(workspace.almatyDistricts, caseItem.districtSlug) : null),
    [caseItem, workspace.almatyDistricts]
  );
  const districtSignals = useMemo(() => (district ? createDistrictSignals(district) : []), [district]);

  useEffect(() => {
    if (district?.district && district.district !== workspace.selectedDistrictName) {
      workspace.setSelectedDistrictName(district.district);
    }
  }, [district, workspace]);

  if (!caseItem) {
    return (
      <div className="route-empty">
        <p className="data-kicker">{safeText("\u041a\u0435\u0439\u0441 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d")}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {safeText(
            "\u0417\u0430\u043f\u0440\u043e\u0448\u0435\u043d\u043d\u044b\u0439 \u0444\u0430\u0439\u043b \u043a\u0435\u0439\u0441\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u0432 \u0442\u0435\u043a\u0443\u0449\u0435\u0439 \u0432\u0435\u0440\u0441\u0438\u0438 \u0444\u0440\u043e\u043d\u0442\u0435\u043d\u0434\u0430."
          )}
        </p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "\u041e\u0431\u0437\u043e\u0440", to: "/" },
          {
            label: safeText(district?.district ?? caseItem.district),
            to: buildDistrictHref(district?.district ?? caseItem.district)
          },
          { label: safeText(caseItem.title) }
        ]}
      />

      <CaseHeader caseItem={caseItem} district={district} />

      <div className="case-layout">
        <EvidenceBoard caseItem={caseItem} />

        <div className="min-w-0 space-y-4">
          <RecommendationPanel caseItem={caseItem} />

          <AdvisorPanel
            title="\u0410I-\u0441\u043e\u0432\u0435\u0442\u043d\u0438\u043a: \u043e\u0431\u044a\u044f\u0441\u043d\u0438\u043c\u043e\u0441\u0442\u044c \u043a\u0435\u0439\u0441\u0430"
            prediction={{
              label: "\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u044f",
              value: caseItem.recommendation.headline,
              confidence: caseItem.recommendation.confidence,
              summary: caseItem.recommendation.summary,
              delta: caseItem.recommendation.expectedImpact
            }}
            confidence={caseItem.recommendation.confidence}
            explanation={caseItem.explainability.factors}
            similarCases={caseItem.similarCases.map((title, index) => ({
              id: `${caseItem.id}-similar-${index + 1}`,
              title,
              summary: "\u0421\u0445\u043e\u0436\u0438\u0439 \u043f\u0430\u0442\u0442\u0435\u0440\u043d \u0441\u0438\u0433\u043d\u0430\u043b\u043e\u0432 \u0438 \u043a\u043e\u043d\u0442\u0435\u043a\u0441\u0442 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f."
            }))}
            onWhy={() => setShowWhy((value) => !value)}
            onReject={() => {
              setActiveAction("reject");
              setAuditLog((previous) => {
                const entry = {
                  id: `${Date.now()}-reject`,
                  at: new Date().toLocaleString("ru-RU"),
                  action: "\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c (AI)"
                };
                return [entry, ...previous].slice(0, 6);
              });
            }}
            onEscalate={() => {
              setActiveAction("escalate");
              setAuditLog((previous) => {
                const entry = {
                  id: `${Date.now()}-escalate`,
                  at: new Date().toLocaleString("ru-RU"),
                  action: "\u042d\u0441\u043a\u0430\u043b\u0438\u0440\u043e\u0432\u0430\u0442\u044c (AI)"
                };
                return [entry, ...previous].slice(0, 6);
              });
            }}
          />

          {showWhy ? (
            <motion.section
              className="surface p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
            >
              <div>
                <p className="data-kicker">{safeText("\u041f\u043e\u0447\u0435\u043c\u0443 AI \u0441\u0434\u0435\u043b\u0430\u043b \u0442\u0430\u043a\u043e\u0439 \u0432\u044b\u0432\u043e\u0434")}</p>
                <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
                  {safeText("\u0414\u0435\u0442\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u0444\u0430\u043a\u0442\u043e\u0440\u043e\u0432")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {safeText(
                    "\u0417\u0434\u0435\u0441\u044c \u043f\u0435\u0440\u0435\u0447\u0438\u0441\u043b\u0435\u043d\u044b \u0444\u0430\u043a\u0442\u043e\u0440\u044b, \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u044f \u0438 \u0438\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438. \u042d\u0442\u043e \u043e\u0431\u044a\u044f\u0441\u043d\u0435\u043d\u0438\u0435 \u043f\u043e\u043c\u043e\u0433\u0430\u0435\u0442 \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u0443 \u043f\u0440\u0438\u043d\u044f\u0442\u044c \u0440\u0435\u0448\u0435\u043d\u0438\u0435, \u043d\u043e \u043d\u0435 \u0437\u0430\u043c\u0435\u043d\u044f\u0435\u0442 \u0435\u0433\u043e."
                  )}
                </p>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <div className="glass-block p-3">
                  <p className="data-kicker">{safeText("\u0424\u0430\u043a\u0442\u043e\u0440\u044b")}</p>
                  <div className="mt-3 grid gap-2">
                    {caseItem.explainability.factors.map((factor, index) => (
                      <div key={factor} className="factor-row">
                        <span className="factor-row__index">{String(index + 1).padStart(2, "0")}</span>
                        <span className="text-sm leading-6 text-slate-300">{safeText(factor)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-block p-3">
                  <p className="data-kicker">{safeText("\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u044f")}</p>
                  <div className="mt-3 grid gap-2">
                    {caseItem.explainability.limitations.map((item) => (
                      <div key={item} className="provenance-note">
                        {safeText(item)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 glass-block p-3">
                <p className="data-kicker">{safeText("\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438")}</p>
                <div className="mt-3 grid gap-2">
                  {caseItem.sources.map((source) => (
                    <div key={source} className="provenance-row">
                      <span className="provenance-row__dot" />
                      <span>{safeText(source)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ) : null}

          {district ? (
            <DistrictProfile district={district} signals={districtSignals} liveStatus={workspace.liveRiskSnapshot.status} />
          ) : null}
        </div>

        <motion.aside
          className="case-action-rail surface"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
        >
          <div>
            <p className="data-kicker">{safeText("\u0420\u0435\u0448\u0435\u043d\u0438\u0435 \u0447\u0435\u043b\u043e\u0432\u0435\u043a\u0430")}</p>
            <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
              {safeText("\u041f\u0430\u043d\u0435\u043b\u044c \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {safeText(
                "\u0421\u0438\u0441\u0442\u0435\u043c\u0430 \u043d\u0435 \u043f\u0440\u0438\u043d\u0438\u043c\u0430\u0435\u0442 \u0444\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435. \u042d\u0442\u043e \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u0434\u043b\u044f \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u0430."
              )}
            </p>
          </div>

          <div className="mt-4 grid gap-3">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                className={`case-action-button ${activeAction === action.id ? "case-action-button--active" : ""}`}
                onClick={() => {
                  setActiveAction(action.id);
                  setAuditLog((previous) => {
                    const entry = {
                      id: `${Date.now()}-${action.id}`,
                      at: new Date().toLocaleString("ru-RU"),
                      action: action.label
                    };
                    return [entry, ...previous].slice(0, 6);
                  });
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-white">{safeText(action.label)}</span>
                  {action.id === "approve" ? (
                    <CheckCircle2 size={16} />
                  ) : action.id === "reject" ? (
                    <XCircle size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{safeText(action.helper)}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-[10px] border border-white/8 bg-white/[0.03] p-4">
            <p className="data-kicker">{safeText("\u0422\u0435\u043a\u0443\u0449\u0435\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435")}</p>
            <p className="mt-3 text-base font-semibold text-white">{safeText(actions.find((item) => item.id === activeAction)?.label)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {safeText(
                "\u0421\u0435\u0439\u0447\u0430\u0441 \u044d\u0442\u043e \u0434\u0435\u043c\u043e-\u043c\u0435\u0445\u0430\u043d\u0438\u043a\u0430 \u0444\u0440\u043e\u043d\u0442\u0430. \u041d\u0430 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u043c \u044d\u0442\u0430\u043f\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u043c \u0441\u0442\u0430\u0442\u0443\u0441\u044b \u043a\u0435\u0439\u0441\u0430 \u0438 \u0436\u0443\u0440\u043d\u0430\u043b \u0440\u0435\u0448\u0435\u043d\u0438\u0439 \u0447\u0435\u0440\u0435\u0437 FastAPI."
              )}
            </p>
          </div>

          <div className="mt-3 rounded-[10px] border border-white/8 bg-white/[0.03] p-4">
            <p className="data-kicker">{safeText("\u0416\u0443\u0440\u043d\u0430\u043b \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 (\u0434\u0435\u043c\u043e)")}</p>
            {auditLog.length ? (
              <div className="mt-3 grid gap-2">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="factor-row">
                    <span className="factor-row__index">{safeText(entry.action)}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{entry.at}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {safeText("\u0420\u0435\u0448\u0435\u043d\u0438\u0435 \u043e\u043f\u0435\u0440\u0430\u0442\u043e\u0440\u0430 \u0437\u0430\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043e \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e.")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {safeText("\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0432\u044b\u0448\u0435, \u0438 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0437\u0430\u043f\u0438\u0441\u044c \u0432 \u0436\u0443\u0440\u043d\u0430\u043b\u0435.")}
              </p>
            )}
          </div>

          <Link to="/methodology" className="control-button mt-4 w-full justify-center">
            <ShieldCheck size={16} />
            {safeText("\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f \u0438 \u043a\u043e\u043c\u043f\u043b\u0430\u0435\u043d\u0441")}
          </Link>
        </motion.aside>
      </div>

      <DataProvenancePanel
        title="\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438 \u0438 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u044f \u043a\u0435\u0439\u0441\u0430"
        subtitle="\u0411\u043b\u043e\u043a \u0434\u043e\u0432\u0435\u0440\u0438\u044f: \u043e\u0442\u043a\u0443\u0434\u0430 \u0441\u0438\u0433\u043d\u0430\u043b\u044b, \u043a\u0430\u043a \u0447\u0438\u0442\u0430\u0442\u044c \u043e\u0431\u044a\u044f\u0441\u043d\u0435\u043d\u0438\u0435, \u043a\u0430\u043a\u0438\u0435 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u044f \u0435\u0441\u0442\u044c \u0443 \u043f\u0440\u043e\u0442\u043e\u0442\u0438\u043f\u0430."
        sources={caseItem.sources}
        notes={[
          "\u0412 \u0442\u0435\u043a\u0443\u0449\u0435\u043c \u044d\u0442\u0430\u043f\u0435 \u043a\u0435\u0439\u0441\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442 \u0434\u0435\u043c\u043e-\u0441\u043b\u043e\u0439 \u0434\u0430\u043d\u043d\u044b\u0445 \u0438 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u044e\u0442 \u0444\u043e\u0440\u043c\u0443 \u0431\u0443\u0434\u0443\u0449\u0435\u0433\u043e \u0431\u044d\u043a\u0435\u043d\u0434\u0430.",
          "\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u043d\u0435 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u044e\u0442\u0441\u044f: \u0442\u043e\u043b\u044c\u043a\u043e \u0430\u0433\u0440\u0435\u0433\u0430\u0442\u044b \u043f\u043e \u0440\u0430\u0439\u043e\u043d\u0443/\u043f\u0435\u0440\u0438\u043e\u0434\u0443.",
          "\u041e\u0431\u044a\u044f\u0441\u043d\u0438\u043c\u043e\u0441\u0442\u044c \u0438 \u0443\u0432\u0435\u0440\u0435\u043d\u043d\u043e\u0441\u0442\u044c \u043f\u043e\u043a\u0430\u0437\u0430\u043d\u044b \u043a\u0430\u043a \u043f\u043e\u0434\u0441\u043a\u0430\u0437\u043a\u0430 \u0434\u043b\u044f \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u0430, \u0430 \u043d\u0435 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435."
        ]}
      />
    </>
  );
}
