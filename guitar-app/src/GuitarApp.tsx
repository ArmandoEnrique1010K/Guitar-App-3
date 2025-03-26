import { useEffect, useState } from "react";
import TitleView from "./components/Title/TitleView";
import ControlsView from "./components/Controls/ControlsView";
import NeckView from "./components/Neck/NeckView";
import { preloadSounds } from "./utils/audioPlayer";
import { FIRST, LOADING_TIME } from "./constants";
import { guitarNotes } from "./data/guitarNotes";
import { DistortionEffect, Neck, ReverbEffect, VibratoEffect } from "./types";
import { assignKeysToFrets } from "./utils/assignKeysToFrets";
import EffectsView from "./components/Effects/EffectsView";

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

  // EFECTO DE SONIDO DE DISTORSIÓN
  const [distortion, setDistortion] = useState<DistortionEffect>({
    enabled: false,
    distortion: 0.4,
    oversample: "none",
    wet: 1,
  });

  // REBERBERACIÓN
  const [reverb, setReverb] = useState<ReverbEffect>({
    enabled: false,
    decay: 1.5,
    preDelay: 0.01,
    wet: 1,
  });

  // VIBRATO
  const [vibrato, setVibrato] = useState<VibratoEffect>({
    enabled: false,
    depth: 0.1,
    frequency: 5,
    maxDelay: 0.005,
    type: "sine",
    wet: 1,
  });
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
      <NeckView
        neck={neck}
        instrument={instrument}
        gain={gain}
        distortion={distortion}
        reverb={reverb}
        vibrato={vibrato}
      />
      <ControlsView
        setInstrument={setInstrument}
        setKeysRowType={setKeysRowType}
        setGain={setGain}
        gain={gain}
        initialChord={initialChord}
        setInitialChord={setInitialChord}
      />
      <EffectsView
        distortion={distortion}
        setDistortion={setDistortion}
        reverb={reverb}
        setReverb={setReverb}
        vibrato={vibrato}
        setVibrato={setVibrato}
      />
    </div>
  );
}
