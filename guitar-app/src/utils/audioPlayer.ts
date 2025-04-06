import * as Tone from "tone";
import { Effects, PreviousNote } from "../types";
import { EffectsManager } from "./effectsManager";

type ActiveNote = {
  chord: number;
  source: Tone.ToneBufferSource;
  effectNodes: Tone.ToneAudioNode[]; // Almacena los nodos de efectos
  noteId: string; // Identificador único para cada nota
  timeoutId?: NodeJS.Timeout; // Optional timeout ID for managing note silencing
  startTime: number; // Timestamp en milisegundos
  // shouldMute: boolean
}

// Numero de archivos de sonido
const MAX_NOTES = 47; // 00 a 46
const NOTE_FILES = Array.from({ length: MAX_NOTES }, (_, i) =>
  i.toString().padStart(2, "0")
);

// Inicialización del EffectsManager
const effectsManager = new EffectsManager();

// ==================== ESTADO GLOBAL ====================

const activeKeys: Record<string, boolean> = {};
const players: Record<string, Tone.Player> = {};
const activeNotes: Record<number, ActiveNote | undefined> = {};
let previousNotePlayed: PreviousNote = { rope: null, chord: null };


// ==================== FUNCIONES PRINCIPALES ====================

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


// 2. Función para generar IDs únicos
function generateNoteId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
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

// ==================== FUNCIÓN PRINCIPAL DE REPRODUCCIÓN ====================

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
): void {

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
  // const currentNoteId = generateNoteId();

  // Manejo de notas anteriores
  handlePreviousNotes(rope, chord, muteOnDifferentRope, muteOnSameRope, muteOnSameNote, holdMode, holdModeTime)

  // Limpiar nota anterior en la misma cuerda
  // if (!holdModeEnabled) {
  //   cleanupPreviousNote(rope); // Solo limpia si no estamos en holdModeEnabled
  // }

  try {
    // Crear y configurar nueva nota
    // const { bufferSource, effectNodes } = createStableAudioChain(player.buffer, effects, gain);

    // Crear cadena de audio optimizada
    const bufferSource = new Tone.ToneBufferSource({
      // TODO: OBSOLETO???
      // buffer: player.buffer,
      fadeIn: 0.03,
      fadeOut: 0.1,
      curve: "exponential",
    });

    bufferSource.buffer = player.buffer

    // Crear cadena de efectos usando el EffectsManager
    const effectChain = effectsManager.createEffectsChain(effects);
    const gainNode = new Tone.Gain(gain);

    // Conexión de la cadena completa
    bufferSource.chain(...effectChain, gainNode, Tone.Destination);

    // Programar reproducción
    const now = Tone.now();
    const startTime = now + 0.01; // Pequeño offset para evitar cortes
    bufferSource.start(startTime);
    bufferSource.stop(startTime + bufferSource.buffer.duration + 0.1); // Margen adicional
    // bufferSource.start(now);
    // bufferSource.stop(now + bufferSource.buffer.duration + 0.1);

    // Actualizar estado
    // updateActiveNote(rope, chord, bufferSource, effectNodes, currentNoteId, startTime);
    // Registrar la nota activa

    activeNotes[rope] = {
      chord,
      source: bufferSource,
      effectNodes: [...effectChain, gainNode],
      noteId: generateNoteId(),
      startTime: Date.now()
    };


    previousNotePlayed = { rope, chord };
    // console.log(`Nota ${currentNoteId} reproducida en cuerda ${rope}`);

    console.log(`Reproduciendo: cuerda ${rope}, acorde ${chord}`);

    // Configurar listener de teclado si es necesario
    setupKeyboardListener(keyFromKeyboard, clickMode);

  } catch (error) {
    console.error("Error al crear la cadena de audio: ", error)
  }


}

// ==================== FUNCIONES AUXILIARES ====================
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

// function createStableAudioChain(buffer: Tone.ToneAudioBuffer, effects: Effects, gain: number) {
//   // Crear buffer source con configuración estable
//   const bufferSource = new Tone.ToneBufferSource({
//     fadeIn: 0.01,
//     fadeOut: 0.01,
//     curve: "linear"
//   });
//   bufferSource.buffer = buffer;

//   const gainNode = new Tone.Gain(gain);
//   const effectNodes: Tone.ToneAudioNode[] = [gainNode];

//   // Configurar cadena de efectos con protección
//   let lastNode: Tone.ToneAudioNode = bufferSource;

