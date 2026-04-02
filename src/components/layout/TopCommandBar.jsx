import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { normalizeDisplayText } from "../../utils/text";

function safeText(value) {
  return normalizeDisplayText(value);
}

const routeCopy = {
  overview: {
    title: "\u041e\u0431\u0437\u043e\u0440",
    detail: "\u0428\u0442\u0430\u0431\u043d\u043e\u0439 \u044d\u043a\u0440\u0430\u043d"
  },
  district: {
    title: "\u0414\u043e\u0441\u044c\u0435 \u0440\u0430\u0439\u043e\u043d\u0430",
    detail: "\u041f\u0440\u043e\u0444\u0438\u043b\u044c \u0438 \u0441\u0438\u0433\u043d\u0430\u043b\u044b"
  },
  case: {
    title: "\u041a\u0435\u0439\u0441",
    detail: "\u041e\u0431\u044a\u044f\u0441\u043d\u0435\u043d\u0438\u0435 \u0438 \u0440\u0435\u0448\u0435\u043d\u0438\u0435"
  },
  methodology: {
    title: "\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f",
    detail: "\u0414\u043e\u0432\u0435\u0440\u0438\u0435 \u0438 \u043a\u043e\u043c\u043f\u043b\u0430\u0435\u043d\u0441"
  }
};

export default function TopCommandBar({ routeKind, workspace }) {
  const routeMeta = routeCopy[routeKind] ?? routeCopy.overview;
  const navigate = useNavigate();

  return (
    <header className="top-command-bar surface">
      <div className="top-command-bar__section">
        <p className="data-kicker">{safeText("\u0420\u0430\u0437\u0434\u0435\u043b")}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold tracking-[-0.04em] text-white">{safeText(routeMeta.title)}</h1>
          <span className="status-badge status-badge--slate">{safeText(routeMeta.detail)}</span>
          <button
            type="button"
            className="top-command-bar__back"
            onClick={() => navigate(-1)}
            title={safeText("\u041d\u0430\u0437\u0430\u0434")}
          >
            <ArrowLeft size={14} />
            <span>{safeText("\u041d\u0430\u0437\u0430\u0434")}</span>
          </button>
        </div>
      </div>

      <div className="top-command-bar__meta">
        <span className="pill pill--ghost">{safeText("\u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435")}</span>
        <span className="pill pill--ghost">{safeText("\u0411\u0435\u0437 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445")}</span>
        <span className={`pill ${workspace.liveRiskSnapshot.status === "ready" ? "pill--active" : "pill--ghost"}`}>
          {workspace.liveRiskSnapshot.status === "ready" ? safeText("ML \u0430\u043a\u0442\u0438\u0432\u0435\u043d") : safeText("\u0424\u0440\u043e\u043d\u0442\u0435\u043d\u0434")}
        </span>
      </div>

      <div className="top-command-bar__actions">
        <div className="top-command-bar__snapshot">
          <p className="data-kicker">{safeText("\u0421\u043d\u044d\u043f\u0448\u043e\u0442")}</p>
          <p className="mt-2 font-mono text-sm text-white">{workspace.latestYear}</p>
        </div>
        <Link to="/methodology" className="control-button">
          <ShieldCheck size={16} />
          {safeText("\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f")}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </header>
  );
}
