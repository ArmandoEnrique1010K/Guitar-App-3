import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GuitarApp from "./GuitarApp.tsx";
import { GuitarProvider } from "./context/GuitarProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GuitarProvider>
      <GuitarApp />
    </GuitarProvider>
  </StrictMode>
);
