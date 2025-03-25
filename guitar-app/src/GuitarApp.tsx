import { useEffect, useState } from "react";
import TitleView from "./components/Title/TitleView";
import ControlsView from "./components/Controls/ControlsView";
import NeckView from "./components/Neck/NeckView";
import { preloadSounds } from "./utils/audioPlayer";
import { assignKeysToFrets } from "./utils/assignKeys";
import { LOADING_TIME } from "./constants";
import { guitarNotes } from "./data/guitarNotes";
import { Notes } from "./types";

export default function GuitarApp() {
  // Nombre del instrumento
  const [instrument, setInstrument] = useState<string>("cleanSolo");

  // Mastil de notas
  const [neck, setNeck] = useState<Notes>([]);

  // Carga inicial
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    // Si initialNeck esta definido, cambia el estado de loading a false
    if (neck) {
      setLoading(false);
      console.log("Carga de la data inicial completada.");
    }
  };

  useEffect(() => {
    // Precarga los sonidos
    preloadSounds(instrument);

    const timeoutData = setTimeout(() => {
      loadData();
    }, LOADING_TIME);

    return () => clearTimeout(timeoutData);
  }, []);

  useEffect(() => {
    const updatedNeck = assignKeysToFrets(
      guitarNotes,
      0,
      1,
      2,
      3,
      4,
      5,
      0,
      false,
      false
    );
    setNeck(updatedNeck);

    console.log("Se cambio de instrumento a " + instrument);
  }, [instrument]);

  return loading ? (
    <h2>Cargando</h2>
  ) : (
    <div>
      <TitleView instrument={instrument} />
      <NeckView neck={neck} instrument={instrument} />
      <ControlsView setInstrument={setInstrument} />
    </div>
  );
}
