import * as Tone from "tone";
import { Effects, PreviousNote } from "../types";

type ActiveNote = {
  chord: number;
  source: Tone.ToneBufferSource;
  effectNodes: Tone.ToneAudioNode[]; // Almacena los nodos de efectos
  noteId: string; // Identificador único para cada nota
  timeoutId?: NodeJS.Timeout; // Optional timeout ID for managing note silencing
  startTime: number; // Timestamp en milisegundos
}

// 2. Función para generar IDs únicos
function generateNoteId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

const MAX_NOTES = 47; // 00 a 46
const NOTE_FILES = Array.from({ length: MAX_NOTES }, (_, i) =>
  i.toString().padStart(2, "0")
);

// ==================== ESTADO GLOBAL ====================

const activeKeys: Record<string, boolean> = {};
const players: Record<string, Tone.Player> = {};
const activeNotes: Record<number, ActiveNote | undefined> = {};
let previousNotePlayed: PreviousNote = { rope: null, chord: null };

// Precarga todos los sonidos de una carpeta específica
// name es el nombre de la carpeta que contiene los samples
export function preloadSounds(name: string) {
  const audioPath = `assets/audio/${name}`;

  NOTE_FILES.forEach((file) => {
    const audioFile = `${audioPath}/${file}.mp3`;

    if (!players[audioFile]) {
      players[audioFile] = new Tone.Player({
        url: audioFile,
        autostart: false,
        onload: () => console.debug(`Audio cargado: ${audioFile}`),
        onerror: (error) => console.error(`Error al cargar ${audioFile}:`, error)
      })
      // .toDestination();
    }
  });
}

// Limpia los recursos de una nota anterior en una cuerda específica
// rope es el número de cuerda a limpiar
export function cleanupPreviousNote(rope: number) {
  const note = activeNotes[rope];
  if (!note) return;

  note.source.stop();
  note.source.dispose();
  note.effectNodes.forEach(node => node.dispose());
  delete activeNotes[rope];
}

// Detiene todas las notas que están sonando actualmente
export function muteAll(): void {
  Object.keys(activeNotes).forEach(ropeStr => {
    const rope = Number(ropeStr);
    cleanupPreviousNote(rope);
  });
  previousNotePlayed = { rope: null, chord: null };
}

// Detiene solo la nota actualmente activa
export function muteCurrentNote(): void {
  const { rope, chord } = previousNotePlayed;

  if (rope === null || chord === null) {
    console.log("No hay nota activa para silenciar");
    return;
  }

  const note = activeNotes[rope];
  if (note?.source) {
    note.source.stop();
    delete activeNotes[rope];
    console.log(`Nota silenciada: cuerda ${rope}, acorde ${chord}`);
  }

  previousNotePlayed = { rope: null, chord: null };
}

// Reproduce un sonido con los efectos especificados
export function playSound(
  name: string,
  data: { rope: number; frets: { chord: number; file: string }[] }[] = [],
  rope: number,
  chord: number,
  keyFromKeyboard: string,
  clickMode: boolean,
  muteOnDifferentRope: boolean,
  muteOnSameRope: boolean,
  muteOnSameNote: boolean,
  holdMode: boolean,
  holdModeTime: number,
  gain: number,
  effects: Effects
) {


  // Validación de teclado
  if (shouldSkipPlayback(keyFromKeyboard, clickMode)) return;

  // Buscar datos de la nota
  const noteData = getNoteData(data, rope, chord);
  if (!noteData) return;

  const { player, audioFile } = loadAudioFile(name, noteData.file);
  if (!player?.loaded) {
    console.error(`Audio no cargado: ${audioFile}`);
    return;
  }

  // Generar ID único para esta nota
  const currentNoteId = generateNoteId();

  // Manejo de notas anteriores
  handlePreviousNotes(rope, chord, muteOnDifferentRope, muteOnSameRope, muteOnSameNote, holdMode, holdModeTime, true, 100, 50)

  // Limpiar nota anterior en la misma cuerda
  // if (!holdModeEnabled) {
  //   cleanupPreviousNote(rope); // Solo limpia si no estamos en holdModeEnabled
  // }

  try {
    // Crear y configurar nueva nota
    const { bufferSource, effectNodes } = createStableAudioChain(player.buffer, effects, gain);


    // Programar reproducción
    const now = Tone.now();
    const startTime = now + 0.01; // Pequeño offset para evitar cortes
    bufferSource.start(startTime);
    bufferSource.stop(startTime + bufferSource.buffer.duration + 0.1); // Margen adicional

    // Actualizar estado
    updateActiveNote(rope, chord, bufferSource, effectNodes, currentNoteId, startTime);

    previousNotePlayed = { rope, chord };
    // console.log(`Nota ${currentNoteId} reproducida en cuerda ${rope}`);

    console.log(`Reproduciendo: cuerda ${rope}, acorde ${chord}`);

    // Configurar listener de teclado si es necesario
    setupKeyboardListener(keyFromKeyboard, clickMode);

  } catch (error) {
    console.error("Error al crear la cadena de audio: ", error)
  }


}

