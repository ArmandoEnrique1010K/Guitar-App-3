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
  Note,
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

  // Silenciar la nota anterior (cuerda diferente)
  const [mutePreviousNote, setMutePreviousNote] = useState<boolean>(false);

  // Modo pulso (manten pulsada una tecla para mantener reproduciendo la nota)
  const [pulseMode, setPulseMode] = useState<boolean>(false);

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

  // Nota actual reproducida
  const [notePlayed, setNotePlayed] = useState<Note>({
    rope: null,
    chord: null,
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

    // TODO: DEBE DEPENDER DE INSTRUMENT
    console.log("SE PRECARGARON LOS SONIDOS");
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

  // ESTA FUNCIÓN DEBERIA EVITAR QUE SE SIGA REPRODUCIENDO LA NOTA MUSICAL
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      // Prevent the default behavior to avoid repeated note playback
      // event.preventDefault();

      // Add your key handling logic here
      console.log(`Key pressed: ${event.key}`);
    };

    window.addEventListener("keydown", handleKeyDown);
    // Limpia el evento cuando el componente se desmonta
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
        mutePreviousNote,
        setMutePreviousNote,
        pulseMode,
        setPulseMode,

        gain,
        setGain,

        notePlayed,
        setNotePlayed,

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
