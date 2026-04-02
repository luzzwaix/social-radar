import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "./SideNav";
import TopCommandBar from "./TopCommandBar";

function getRouteKind(pathname) {
  if (pathname.startsWith("/district/")) {
    return "district";
  }

  if (pathname.startsWith("/case/")) {
    return "case";
  }

  if (pathname.startsWith("/methodology")) {
    return "methodology";
  }

  return "overview";
}

export default function AppShell({ workspace }) {
  const location = useLocation();
  const routeKind = useMemo(() => getRouteKind(location.pathname), [location.pathname]);

  return (
    <div className={`radar-page radar-page--${routeKind} min-h-screen text-slate-100`}>
      <div className="radar-page__mesh" />
      <div className="radar-page__glow radar-page__glow--left" />
      <div className="radar-page__glow radar-page__glow--right" />
      <div className="radar-page__scanline" />

      <div className="app-shell__frame">
        <div className="app-shell__grid">
          <SideNav workspace={workspace} />

          <div className="app-shell__content">
            <TopCommandBar routeKind={routeKind} workspace={workspace} />

            <motion.main
              key={location.pathname}
              className="page-stack"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
            >
              <Outlet context={workspace} />
            </motion.main>
          </div>
        </div>
      </div>
    </div>
  );
}

