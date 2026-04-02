import React, { useMemo } from "react";
import { Activity, FileSearch, LayoutDashboard, MapPinned, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import cases from "../../data/cases.mock";
import { buildCaseHref, buildDistrictHref } from "../../utils/routeParams";
import { normalizeDisplayText } from "../../utils/text";

function safeText(value) {
  return normalizeDisplayText(value);
}

const navIcons = {
  overview: LayoutDashboard,
  district: MapPinned,
  case: FileSearch,
  methodology: ShieldCheck
};

export default function SideNav({ workspace }) {
  const hasDistrict = Boolean(workspace.selectedDistrict?.district);
  const currentDistrictCase = useMemo(
    () => cases.find((caseItem) => caseItem.district === workspace.selectedDistrict?.district) ?? cases[0],
    [workspace.selectedDistrict]
  );

  const items = [
    {
      id: "overview",
      label: "\u041e\u0431\u0437\u043e\u0440",
      to: "/"
    },
    {
      id: "district",
      label: "\u0414\u043e\u0441\u044c\u0435 \u0440\u0430\u0439\u043e\u043d\u0430",
      to: hasDistrict ? buildDistrictHref(workspace.selectedDistrict.district) : "/"
    },
    {
      id: "case",
      label: "\u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0439 \u043a\u0435\u0439\u0441",
      to: buildCaseHref(currentDistrictCase?.id ?? cases[0].id)
    },
    {
      id: "methodology",
      label: "\u041c\u0435\u0442\u043e\u0434\u043e\u043b\u043e\u0433\u0438\u044f",
      to: "/methodology"
    }
  ];

  return (
    <aside className="side-nav surface">
      <div className="side-nav__brand">
        <span className="brand-chip">SocialRadar</span>
        <div className="side-nav__brand-copy">
          <h2>{safeText("\u041e\u043f\u0435\u0440\u0430\u0442\u0438\u0432\u043d\u0430\u044f \u043a\u043e\u043d\u0441\u043e\u043b\u044c")}</h2>
          <p>{safeText("\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u043f\u043e \u0440\u0430\u0439\u043e\u043d\u0430\u043c, \u043a\u0435\u0439\u0441\u0430\u043c \u0438 \u0440\u0438\u0441\u043a-\u0441\u0438\u0433\u043d\u0430\u043b\u0430\u043c.")}</p>
        </div>
      </div>

      <nav className="side-nav__links">
        {items.map((item) => {
          const Icon = navIcons[item.id];

          return (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.id === "overview"}
              className={({ isActive }) => `side-nav__link ${isActive ? "side-nav__link--active" : ""}`}
            >
              <Icon size={16} />
              <span>{safeText(item.label)}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="side-nav__status">
        <div className="side-nav__status-row">
          <span className="data-kicker">{safeText("\u041b\u0435\u043d\u0442\u0430")}</span>
          <span className={`status-badge status-badge--${workspace.liveRiskSnapshot.status === "ready" ? "emerald" : "slate"}`}>
            {workspace.liveRiskSnapshot.status === "ready"
              ? safeText("\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u043e")
              : safeText("\u043b\u043e\u043a\u0430\u043b\u044c\u043d\u043e")}
          </span>
        </div>
        <div className="side-nav__status-row">
          <span className="text-sm text-slate-400">{safeText("\u0421\u043d\u044d\u043f\u0448\u043e\u0442")}</span>
          <span className="font-mono text-sm text-white">{workspace.latestYear}</span>
        </div>
        <div className="side-nav__status-row">
          <span className="text-sm text-slate-400">{safeText("\u0422\u0435\u043a\u0443\u0449\u0438\u0439 \u0440\u0430\u0439\u043e\u043d")}</span>
          <span className="font-mono text-sm text-white">{safeText(workspace.selectedDistrict?.district)}</span>
        </div>
        <div className="side-nav__status-row">
          <span className="text-sm text-slate-400">{safeText("\u0420\u0435\u0436\u0438\u043c")}</span>
          <span className="inline-flex items-center gap-2 font-mono text-sm text-cyan-100">
            <Activity size={14} />
            {workspace.liveRiskSnapshot.status === "ready"
              ? safeText("ML \u0430\u043a\u0442\u0438\u0432\u0435\u043d")
              : safeText("\u0444\u0440\u043e\u043d\u0442\u0435\u043d\u0434")}
          </span>
        </div>
      </div>
    </aside>
  );
}
