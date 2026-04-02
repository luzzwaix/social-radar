import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BrainCircuit, ShieldCheck } from "lucide-react";
import PredictionCard from "./PredictionCard";
import SimilarCasesList from "./SimilarCasesList";
import { normalizeDisplayText } from "../../utils/text";

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function AdvisorPanel({
  title = "\u0410I-\u0441\u043e\u0432\u0435\u0442\u043d\u0438\u043a: \u043e\u0431\u044a\u044f\u0441\u043d\u0438\u043c\u043e\u0441\u0442\u044c \u043a\u0435\u0439\u0441\u0430",
  prediction,
  confidence = 0,
  explanation = [],
  similarCases = [],
  onWhy,
  onReject,
  onEscalate
}) {
  const safeTitle = useMemo(() => safeText(title), [title]);
  const factorList = useMemo(() => explanation.map((item) => safeText(item)), [explanation]);
  const normalizedCases = useMemo(
    () =>
      similarCases.map((item, index) =>
        typeof item === "string"
          ? {
              id: `similar-${index + 1}`,
              title: safeText(item),
              summary: safeText(
                "\u0421\u0445\u043e\u0436\u0438\u0439 \u043f\u0430\u0442\u0442\u0435\u0440\u043d \u0441\u0438\u0433\u043d\u0430\u043b\u043e\u0432 \u0438 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0447\u0435\u0441\u043a\u0438\u0439 \u043a\u043e\u043d\u0442\u0435\u043a\u0441\u0442."
              ),
              similarity: 78 - index * 6,
              source: "\u0430\u0440\u0445\u0438\u0432",
              result: "\u0434\u0435\u043c\u043e"
            }
          : {
              ...item,
              title: safeText(item.title),
              summary: safeText(item.summary),
              source: safeText(item.source),
              result: safeText(item.result)
            }
      ),
    [similarCases]
  );

  return (
    <motion.section
      className="surface p-4 md:p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="data-kicker">{safeText("\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043c\u043e\u0434\u0443\u043b\u044c")}</p>
          <h2
            className="mt-2 text-white"
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              overflowWrap: "anywhere"
            }}
          >
            {safeTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400" style={{ overflowWrap: "anywhere" }}>
            {safeText(
              "\u0410I \u0441\u043e\u043f\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u0441\u0438\u0433\u043d\u0430\u043b\u044b \u0440\u0430\u0439\u043e\u043d\u0430 \u0438 \u0444\u043e\u0440\u043c\u0438\u0440\u0443\u0435\u0442 \u043f\u043e\u044f\u0441\u043d\u0435\u043d\u0438\u0435. \u0424\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u0442 \u044d\u043a\u0441\u043f\u0435\u0440\u0442."
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="pill pill--info">
            <BrainCircuit size={13} />
            {safeText("\u041e\u0431\u044a\u044f\u0441\u043d\u0438\u043c\u043e\u0441\u0442\u044c")}
          </span>
          <span className="pill pill--warning">
            <AlertTriangle size={13} />
            {safeText("\u041a\u043e\u043d\u0442\u0440\u043e\u043b\u044c \u0447\u0435\u043b\u043e\u0432\u0435\u043a\u0430")}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        <div className="min-w-0">
          <PredictionCard
            label={prediction?.label}
            value={prediction?.value}
            confidence={prediction?.confidence ?? confidence}
            explanation={prediction?.summary}
            delta={prediction?.delta}
          />
        </div>

        <div className="min-w-0 rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="data-kicker">{safeText("\u0420\u0443\u0447\u043d\u0430\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430")}</p>
              <h3 className="mt-2 text-lg font-semibold text-white" style={{ overflowWrap: "anywhere" }}>
                {safeText("\u0424\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u0437\u0430 \u0447\u0435\u043b\u043e\u0432\u0435\u043a\u043e\u043c.")}
              </h3>
            </div>
            <span className="pill pill--success">
              <ShieldCheck size={13} />
              {safeText("\u0447\u0435\u043b\u043e\u0432\u0435\u043a \u0432 \u043a\u043e\u043d\u0442\u0443\u0440\u0435")}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400" style={{ overflowWrap: "anywhere" }}>
            {safeText(
              "\u042d\u0441\u043a\u0430\u043b\u0438\u0440\u0443\u0439\u0442\u0435 \u0438\u043b\u0438 \u043e\u0442\u043a\u043b\u043e\u043d\u044f\u0439\u0442\u0435. \u0421\u043b\u0435\u0434 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u043e\u0441\u0442\u0430\u0435\u0442\u0441\u044f \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u044b\u043c."
            )}
          </p>

          <div className="mt-4 grid gap-2">
            <button type="button" className="control-button w-full justify-center" onClick={onEscalate}>
              {safeText("\u042d\u0441\u043a\u0430\u043b\u0438\u0440\u043e\u0432\u0430\u0442\u044c")}
            </button>
            <button type="button" className="control-button w-full justify-center" onClick={onReject}>
              {safeText("\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c")}
            </button>
            <button type="button" className="control-button w-full justify-center" onClick={onWhy}>
              {safeText("\u041f\u043e\u0447\u0435\u043c\u0443 AI \u0442\u0430\u043a \u0440\u0435\u0448\u0438\u043b?")}
            </button>
          </div>

          <div className="mt-4 rounded-[16px] border border-white/8 bg-[#0c1118] p-3">
            <p className="data-kicker">{safeText("\u0423\u0432\u0435\u0440\u0435\u043d\u043d\u043e\u0441\u0442\u044c")}</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">{safeText("\u0422\u0435\u043a\u0443\u0449\u0430\u044f \u043e\u0446\u0435\u043d\u043a\u0430")}</span>
              <span className="font-mono text-xl text-white">{Math.round(confidence)}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-300"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, confidence))}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
          <p className="data-kicker">{safeText("\u041f\u043e\u0447\u0435\u043c\u0443 \u0442\u0430\u043a\u043e\u0439 \u0432\u044b\u0432\u043e\u0434")}</p>
          <div className="mt-3 grid gap-2">
            {factorList.map((factor, index) => (
              <div key={`${factor}-${index}`} className="provenance-note" style={{ overflowWrap: "anywhere" }}>
                {factor}
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <SimilarCasesList cases={normalizedCases} />
        </div>
      </div>
    </motion.section>
  );
}
