import { ReactNode, useState, useEffect } from "react";
import {
  FIRST,
  INITIAL_DISTORTION,
  INITIAL_REVERB,
  INITIAL_VIBRATO,
  INITIAL_CHORUS,
  INITIAL_TREMOLO,
  INITIAL_DELAY,
  INITIAL_PHASER,
  INITIAL_EQ3,
  LOADING_TIME,
} from "../constants";
import { guitarNotes } from "../data/guitarNotes";
import {
  Neck,
  DistortionEffect,
  ReverbEffect,
  VibratoEffect,
  ChorusEffect,
  TremoloEffect,
  DelayEffect,
  PhaserEffect,
  EQ3Effect,
} from "../types";
import { assignKeysToFrets } from "../utils/assignKeysToFrets";
import { preloadSounds } from "../utils/audioPlayer";
import { GuitarContext } from "./GuitarContext";

// Proveedor del contexto
export const GuitarProvider = ({ children }: { children: ReactNode }) => {
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

  // Bloquear el acorde 0
  const [lockZeroChord, setLockZeroChord] = useState<boolean>(false);

  // Invertir el instrumento
  const [invertKeyboard, setInvertKeyboard] = useState<boolean>(false);

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

  // ECUALIZADOR
  const [eq3, setEq3] = useState<EQ3Effect>(INITIAL_EQ3);

  // COMPRESOR
  // const [compressor, setCompressor] =
  //   useState<CompressorEffect>(INITIAL_COMPRESSOR);

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
      lockZeroChord,
      invertKeyboard
    );
    setNeck(updatedNeck);

    console.log("Se cambio de instrumento a " + instrument);
  }, [instrument, keysRowType, initialChord, lockZeroChord, invertKeyboard]);

  return (
    <GuitarContext.Provider
      value={{
        loading,
        neck,
        instrument,
        setInstrument,
        setKeysRowType,

        initialChord,
        setInitialChord,
        lockZeroChord,
        setLockZeroChord,
        invertKeyboard,
        setInvertKeyboard,
        gain,
        setGain,

        distortion,
        setDistortion,
        reverb,
        setReverb,
        vibrato,
        setVibrato,
        chorus,
        setChorus,
        tremolo,
        setTremolo,
        delay,
        setDelay,
        phaser,
        setPhaser,
        eq3,
        setEq3,
      }}
    >
      {children}
    </GuitarContext.Provider>
  );
};
