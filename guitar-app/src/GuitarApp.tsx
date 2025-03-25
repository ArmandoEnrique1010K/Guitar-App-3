import { useEffect, useState } from "react";
import TitleView from "./components/Title/TitleView";
import ControlsView from "./components/Controls/ControlsView";
import NeckView from "./components/Neck/NeckView";
import { preloadSounds } from "./utils/audioPlayer";
import { FIRST, LOADING_TIME } from "./constants";
import { guitarNotes } from "./data/guitarNotes";
import { Neck } from "./types";
import { assignKeysToFrets } from "./utils/assignKeysToFrets";

export default function GuitarApp() {
  // Nombre del instrumento
  const [instrument, setInstrument] = useState<string>("cleanSolo");

  // Mastil de notas
  const [neck, setNeck] = useState<Neck>([]);

  // Carga inicial
  const [loading, setLoading] = useState(true);

  // Tipo de filas de teclado
  const [keysRowType, setKeysRowType] = useState<number[]>(FIRST);

  // Ganancia de volumen
  const [gain, setGain] = useState<number>(1);

  // Acorde inicial
  const [initialChord, setInitialChord] = useState<number>(0);

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
      keysRowType[0],
      keysRowType[1],
      keysRowType[2],
      keysRowType[3],
      keysRowType[4],
      keysRowType[5],
      initialChord,
      false,
      false
    );
    setNeck(updatedNeck);

    console.log("Se cambio de instrumento a " + instrument);
  }, [instrument, keysRowType, initialChord]);

  return loading ? (
    <h2>Cargando</h2>
  ) : (
    <div>
      <TitleView instrument={instrument} />
      <NeckView neck={neck} instrument={instrument} gain={gain} />
      <ControlsView
        setInstrument={setInstrument}
        setKeysRowType={setKeysRowType}
        setGain={setGain}
        gain={gain}
        initialChord={initialChord}
        setInitialChord={setInitialChord}
      />
    </div>
  );
}
