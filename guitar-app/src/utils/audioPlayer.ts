import * as Tone from "tone";
import { Effects, PreviousNote } from "../types";

type ActiveNote = {
  chord: number;
  source: Tone.ToneBufferSource;
  effectNodes: Tone.ToneAudioNode[]; // Almacena los nodos de efectos
  noteId: string; // Identificador único para cada nota
  timeoutId?: NodeJS.Timeout; // Optional timeout ID for managing note silencing
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
  muteOnDifferentRope: boolean,
  keyFromKeyboard: string,
  clickMode: boolean,
  holdModeEnabled: boolean,
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
  handlePreviousNotes(rope, chord, muteOnDifferentRope, holdModeEnabled, holdModeTime,
    //  currentNoteId
  );

  // Limpiar nota anterior en la misma cuerda
  if (!holdModeEnabled) {
    cleanupPreviousNote(rope); // Solo limpia si no estamos en holdModeEnabled
  }

  try {
    // Crear y configurar nueva nota
    const { bufferSource, effectNodes } = createStableAudioChain(player.buffer, effects, gain);


    // Programar reproducción
    const now = Tone.now();
    const startTime = now + 0.01; // Pequeño offset para evitar cortes
    bufferSource.start(startTime);
    bufferSource.stop(startTime + bufferSource.buffer.duration + 0.1); // Margen adicional
    // Actualizar estado
    updateActiveNote(rope, chord, bufferSource, effectNodes, currentNoteId);

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
    highFrequency: params.highFrequency
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
  noteId: string
) {
  activeNotes[rope] = { chord, source, effectNodes, noteId };
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


function handlePreviousNotes(
  rope: number,
  chord: number,
  muteOnDifferentRope: boolean,
  holdMode: boolean,
  holdModeTime: number,
) {
  const previousNote = activeNotes[rope];

  // Manejo de notas en la misma cuerda
  if (previousNote && previousNote.chord !== chord) {
    if (holdMode) {
      // Configurar fadeout suave
      if (previousNote.source) {
        previousNote.source.stop(Tone.now() + 0.1); // Fadeout de 100ms
      }
      // Limpiar después del tiempo de hold
      setTimeout(() => {
        if (activeNotes[rope]?.chord === previousNote.chord) {
          cleanupNoteResources(previousNote);
          delete activeNotes[rope];
        }


        console.log(`Nota silenciada: cuerda ${rope}, acorde ${previousNote.chord}, después de ${holdModeTime}ms`);
      }, holdModeTime);
    } else {
      // Comportamiento normal: silenciar inmediatamente
      cleanupNoteResources(previousNote);
      delete activeNotes[rope];
    }
  }

  // TODO: REPARAR ESTO
  // Manejo de notas en otras cuerdas (respetando muteOnDifferentRope)
  // const { rope: prevRope } = previousNotePlayed;
  // if (
  //   previousNote &&
  //   prevRope !== null &&
  //   prevRope === rope &&
  //   activeNotes[prevRope] &&
  //   muteOnDifferentRope
  // ) {
  //   console.log(`Silenciando nota en cuerda diferente: ${prevRope}`);

  //   if (holdMode) {
  //     // Configurar fadeout suave y limpiar después del tiempo de hold
  //     setTimeout(() => {
  //       if (activeNotes[prevRope]?.chord === previousNote.chord) {
  //         cleanupNoteResources(activeNotes[prevRope]!);
  //         delete activeNotes[prevRope];
  //         console.log(`Nota silenciada en cuerda ${prevRope} después de ${holdModeTime}ms`);
  //       }
  //     }, holdModeTime);
  //   } else {
  //     // Silenciar inmediatamente
  //     cleanupNoteResources(activeNotes[prevRope]!);
  //     delete activeNotes[prevRope];
  //     console.log(`Nota silenciada inmediatamente en cuerda ${prevRope}`);
  //   }

  //   console.log("previousNote:", previousNote);
  //   console.log("prevRope:", prevRope);
  //   console.log("activeNotes[prevRope]:", activeNotes[prevRope]);
  // }

  // Manejo de notas en otras cuerdas (respetando muteOnDifferentRope)
  const { rope: prevRope } = previousNotePlayed;

  // TODO: ESTE CODIGO SI FUNCIONA, SILENCIA LA NOTA ANTERIOR SI NO SE HA TOCADO EN LA MISMA CUERDA
  if (
    prevRope !== null &&
    prevRope !== rope &&
    activeNotes[prevRope] &&
    muteOnDifferentRope
  ) {
    // Silenciar inmediatamente las notas en otras cuerdas cuando muteOnDifferentRope es true
    cleanupNoteResources(activeNotes[prevRope]!);
    delete activeNotes[prevRope];
  }

}

// Nueva función para limpieza segura
function cleanupNoteResources(note: ActiveNote) {
  if (note.timeoutId) clearTimeout(note.timeoutId);
  if (note.source) {
    note.source.stop();
    note.source.dispose();
  }
  note.effectNodes.forEach(node => {
    try {
      node.dispose();
    } catch (e) {
      console.warn("Error al limpiar nodo:", e);
    }
  });
}
