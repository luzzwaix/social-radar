import React from "react";
import { motion } from "framer-motion";
import { Database } from "lucide-react";
import { normalizeDisplayText } from "../../utils/text";

function safeText(value) {
  return normalizeDisplayText(value);
}

export default function DataProvenancePanel({
  title = "\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438 \u0438 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u044f",
  subtitle,
  sources = [],
  notes = []
}) {
  return (
    <motion.section
      className="surface p-4"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="data-kicker">{safeText("\u0422\u0440\u0430\u0441\u0441\u0438\u0440\u0443\u0435\u043c\u043e\u0441\u0442\u044c")}</p>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-white">{safeText(title)}</h2>
          {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-400">{safeText(subtitle)}</p> : null}
        </div>
        <Database size={16} className="text-slate-500" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="glass-block p-3">
          <p className="data-kicker">{safeText("\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a\u0438")}</p>
          <div className="mt-3 grid gap-2">
            {sources.map((source, index) => (
              <div key={`${index}-${String(source)}`} className="provenance-row">
                <span className="provenance-row__dot" />
                <span>{safeText(source)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-block p-3">
          <p className="data-kicker">{safeText("\u041f\u0440\u0438\u043c\u0435\u0447\u0430\u043d\u0438\u044f")}</p>
          <div className="mt-3 grid gap-2">
            {notes.map((note, index) => (
              <div key={`${index}-${String(note)}`} className="provenance-note">
                {safeText(note)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
