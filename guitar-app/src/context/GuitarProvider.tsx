import { ReactNode, useState, useEffect, useMemo } from "react";
import {
  INITIAL_DISTORTION,
  INITIAL_REVERB,
  INITIAL_VIBRATO,
  INITIAL_CHORUS,
  INITIAL_TREMOLO,
  INITIAL_DELAY,
  INITIAL_PHASER,
  INITIAL_EQ3,
  LOADING_TIME,
  INITIAL_AUTOWAH,
  INITIAL_MESSAGE,
} from "../constants";
import { guitarNotes } from "../data/guitarNotes";
import { Note, Effects } from "../types";
import { assignKeysToFrets } from "../utils/assignKeysToFrets";
import { preloadSounds } from "../utils/audioPlayer";
import { GuitarContext } from "./GuitarContext";
import { INITIAL_COMPRESSOR } from "../constants/index";

// Proveedor del contexto
export const GuitarProvider = ({ children }: { children: ReactNode }) => {
  // Nombre del instrumento
  const [instrument, setInstrument] = useState<string>("cleanSolo");

  // Mastil de notas
  // const [neck, setNeck] = useState<Neck>([]);

  // Carga inicial
  const [loading, setLoading] = useState(true);

  // Tipo de filas de teclado
  const [keysRowType, setKeysRowType] = useState<number[]>([]);

  // Ganancia de volumen
  const [gain, setGain] = useState<number>(1);

  // Acorde inicial
  const [initialChord, setInitialChord] = useState<number>(0);

  // Bloquear el acorde 0
  const [lockZeroChord, setLockZeroChord] = useState<boolean>(false);

  // Configuración de reproducción de notas
  const [noteConfig, setNoteConfig] = useState<{
    muteOnDifferentRope: boolean;
    muteOnSameRope: boolean;
    muteOnSameNote: boolean;
    holdMode: boolean;
    holdModeTime: number;
  }>({
    muteOnDifferentRope: false,
    muteOnSameRope: true,
    muteOnSameNote: true,
    holdMode: true,
    holdModeTime: 0,
  });

  // // Silenciar la nota anterior (cuerda diferente)
  // const [mutePreviousNote, setMutePreviousNote] = useState<boolean>(false);

  // Modo pulso (manten pulsada una tecla para mantener reproduciendo la nota)
  const [pulseMode, setPulseMode] = useState<boolean>(false);

  // // Modo retención (no silencia la nota anterior de la misma cuerda)
  // const [holdMode, setHoldMode] = useState<{
  //   enabled: boolean;
  //   anyTime: boolean;
  //   time: number;
  // }>({
  //   enabled: true,
  //   anyTime: false, // Sin tiempo en milisegundos
  //   time: 10, // Ajusta el tiempo en milisegundos
  // });

  // // Modo amontonar (evita silenciar la misma nota)
  // const [amountMode, setAmountMode] = useState<boolean>(false);

  // ESTADO DE EFECTOS
  const [effects, setEffects] = useState<Effects>({
    distortion: INITIAL_DISTORTION,
    reverb: INITIAL_REVERB,
    vibrato: INITIAL_VIBRATO,
    chorus: INITIAL_CHORUS,
    tremolo: INITIAL_TREMOLO,
    delay: INITIAL_DELAY,
    phaser: INITIAL_PHASER,
    eq3: INITIAL_EQ3,
    compressor: INITIAL_COMPRESSOR,
    autoWah: INITIAL_AUTOWAH,
  });

  const [message, setMessage] = useState<string>(INITIAL_MESSAGE);

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target as HTMLInputElement;
    const checked = (event.target as HTMLInputElement).checked;

    // Determinar el valor basado en el tipo de input
    const newValue =
      type === "checkbox"
        ? checked
        : type === "select-one"
        ? value
        : type === ""
        ? value
        : parseFloat(value);

    // Actualizar dinámicamente el estado correspondiente
    setEffects((prevEffects) => ({
      ...prevEffects,
      [name]: {
        ...prevEffects[name as keyof Effects],
        [type === "checkbox"
          ? "enabled"
          : event.target.dataset.property || "value"]: newValue,
      },
    }));
  };
  // // EFECTO DE SONIDO DE DISTORSIÓN
  // const [distortion, setDistortion] =
  //   useState<DistortionEffect>(INITIAL_DISTORTION);

  // // REBERBERACIÓN
  // const [reverb, setReverb] = useState<ReverbEffect>(INITIAL_REVERB);

  // // VIBRATO
  // const [vibrato, setVibrato] = useState<VibratoEffect>(INITIAL_VIBRATO);

  // // CORO
  // const [chorus, setChorus] = useState<ChorusEffect>(INITIAL_CHORUS);

  // // TREMOLO
  // const [tremolo, setTremolo] = useState<TremoloEffect>(INITIAL_TREMOLO);

  // // RETRAZO
  // const [delay, setDelay] = useState<DelayEffect>(INITIAL_DELAY);

  // // PHASER
  // const [phaser, setPhaser] = useState<PhaserEffect>(INITIAL_PHASER);

  // // ECUALIZADOR
  // const [eq3, setEq3] = useState<EQ3Effect>(INITIAL_EQ3);

  // // COMPRESOR
  // const [compressor, setCompressor] =
  //   useState<CompressorEffect>(INITIAL_COMPRESSOR);

  // // AUTOWAH
  // const [autoWah, setAutoWah] = useState<AutoWahEffect>(INITIAL_AUTOWAH);

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

    console.log("SE PRECARGARON LOS SONIDOS");
    return () => clearTimeout(timeoutData);
  }, []);

  useEffect(() => {
    // const updatedNeck = assignKeysToFrets(
    //   guitarNotes,
    //   keysRowType[5],
    //   keysRowType[4],
    //   keysRowType[3],
    //   keysRowType[2],
    //   keysRowType[1],
    //   keysRowType[0],
    //   initialChord,
    //   lockZeroChord
    // );
    // setNeck(updatedNeck);
    // if (keysRowType.length === 6) {
    //   const reversed = keysRowType.slice().reverse();
    //   setNeck(
    //     assignKeysToFrets(
    //       guitarNotes,
    //       reversed[0],
    //       reversed[1],
    //       reversed[2],
    //       reversed[3],
    //       reversed[4],
    //       reversed[5],
    //       initialChord,
    //       lockZeroChord
    //     )
    //   );
    // }
    console.log("Se cambio de instrumento a " + instrument);
    // console.log(updatedNeck);

    // console.log(keysRowType);
    // DEPENDENCIAS: instrument, keysRowType, initialChord, lockZeroChord
  }, [instrument, keysRowType, initialChord, lockZeroChord]);

  // Mastil de notas (optimizado con useMemo)
  const neck = useMemo(() => {
    if (keysRowType.length === 6) {
      const reversed = keysRowType.slice().reverse();
      return assignKeysToFrets(
        guitarNotes,
        reversed[0],
        reversed[1],
        reversed[2],
        reversed[3],
        reversed[4],
        reversed[5],
        initialChord,
        lockZeroChord
      );
    }
    return [];
  }, [guitarNotes, keysRowType, initialChord, lockZeroChord]);

  // Mejorar el rendimiento recalculando el mástil solo cuando cambian dependencias relevantes
  // useEffect(() => {
  //   console.log("Cambiando acorde inicial a " + initialChord);

  //   setNeck(
  //     assignKeysToFrets(
  //       guitarNotes,
  //       keysRowType[5],
  //       keysRowType[4],
  //       keysRowType[3],
  //       keysRowType[2],
  //       keysRowType[1],
  //       keysRowType[0],
  //       initialChord,
  //       lockZeroChord
  //     )
  //   );
  // }, [initialChord]);

  // useEffect(() => {
  //   console.log("Cambiaron las filas del teclado", keysRowType);

  //   setNeck(
  //     assignKeysToFrets(
  //       guitarNotes,
  //       keysRowType[5],
  //       keysRowType[4],
  //       keysRowType[3],
  //       keysRowType[2],
  //       keysRowType[1],
  //       keysRowType[0],
  //       initialChord,
  //       lockZeroChord
  //     )
  //   );
  // }, [keysRowType]);

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

        noteConfig,
        setNoteConfig,
        // mutePreviousNote,
        // setMutePreviousNote,
        pulseMode,
        setPulseMode,
        // holdMode,
        // setHoldMode,

        // amountMode,
        // setAmountMode,
        gain,
        setGain,

        notePlayed,
        setNotePlayed,

        effects,
        handleChange,
        message,
        setMessage,
      }}
    >
      {children}
    </GuitarContext.Provider>
  );
};
