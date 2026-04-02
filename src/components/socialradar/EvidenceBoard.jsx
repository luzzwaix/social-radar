import React from "react";
import { motion } from "framer-motion";
import { normalizeDisplayText } from "../../utils/text";

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function EvidenceBoard({ caseItem }) {
  return (
    <motion.section
      className="surface p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div>
        <p className="data-kicker">{safeText("\u0414\u043e\u0441\u043a\u0430 \u0441\u0438\u0433\u043d\u0430\u043b\u043e\u0432")}</p>
        <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">
          {safeText("\u041f\u043e\u0447\u0435\u043c\u0443 \u043a\u0435\u0439\u0441 \u043f\u043e\u0434\u0441\u0432\u0435\u0447\u0435\u043d \u0441\u0435\u0439\u0447\u0430\u0441")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {safeText(
            "\u042d\u0442\u043e\u0442 \u044d\u043a\u0440\u0430\u043d \u043d\u0430\u043c\u0435\u0440\u0435\u043d\u043d\u043e \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d \u043a\u0430\u043a \u0444\u0430\u0439\u043b \u0434\u043b\u044f \u043e\u043f\u0435\u0440\u0430\u0442\u043e\u0440\u0430, \u0430 \u043d\u0435 \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u0441\u043b\u043e\u0439 \u043f\u0440\u0438\u043d\u044f\u0442\u0438\u044f \u0440\u0435\u0448\u0435\u043d\u0438\u0439."
          )}
        </p>
      </div>

      <div className="evidence-grid mt-4">
        {caseItem.evidence.map((item, index) => (
          <motion.article
            key={item.label}
            className="glass-block p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: index * 0.04 }}
          >
            <p className="data-kicker">{safeText(item.label)}</p>
            <p className="mt-3 font-mono text-[1.75rem] leading-none tracking-[-0.04em] text-white">{safeText(item.value)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{safeText(item.note)}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-4 rounded-[10px] border border-white/8 bg-[#09121b] p-4">
        <p className="data-kicker">{safeText("\u041b\u043e\u0433\u0438\u043a\u0430 \u0441\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u043d\u0438\u044f")}</p>
        <div className="mt-4 grid gap-3">
          {caseItem.explainability.factors.map((factor, index) => (
            <motion.div
              key={factor}
              className="factor-row"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.08 + index * 0.04 }}
            >
              <span className="factor-row__index">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-sm leading-6 text-slate-300">{safeText(factor)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