// FUNCIONES AUXILIARES
function shouldSkipPlayback(key: string, clickMode: boolean): boolean {
  if (key && !clickMode) {
    if (activeKeys[key]) return true;
    activeKeys[key] = true;
  }
  return false;
}

function getNoteData(
  data: { rope: number; frets: { chord: number; file: string }[] }[],
  rope: number,
  chord: number
) {
  const ropeData = data.find(n => n.rope === rope);
  if (!ropeData) {
    console.log("Cuerda no encontrada");
    return null;
  }

  const fretData = ropeData.frets.find(f => f.chord === chord);
  if (!fretData) {
    console.log("Acorde no encontrado");
    return null;
  }

  return fretData;
}

function loadAudioFile(name: string, file: string) {
  const audioPath = `/audio/${name}/`;
  const audioFile = `assets${audioPath}${file}.mp3`;
  return { player: players[audioFile], audioFile };
}

function createStableAudioChain(buffer: Tone.ToneAudioBuffer, effects: Effects, gain: number) {
  // Crear buffer source con configuración estable
  const bufferSource = new Tone.ToneBufferSource({
    fadeIn: 0.01,
    fadeOut: 0.01,
    curve: "linear"
  });
  bufferSource.buffer = buffer;

  const gainNode = new Tone.Gain(gain);
  const effectNodes: Tone.ToneAudioNode[] = [gainNode];

  // Configurar cadena de efectos con protección
  let lastNode: Tone.ToneAudioNode = bufferSource;

  // Mapeo de efectos a funciones de creación
  const effectCreators = [
    { enabled: effects.distortion?.enabled, creator: () => createDistortionNode(effects.distortion!) },
    { enabled: effects.reverb?.enabled, creator: () => createReverbNode(effects.reverb!) },
    { enabled: effects.vibrato?.enabled, creator: () => createVibratoNode(effects.vibrato!) },
    { enabled: effects.chorus?.enabled, creator: () => createChorusNode(effects.chorus!) },
    { enabled: effects.tremolo?.enabled, creator: () => createTremoloNode(effects.tremolo!) },
    { enabled: effects.delay?.enabled, creator: () => createFeedbackDelayNode(effects.delay!) },
    { enabled: effects.phaser?.enabled, creator: () => createPhaserNode(effects.phaser!) },
    { enabled: effects.eq3?.enabled, creator: () => createEQ3Node(effects.eq3!) },
    { enabled: effects.compressor?.enabled, creator: () => createCompressorNode(effects.compressor!) },
    { enabled: effects.autoWah?.enabled, creator: () => createAutoWahNode(effects.autoWah!) }
  ];
  // Aplicar efectos con manejo de errores
  effectCreators.forEach(({ enabled, creator }) => {
    if (enabled) {
      try {
        const node = creator();
        lastNode.disconnect(); // Desconectar seguro
        lastNode.connect(node);
        lastNode = node;
        effectNodes.push(node);
      } catch (error) {
        console.warn(`Error al aplicar efecto: ${error}`);
      }
    }
  });

  // Conexión final con protección
  lastNode.disconnect();
  lastNode.connect(gainNode);
  gainNode.toDestination();

  return { bufferSource, effectNodes };
}


function createDistortionNode(params: NonNullable<Effects['distortion']>) {
  return new Tone.Distortion({
    distortion: params.distortion,
    oversample: params.oversample,
    wet: params.wet
  });
}

function createReverbNode(params: NonNullable<Effects['reverb']>) {
  return new Tone.Reverb({
    decay: params.decay,
    preDelay: params.preDelay,
    wet: params.wet
  });
}

function createVibratoNode(params: NonNullable<Effects['vibrato']>) {
  return new Tone.Vibrato({
    frequency: params.frequency,
    depth: params.depth,
    type: params.type,
    maxDelay: params.maxDelay,
    wet: params.wet
  })
}

function createChorusNode(params: NonNullable<Effects['chorus']>) {
  return new Tone.Chorus({
    frequency: params.frequency,
    delayTime: params.delayTime,
    depth: params.depth,
    feedback: params.feedback,
    spread: params.spread,
    type: params.type,
    wet: params.wet
  });
}

