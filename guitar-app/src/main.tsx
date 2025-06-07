import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GuitarProvider } from "./context/GuitarProvider.tsx";
import Router from "./routes/Router.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GuitarProvider>
      <Router />
    </GuitarProvider>
  </StrictMode>
);
