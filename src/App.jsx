import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { useSocialRadarWorkspace } from "./hooks/useSocialRadarWorkspace";

export default function App() {
  const workspace = useSocialRadarWorkspace();

  return (
    <BrowserRouter>
      <AppRouter workspace={workspace} />
    </BrowserRouter>
  );
}