//   // Mapeo de efectos a funciones de creación
//   const effectCreators = [
//     { enabled: effects.distortion?.enabled, creator: () => createDistortionNode(effects.distortion!) },
//     { enabled: effects.reverb?.enabled, creator: () => createReverbNode(effects.reverb!) },
//     { enabled: effects.vibrato?.enabled, creator: () => createVibratoNode(effects.vibrato!) },
//     { enabled: effects.chorus?.enabled, creator: () => createChorusNode(effects.chorus!) },
//     { enabled: effects.tremolo?.enabled, creator: () => createTremoloNode(effects.tremolo!) },
//     { enabled: effects.delay?.enabled, creator: () => createFeedbackDelayNode(effects.delay!) },
//     { enabled: effects.phaser?.enabled, creator: () => createPhaserNode(effects.phaser!) },
//     { enabled: effects.eq3?.enabled, creator: () => createEQ3Node(effects.eq3!) },
//     { enabled: effects.compressor?.enabled, creator: () => createCompressorNode(effects.compressor!) },
//     { enabled: effects.autoWah?.enabled, creator: () => createAutoWahNode(effects.autoWah!) }
//   ];
//   // Aplicar efectos con manejo de errores
//   effectCreators.forEach(({ enabled, creator }) => {
//     if (enabled) {
//       try {
//         const node = creator();
//         lastNode.disconnect(); // Desconectar seguro
//         lastNode.connect(node);
//         lastNode = node;
//         effectNodes.push(node);
//       } catch (error) {
//         console.warn(`Error al aplicar efecto: ${error}`);
//       }
//     }
//   });

//   // Conexión final con protección
//   lastNode.disconnect();
//   lastNode.connect(gainNode);
//   gainNode.toDestination();

//   return { bufferSource, effectNodes };
// }




// function createDistortionNode(params: NonNullable<Effects['distortion']>) {
//   return new Tone.Distortion({
//     distortion: params.distortion,
//     oversample: params.oversample,
//     wet: params.wet
//   });
// }



// function createReverbNode(params: NonNullable<Effects['reverb']>) {
//   return new Tone.Reverb({
//     decay: params.decay,
//     preDelay: params.preDelay,
//     wet: params.wet
//   });
// }

// function createVibratoNode(params: NonNullable<Effects['vibrato']>) {
//   return new Tone.Vibrato({
//     frequency: params.frequency,
//     depth: params.depth,
//     type: params.type,
//     maxDelay: params.maxDelay,
//     wet: params.wet
//   })
// }

// function createChorusNode(params: NonNullable<Effects['chorus']>) {
//   return new Tone.Chorus({
//     frequency: params.frequency,
//     delayTime: params.delayTime,
//     depth: params.depth,
//     feedback: params.feedback,
//     spread: params.spread,
//     type: params.type,
//     wet: params.wet
//   });
// }

// function createTremoloNode(params: NonNullable<Effects['tremolo']>) {
//   return new Tone.Tremolo({
//     frequency: params.frequency,
//     depth: params.depth,
//     spread: params.spread,
//     type: params.type,
//     wet: params.wet
//   }).start(); // Tremolo needs to be started
// }

// function createFeedbackDelayNode(params: NonNullable<Effects['delay']>) {
//   return new Tone.FeedbackDelay({
//     delayTime: params.delayTime,
//     feedback: params.feedback,
//     maxDelay: params.maxDelay,
//     wet: params.wet
//   });
// }

// function createPhaserNode(params: NonNullable<Effects['phaser']>) {
//   return new Tone.Phaser({
//     frequency: params.frequency,
//     octaves: params.octaves,
//     stages: params.stages,
//     Q: params.Q,
//     baseFrequency: params.baseFrequency,
//     wet: params.wet
//   });
// }

// function createEQ3Node(params: NonNullable<Effects['eq3']>) {
//   return new Tone.EQ3({
//     low: params.low,
//     mid: params.mid,
//     high: params.high,
//     lowFrequency: params.lowFrequency,
//     highFrequency: params.highFrequency,
//   });
// }

// function createCompressorNode(params: NonNullable<Effects['compressor']>) {
//   return new Tone.Compressor({
//     threshold: params.threshold,
//     ratio: params.ratio,
//     attack: params.attack,
//     release: params.release,
//     knee: params.knee,
//   })
// }

