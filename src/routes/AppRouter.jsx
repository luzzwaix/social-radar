import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import OverviewPage from "./OverviewPage";
import DistrictPage from "./DistrictPage";
import CasePage from "./CasePage";
import MethodologyPage from "./MethodologyPage";

export default function AppRouter({ workspace }) {
  return (
    <Routes>
      <Route element={<AppShell workspace={workspace} />}>
        <Route index element={<OverviewPage />} />
        <Route path="district/:districtSlug" element={<DistrictPage />} />
        <Route path="case/:caseId" element={<CasePage />} />
        <Route path="methodology" element={<MethodologyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
