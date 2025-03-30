import * as Tone from "tone";
import { Effects, PreviousNote } from "../types";

type ActiveNote = {
  chord: number;
  source: Tone.ToneBufferSource;
  effectNodes: Tone.ToneAudioNode[]; // Almacena los nodos de efectos
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
      }).toDestination();
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

  // Manejo de notas anteriores
  handlePreviousNotes(rope, chord, muteOnDifferentRope);

  // Limpiar nota anterior en la misma cuerda
  cleanupPreviousNote(rope);

  // Crear y configurar nueva nota
  const { bufferSource, effectNodes } = createAudioNodes(player.buffer, effects);


  // Programar reproducción
  const now = Tone.now();
  bufferSource.start(now);
  bufferSource.stop(now + bufferSource.buffer.duration);

  // Actualizar estado
  updateActiveNote(rope, chord, bufferSource, effectNodes);
  previousNotePlayed = { rope, chord };

  console.log(`Reproduciendo: cuerda ${rope}, acorde ${chord}`);

  // Configurar listener de teclado si es necesario
  setupKeyboardListener(keyFromKeyboard, clickMode);

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

function handlePreviousNotes(
  rope: number,
  chord: number,
  muteOnDifferentRope: boolean
) {
  // Detener misma nota si ya está sonando
  if (activeNotes[rope]?.chord === chord && activeNotes[rope]?.source) {
    activeNotes[rope]?.source.stop();
    console.log(`Detenida nota duplicada (${rope}, ${chord})`);
  }

  // Detener nota anterior en cuerda diferente si está configurado
  const { rope: prevRope } = previousNotePlayed;
  if (
    prevRope !== null &&
    prevRope !== rope &&
    activeNotes[prevRope]?.source &&
    muteOnDifferentRope
  ) {
    activeNotes[prevRope]?.source.stop();
    console.log(`Detenida nota anterior (${prevRope}) por cambio de cuerda`);
    delete activeNotes[prevRope];
  }
}

function createAudioNodes(
  buffer: Tone.ToneAudioBuffer,
  effects: Effects
) {
  const bufferSource = new Tone.ToneBufferSource(buffer);
  const gainNode = new Tone.Gain(effects.gain?.gain);
  const effectNodes: Tone.ToneAudioNode[] = [gainNode];

  let lastNode: Tone.ToneAudioNode = bufferSource;

  // Configurar cadena de efectos
  if (effects.distortion?.enabled) {
    const node = createDistortionNode(effects.distortion);
    lastNode = connectEffect(lastNode, node, effectNodes);
  }

  if (effects.reverb?.enabled) {
    const node = createReverbNode(effects.reverb);
    lastNode = connectEffect(lastNode, node, effectNodes);
  }

  if (effects.vibrato?.enabled) {
    const node = createVibratoNode(effects.vibrato);
    lastNode = connectEffect(lastNode, node, effectNodes)
  }

  if (effects.chorus?.enabled) {
    const node = createChorusNode(effects.chorus);
    lastNode = connectEffect(lastNode, node, effectNodes);
  }

  if (effects.tremolo?.enabled) {
    const node = createTremoloNode(effects.tremolo);
    lastNode = connectEffect(lastNode, node, effectNodes);
  }

  if (effects.delay?.enabled) {
    const node = createFeedbackDelayNode(effects.delay);
    lastNode = connectEffect(lastNode, node, effectNodes);
  }

  if (effects.phaser?.enabled) {
    const node = createPhaserNode(effects.phaser);
    lastNode = connectEffect(lastNode, node, effectNodes);
  }

  if (effects.eq3?.enabled) {
    const node = createEQ3Node(effects.eq3);
    lastNode = connectEffect(lastNode, node, effectNodes);
  }


  // Conectar cadena al gain y al destino final
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


function connectEffect(
  source: Tone.ToneAudioNode,
  effect: Tone.ToneAudioNode,
  effectNodes: Tone.ToneAudioNode[]
): Tone.ToneAudioNode {
  source.connect(effect);
  effectNodes.push(effect);
  return effect;
}

function updateActiveNote(
  rope: number,
  chord: number,
  source: Tone.ToneBufferSource,
  effectNodes: Tone.ToneAudioNode[]
) {
  activeNotes[rope] = { chord, source, effectNodes };
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