function createTremoloNode(params: NonNullable<Effects['tremolo']>) {
  return new Tone.Tremolo({
    frequency: params.frequency,
    depth: params.depth,
    spread: params.spread,
    type: params.type,
    wet: params.wet
  }).start(); // Tremolo needs to be started
}

function createFeedbackDelayNode(params: NonNullable<Effects['delay']>) {
  return new Tone.FeedbackDelay({
    delayTime: params.delayTime,
    feedback: params.feedback,
    maxDelay: params.maxDelay,
    wet: params.wet
  });
}

function createPhaserNode(params: NonNullable<Effects['phaser']>) {
  return new Tone.Phaser({
    frequency: params.frequency,
    octaves: params.octaves,
    stages: params.stages,
    Q: params.Q,
    baseFrequency: params.baseFrequency,
    wet: params.wet
  });
}

function createEQ3Node(params: NonNullable<Effects['eq3']>) {
  return new Tone.EQ3({
    low: params.low,
    mid: params.mid,
    high: params.high,
    lowFrequency: params.lowFrequency,
    highFrequency: params.highFrequency,
  });
}

function createCompressorNode(params: NonNullable<Effects['compressor']>) {
  return new Tone.Compressor({
    threshold: params.threshold,
    ratio: params.ratio,
    attack: params.attack,
    release: params.release,
    knee: params.knee,
  })
}

function createAutoWahNode(params: NonNullable<Effects['autoWah']>) {
  return new Tone.AutoWah({
    baseFrequency: params.baseFrequency,
    octaves: params.octaves,
    sensitivity: params.sensitivity,
    follower: params.follower,
    Q: params.Q,
    gain: params.gain,
    wet: params.wet
  })
}

function updateActiveNote(
  rope: number,
  chord: number,
  source: Tone.ToneBufferSource,
  effectNodes: Tone.ToneAudioNode[],
  noteId: string,
  startTime: number,
) {
  activeNotes[rope] = { chord, source, effectNodes, noteId, startTime };
}

function setupKeyboardListener(key: string, clickMode: boolean) {
  if (!key || clickMode) {
    if (clickMode) activeKeys[key] = false;
    return;
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === key) {
      activeKeys[key] = false;
      document.removeEventListener("keyup", handleKeyUp);
    }
  };

  document.addEventListener("keyup", handleKeyUp);
}



// TODO: ¿PORQUE CUANDO ACTIVO MÁS DE 3 EFECTOS SE ENTRECORTA EL SONIDO?

// TODO: ESTO PODRIA MEJORAR

// LEE EL SIGUIENTE TEXTO:

// Se necesitan el acorde y la cuerda tanto de la nota actual como la anterior nota tocada
// Normalmente en una guitarra cuando se toca la misma nota varias veces, se debe silenciar la nota anterior
// Si se ha tocado una nota y la nota que se tocara acontinuación, se encuentra en la misma cuerda que la anterior, se debe silenciar la nota anterior
// Si la nota actual y la anterior se encuentran en diferentes cuerdas, entonces no se debe silenciar la nota anterior

// Opciones y parametros:
// muteOnDifferentRope  <-- silencia la nota que se toca en una cuerda diferente
// holdMode <-- Mantiene reproduciendo la nota anterior por un tiempo
// holdModeAnyTime <-- No establece el tiempo en milisegundos
// holdModeTime <-- Establece un tiempo en milisegundos para mantener reproduciendo la nota anterior
// amountMode <-- Evita que la nota anterior se silencie si se toca la misma nota varias veces

// Metas cumplidas:
// Cuando agarro una moneda y la deslizo desde la tecla "P" hasta la "Q", si funciona, se escucha cuando alguien toca una nota y desliza el dedo por la cuerda, esto se logra si holdMode esta activado y holdModeAnyTime esta en 10 milisegundos

// Nuevos objetivos:
// Debe tener los siguientes parametros:
// muteOnDifferentRope
// muteOnSameRope
// muteOnSameNote

// Mantiene reproduciendo la nota anterior por un corto tiempo, debe englobar todas las condiciones
// holdMode
// holdModeTime
// *Se elimina el parametro holdModeAnyTime


// TODO: ENCONTRE UNOS PROBLEMAS EN LA LOGICA DE LA GUITARRA
// 1. ¿Explicar porque si los parametros muteOnSameRope y muteOnSameNote estan en true, al pasar una moneda desde la tecla Q hasta la P no se escucha como si fuera que un guitarrista toca una nota y desliza el dedo por la cuerda, pues solamente funciona si holdMode esta en true?

// 2. ¿Explicar porque si los parametros  muteOnDifferentRope, muteOnSameRope, muteOnSameNote, y holdMode estan en true y holdModeTime en 100 (por ejemplo)

