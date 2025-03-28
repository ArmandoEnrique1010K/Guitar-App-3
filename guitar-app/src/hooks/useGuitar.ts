import { useContext } from "react";
import { GuitarContext } from "../context/GuitarContext";

// Hook personalizado para usar el contexto
export const useGuitar = () => {
  const context = useContext(GuitarContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de un AppProvider");
  }
  return context;
};