// function createAutoWahNode(params: NonNullable<Effects['autoWah']>) {
//   return new Tone.AutoWah({
//     baseFrequency: params.baseFrequency,
//     octaves: params.octaves,
//     sensitivity: params.sensitivity,
//     follower: params.follower,
//     Q: params.Q,
//     gain: params.gain,
//     wet: params.wet
//   })
// }





// function updateActiveNote(
//   rope: number,
//   chord: number,
//   source: Tone.ToneBufferSource,
//   effectNodes: Tone.ToneAudioNode[],
//   noteId: string,
//   startTime: number,
// ) {
//   activeNotes[rope] = { chord, source, effectNodes, noteId, startTime };
// }

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

function handlePreviousNotes(
  rope: number,
  chord: number,
  muteOnDifferentRope: boolean,
  muteOnSameRope: boolean,
  muteOnSameNote: boolean,
  holdMode: boolean,
  holdModeTime: number,
) {
  const previousNote = activeNotes[rope];
  const prevRope = previousNotePlayed?.rope;
  const now = Tone.now();

  // Función para programar la limpieza de una nota
  const scheduleCleanup = (note: ActiveNote, ropeNumber: number) => {

    if (note.timeoutId) clearTimeout(note.timeoutId);

    if (holdMode) {
      note.timeoutId = setTimeout(() => {
        if (activeNotes[ropeNumber]?.chord === note.chord) {
          cleanupNoteResources(note);
          console.log('silenciando nota ' + note.chord + ' en ' + holdModeTime + ' milisegundos')
          delete activeNotes[ropeNumber];
        }
      }, holdModeTime);
    } else {
      cleanupNoteResources(note);
      delete activeNotes[ropeNumber];
    }
  }

  const pausePreviousNote = (note: ActiveNote, ropeNumber: number) => {
    if (note.source) {

      if (holdMode) {
        try {
          note.source.stop(now + holdModeTime / 1000); // Pequeño fadeout
          console.log(`Nota pausada: ${note.chord}`);
        } catch (error) {
          console.warn("Error al pausar la nota anterior:", error);
        }

      } else {
        cleanupNoteResources(note);
        delete activeNotes[ropeNumber];

      }
    }
  };

  // 1. Manejo de notas en la misma cuerda
  if (previousNote) {
    if (previousNote.chord === chord) {
      // Misma nota
      if (muteOnSameNote) {
        console.log('Ha tocado la misma nota')
        // SOLUCIÓN: Forzar limpieza inmediata para notas repetidas
        // scheduleCleanup(previousNote, rope, true); // <-- isSameNote = true

        pausePreviousNote(previousNote, rope)

        // scheduleCleanup(previousNote, rope);

        // ...
      } else {
        console.log('No se va a silenciar la misma nota')
      }
    } else {
      // Nota diferente en misma cuerda
      if (muteOnSameRope) {
        // previousNote.source.stop(Tone.now() + 0.02);
        previousNote.source.stop(now + holdModeTime / 1000); // Pequeño fadeout
        scheduleCleanup(previousNote, rope);
      }

    }
  }



  // 2. Manejo de notas en cuerdas diferentes
  if (prevRope !== null && prevRope !== rope && activeNotes[prevRope]) {
    if (muteOnDifferentRope) {
      activeNotes[prevRope].source.stop(now + holdModeTime / 1000); // Pequeño fadeout
      scheduleCleanup(activeNotes[prevRope], prevRope);
    }
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



// TODO: IMPLEMENTAR ESTAS FUNCIONES PARA LOS EFECTOS DE SONIDO

// export function createEffectsChain(effects: Effects) {
//   const effectNodes: Tone.ToneAudioNode[] = [];
//   let lastNode: Tone.ToneAudioNode | null = null;

//   // Orden óptimo de efectos (puedes ajustarlo)
//   const effectsOrder = [
//     { type: 'distortion', creator: createDistortionNode },
//     { type: 'eq3', creator: createEQ3Node },
//     { type: 'compressor', creator: createCompressorNode },
//     { type: 'autoWah', creator: createAutoWahNode },
//     { type: 'phaser', creator: createPhaserNode },
//     { type: 'chorus', creator: createChorusNode },
//     { type: 'vibrato', creator: createVibratoNode },
//     { type: 'tremolo', creator: createTremoloNode },
//     { type: 'delay', creator: createFeedbackDelayNode },
//     { type: 'reverb', creator: createReverbNode }
//   ];

//   effectsOrder.forEach(({ type, creator }) => {
//     const effectConfig = effects[type as keyof Effects];
//     if (effectConfig?.enabled) {
//       const effectNode = creator(effectConfig);

//       if (lastNode) {
//         lastNode.disconnect();
//         lastNode.connect(effectNode);
//       }

//       lastNode = effectNode;
//       effectNodes.push(effectNode);
//     }
//   });

//   return { effectNodes, lastNode: lastNode || new Tone.Gain(1) };
// }



// // const effectsManager = new EffectsManager();

// export function playSoundWithEffects(
//   rope: number,
//   chord: number,
//   effects: Effects,
//   gain: number = 0.8
// ) {
//   // 1. Manejar notas anteriores
//   handlePreviousNotes(rope, chord);

//   // 2. Obtener buffer de audio
//   const buffer = getAudioBuffer(rope, chord);
//   if (!buffer) return;

//   // 3. Crear cadena de efectos optimizada
//   const effectChain = effectsManager.createEffectsChain(effects);

//   // 4. Configurar ganancia
//   const gainNode = new Tone.Gain(gain);

//   // 5. Crear fuente de audio con fade suave
//   const bufferSource = new Tone.ToneBufferSource({
//     buffer,
//     fadeIn: 0.03,
//     fadeOut: 0.1,
//     curve: "exponential"
//   });

//   // 6. Conectar la cadena de audio
//   bufferSource.chain(...effectChain, gainNode, Tone.Destination);

//   // 7. Programar reproducción
//   const now = Tone.now();
//   bufferSource.start(now);
//   bufferSource.stop(now + buffer.duration + 0.5);

//   // 8. Registrar la nota
//   registerActiveNote(rope, chord, bufferSource, [...effectChain, gainNode]);
// }


// export function playNoteWithEffects(
//   rope: number,
//   chord: number,
//   effects: Effects,
//   gain: number = 1
// ) {
//   // 1. Limpiar nota anterior si es necesario
//   cleanupPreviousNote(rope);

//   // 2. Crear cadena de efectos
//   const { effectNodes, lastNode } = createEffectsChain(effects);

//   // 3. Crear fuente de audio
//   const bufferSource = new Tone.ToneBufferSource({
//     url: getAudioUrl(rope, chord),
//     fadeIn: 0.01,
//     fadeOut: 0.05,
//     curve: "linear"
//   });

//   // 4. Configurar ganancia
//   const gainNode = new Tone.Gain(gain);

//   // 5. Conectar todo
//   bufferSource.chain(
//     ...effectNodes,
//     gainNode,
//     Tone.Destination
//   );

//   // 6. Programar reproducción
//   const now = Tone.now();
//   bufferSource.start(now);
//   bufferSource.stop(now + bufferSource.buffer.duration + 0.5);

//   // 7. Guardar referencia
//   activeNotes[rope] = {
//     chord,
//     source: bufferSource,
//     effectNodes: [gainNode, ...effectNodes],
//     noteId: generateNoteId(),
//     startTime: Date.now(),
//   };
// }

// // Versión optimizada que previene clipping
// function createStableEffectChain(effects: Effects): Tone.ToneAudioNode[] {
//   const enabledEffects: [string, any][] = Object.entries(effects)
//     .filter(([_, cfg]) => cfg?.enabled);

//   // Ordenar por consumo de CPU (de menor a mayor)
//   const effectPriority = [
//     'compressor', 'eq3',
//     'distortion', 'autoWah',
//     'phaser', 'chorus',
//     'vibrato', 'tremolo',
//     'delay', 'reverb'
//   ];

//   const sortedEffects = enabledEffects.sort((a, b) =>
//     effectPriority.indexOf(a[0]) - effectPriority.indexOf(b[0])
//   ).slice(0, 4); // Limitar a 4 efectos

//   const chain: Tone.ToneAudioNode[] = [];
//   let lastNode: Tone.ToneAudioNode = new Tone.Gain(1);

//   sortedEffects.forEach(([effectType, config]) => {
//     try {
//       const effect = createEffectNode(effectType, config);
//       lastNode.disconnect();
//       lastNode.connect(effect);
//       lastNode = effect;
//       chain.push(effect);

//       // Ajuste especial para evitar clipping
//       if (effectType === 'distortion') {
//         (effect as Tone.Distortion).wet.value = Math.min(config.wet || 0.5, 0.7);
//       }
//     } catch (error) {
//       console.error(`Error creating ${effectType}:`, error);
//     }
//   });

//   return chain;
// }


