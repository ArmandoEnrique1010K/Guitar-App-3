import { useEffect, useState } from "react";
import TitleView from "./components/Title/TitleView";
import ControlsView from "./components/Controls/ControlsView";
import NeckView from "./components/Neck/NeckView";
import { preloadSounds } from "./utils/audioPlayer";
import {
  FIRST,
  INITIAL_CHORUS,
  INITIAL_DELAY,
  INITIAL_DISTORTION,
  INITIAL_PHASER,
  INITIAL_REVERB,
  INITIAL_TREMOLO,
  INITIAL_VIBRATO,
  LOADING_TIME,
} from "./constants";
import { guitarNotes } from "./data/guitarNotes";
import {
  ChorusEffect,
  DelayEffect,
  DistortionEffect,
  Neck,
  PhaserEffect,
  ReverbEffect,
  TremoloEffect,
  VibratoEffect,
} from "./types";
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
  const [distortion, setDistortion] =
    useState<DistortionEffect>(INITIAL_DISTORTION);

  // REBERBERACIÓN
  const [reverb, setReverb] = useState<ReverbEffect>(INITIAL_REVERB);

  // VIBRATO
  const [vibrato, setVibrato] = useState<VibratoEffect>(INITIAL_VIBRATO);

  // CORO
  const [chorus, setChorus] = useState<ChorusEffect>(INITIAL_CHORUS);

  // TREMOLO
  const [tremolo, setTremolo] = useState<TremoloEffect>(INITIAL_TREMOLO);

  // RETRAZO
  const [delay, setDelay] = useState<DelayEffect>(INITIAL_DELAY);

  // PHASER
  const [phaser, setPhaser] = useState<PhaserEffect>(INITIAL_PHASER);

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
        chorus={chorus}
        tremolo={tremolo}
        delay={delay}
        phaser={phaser}
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
        chorus={chorus}
        setChorus={setChorus}
        tremolo={tremolo}
        setTremolo={setTremolo}
        delay={delay}
        setDelay={setDelay}
        phaser={phaser}
        setPhaser={setPhaser}
      />
    </div>
  );
}
