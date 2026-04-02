import React from "react";
import { motion } from "framer-motion";

export default function MethodologySections({ sections, roadmap, complianceChecks, liveStatus = "loading" }) {
  const case3Checklist = [
    {
      id: "loop",
      label: "Человек в контуре (HITL)",
      tone: "emerald",
      detail: "AI \u0441\u043e\u0432\u0435\u0442\u0443\u0435\u0442, \u043d\u043e \u0444\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u0437\u0430 \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u043e\u043c (\u043a\u043d\u043e\u043f\u043a\u0438 \u0438 \u0444\u0438\u043a\u0441\u0430\u0446\u0438\u044f \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439)."
    },
    {
      id: "explain",
      label: "Объяснимость",
      tone: liveStatus === "ready" ? "emerald" : "amber",
      detail:
        liveStatus === "ready"
          ? "\u0412 UI \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044f \u0441\u043d\u044d\u043f\u0448\u043e\u0442 \u0440\u0438\u0441\u043a\u0430 \u0438 \u0442\u043e\u043f-\u0444\u0430\u043a\u0442\u043e\u0440\u044b; \u0441\u043b\u043e\u0439 SHAP/\u043f\u0440\u0430\u0432\u0438\u043b\u0430 \u0433\u043e\u0442\u043e\u0432 \u043a \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044e."
          : "\u041a\u0430\u0440\u043a\u0430\u0441 \u043e\u0431\u044a\u044f\u0441\u043d\u0435\u043d\u0438\u044f \u0433\u043e\u0442\u043e\u0432 (\u043a\u0435\u0439\u0441, \u0434\u043e\u0441\u044c\u0435, \u043c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f) \u0438 \u0431\u0443\u0434\u0435\u0442 \u043d\u0430\u043f\u043e\u043b\u043d\u0435\u043d \u043f\u043e\u0441\u043b\u0435 \u0432\u044b\u043a\u0430\u0442\u0430 \u043c\u043e\u0434\u0435\u043b\u0438."
    },
    {
      id: "open",
      label: "Открытые данные",
      tone: "emerald",
      detail: "\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438 \u0438 \u043f\u0440\u043e\u0438\u0441\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0445 \u043e\u0431\u043e\u0437\u043d\u0430\u0447\u0435\u043d\u044b; \u0434\u0430\u043d\u043d\u044b\u0435 \u0430\u0433\u0440\u0435\u0433\u0438\u0440\u043e\u0432\u0430\u043d\u044b \u043f\u043e \u0440\u0430\u0439\u043e\u043d\u0443/\u043f\u0435\u0440\u0438\u043e\u0434\u0443."
    },
    {
      id: "privacy",
      label: "Без персональных данных",
      tone: "emerald",
      detail: "\u0421\u0438\u0441\u0442\u0435\u043c\u0430 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0430\u0433\u0440\u0435\u0433\u0430\u0442\u044b, \u0431\u0435\u0437 \u041f\u0414\u043d \u0438 \u0438\u0434\u0435\u043d\u0442\u0438\u0444\u0438\u043a\u0430\u0442\u043e\u0440\u043e\u0432."
    },
    {
      id: "audit",
      label: "Журнал решений",
      tone: "amber",
      detail: "\u0412 UI \u0435\u0441\u0442\u044c \u0442\u043e\u0447\u043a\u0430 \u0440\u0435\u0448\u0435\u043d\u0438\u044f; \u043d\u0430 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0435\u043c \u044d\u0442\u0430\u043f\u0435 \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u043c \u0435\u0435 \u0432 FastAPI."
    }
  ];

  return (
    <div className="space-y-4">
      <motion.section
        className="surface p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.02 }}
      >
        <p className="data-kicker">Decentrathon: кейс №3</p>
        <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">Чек-лист требований</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Этот блок нужен, чтобы жюри сразу увидело: мы не делаем black-box и не заменяем эксперта.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {case3Checklist.map((item, index) => (
            <motion.div
              key={item.id}
              className="glass-block surface-hover-subtle p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.04 + index * 0.03 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="data-kicker">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                </div>
                <span className={`status-badge status-badge--${item.tone}`}>{item.tone}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="methodology-grid">
        {sections.map((section, index) => (
          <motion.section
            key={section.id}
            className="surface p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.04 }}
          >
            <p className="data-kicker">{section.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{section.description}</p>
            <div className="mt-4 grid gap-2">
              {section.bullets.map((bullet) => (
                <div key={bullet} className="provenance-note">
                  {bullet}
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <motion.section
          className="surface p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.08 }}
        >
          <p className="data-kicker">План работ</p>
          <div className="mt-4 grid gap-3">
            {roadmap.map((step, index) => (
              <div key={step.id} className="factor-row">
                <span className="factor-row__index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-sm font-medium text-white">{step.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="surface p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.12 }}
        >
          <p className="data-kicker">Снэпшот комплаенса</p>
          <div className="mt-4 grid gap-3">
            {complianceChecks.map((item) => (
              <div key={item.id} className="glass-block p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="data-kicker">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  </div>
                  <span className={`status-badge status-badge--${item.tone}`}>{item.tone}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