// 2.1. al tocar la misma cuerda, lo silencia la nota anterior luego de los milisegundos, si toco la nota por segunda vez, silencia la nota que sono por primera vez, pero cuando toco por tercera vez, no silencia la que toco por segunda vez hasta que toque por cuarta vez, silencia la que sono por tercera vez.

// 2.2. solamente silencia las notas que se encuentran en una cuerda diferente luego del tiempo en milisegundos, silencia la nota

// NUEVAS METAS:

// 1. Implementar una nueva mecanica para deslizar el dedo por una cuerda

// 2.1 Evitar que al tocar la misma cuerda con los parametros muteOnDifferentRope, muteOnSameRope, muteOnSameNote, y holdMode estan en true y holdModeTime en 100 (por ejemplo), que no trate de eliminar el dato de la nota anterior. ¿Me parece que ahi esta el problema...?

// 2.2 Me parece una buena funcionalidad, 
// pero porque silencia solamente la nota anterior tocada en una cuerda diferente y no cuenta con las notas de la misma cuerda
// pero como lo implementaria para que silencie la nota anterior cuando deslizo una moneda sobre la cuerda



// type NoteHandlingOptions = {
//   muteOnDifferentRope: boolean,
//   muteOnSameRope: boolean,
//   muteOnSameNote: boolean,
//   holdMode: boolean,
//   holdModeTime: number
// }

function handlePreviousNotes(
  rope: number,
  chord: number,
  muteOnDifferentRope: boolean,
  muteOnSameRope: boolean,
  muteOnSameNote: boolean,
  holdMode: boolean,
  holdModeTime: number,
  slideMode: boolean,
  fadeTime: number,
  minSlideInterval: number,
) {
  const previousNote = activeNotes[rope];
  const prevRope = previousNotePlayed?.rope;

  // Función para programar la limpieza de una nota
  const scheduleCleanup = (note: ActiveNote, ropeNumber: number) => {
    if (holdMode) {
      // Limpiar cualquier temporizador existente
      if (note.timeoutId) {
        clearTimeout(note.timeoutId);
      }

      // Programar nueva limpieza
      note.timeoutId = setTimeout(() => {
        if (activeNotes[ropeNumber]?.chord === note.chord) {
          cleanupNoteResources(note);
          delete activeNotes[ropeNumber];
          console.log(`Nota silenciada después de ${holdModeTime} milisegundos: cuerda ${ropeNumber}, acorde ${note.chord}`);
        }
      }, holdModeTime);
    } else {
      // Limpieza inmediata si no hay holdMode
      cleanupNoteResources(note);
      delete activeNotes[ropeNumber];
    }
  };



  // 1. Misma cuerda y misma nota
  if (previousNote && previousNote.chord === chord) {
    if (muteOnSameNote) {
      // TODO: ARREGLAR ESTA PARTE, LA FUNCIÓN ELIMINA LOS DATOS DE LA NOTA ANTERIOR Y NO SE ESPERA ESO, PORQUE NO SILENCIA LAS NOTAS 'ANTERIORES',
      // 1° NOTA
      // 2° NOTA --> SILENCIA LA PRIMERA
      // 3° NOTA --> NO SILENCIA LA SEGUNDA
      // 4° NOTA --> SILENCIA LA TERCERA, PERO NO LA SEGUNDA
      scheduleCleanup(previousNote, rope);
    }
    return; // Siempre salimos si es la misma nota
  }



  // 2. Misma cuerda pero nota diferente
  if (previousNote && previousNote.chord !== chord) {
    if (muteOnSameRope) {
      // Pequeño fadeout para transición suave
      // TODO: ¿POSIBLE SOLUCIÓN?
      // previousNote.source.stop(Tone.now() + 0.02);
      previousNote.source.stop(Tone.now() + holdModeTime / 1000);
      scheduleCleanup(previousNote, rope);
    }
  }

  // 3. Nota anterior en cuerda diferente
  if (prevRope !== null && prevRope !== rope && activeNotes[prevRope])
    if (muteOnDifferentRope) {
      // Pequeño fadeout para transición suave
      activeNotes[prevRope].source.stop(Tone.now() + 0.02);
      scheduleCleanup(activeNotes[prevRope], prevRope);
    }
}



// Nueva función para limpieza segura
function cleanupNoteResources(note: ActiveNote) {
  if (note.timeoutId) clearTimeout(note.timeoutId);
  if (note.source) {
    try {
      note.source.stop();
      note.source.dispose();
    } catch (error) {
      console.warn("Error al detener o eliminar el BufferSource:", error);
    }
  }
  note.effectNodes.forEach((node) => {
    try {
      node.dispose();
    } catch (error) {
      console.warn("Error al limpiar nodo de efecto:", error);
    }
  });
}