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
  // effectsManager.disposeAll();
  delete activeNotes[rope];
}

// Detiene todas las notas que están sonando actualmente
export function muteAll(): void {
  Object.keys(activeNotes).forEach(ropeStr => {
    const rope = Number(ropeStr);
    const note = activeNotes[rope];
    if (note) effectsManager.disposeAll()
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
    // effectsManager.disposeAll();
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
  effects: Effects,
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

  try {
    // Crear y configurar nueva nota
    // const { bufferSource, effectNodes } = createStableAudioChain(player.buffer, effects, gain);

    // Crear cadena de audio optimizada
    const bufferSource = new Tone.ToneBufferSource({
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
    // const startTime = now + 0.01; // Pequeño offset para evitar cortes
    // bufferSource.start(startTime);
    // bufferSource.stop(startTime + bufferSource.buffer.duration + 0.1); // Margen adicional
    bufferSource.start(now);
    bufferSource.stop(now + bufferSource.buffer.duration + 0.1);

    // if (bufferSource.stop(now + bufferSource.buffer.duration + 0.1)) {
    //   console.log('PAUSA REPENTINA')
    // }
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

    // TODO: IMPRIMIR EN LA CONSOLA UN MENSAJE CUANDO LA NOTA TERMINA DE REPRODUCIRSE O CORTARSE EN ALGUN MOMENTO REPENTINO

    // Mensaje cuando termina la nota
    // setTimeout(() => {
    //   // Verifica que la nota sigue activa y es la misma
    //   if (activeNotes[rope]?.noteId === activeNotes[rope]?.noteId) {
    //     console.log(`Nota finalizada: cuerda ${rope}, acorde ${chord}`);
    //     // Limpieza si es necesario
    //     // cleanupPreviousNote(rope);

    //   }
    // }, (bufferSource.buffer.duration + 0.1) * 1000);
    // ...existing code...


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

      // TODO: ¿ES EL UNICO SETTIMEOUT?
      note.timeoutId = setTimeout(() => {
        console.log('SHEDULECLEANUP, la nota anterior: ' + note.chord + ' fue silenciada en ' + holdModeTime + ' milisegundos porque ha tocado otra nota')
        // cleanupNoteResources(note);

        // Si es la misma nota...
        if (activeNotes[ropeNumber]?.noteId === note.noteId) {
          cleanupNoteResources(note);
          console.log('CODIGO MUERTO, DEBE SER ELIMINADO')
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

      if (note.timeoutId) clearTimeout(note.timeoutId);

      if (holdMode) {
        try {
          // note.source.stop(now + holdModeTime / 1000); // Pequeño fadeout
          // console.log(`Nota pausada: ${note.chord}`);

          note.timeoutId = setTimeout(() => {
            note.source.stop(now + holdModeTime / 1000); // Pequeño fadeout

            // TODO: NO IMPLEMENTAR ESTO, EVITA QUE SUENE LA MISMA NOTA CON ALGUN EFECTO DE SONIDO
            // effectsManager.disposeAll();
            cleanupNoteResources(note);
            console.log(`pausePreviousNote, Nota pausada: ${note.chord} en ${holdModeTime / 1000} segundos`);
          }, holdModeTime);


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
        console.log('ACTIVADO muteOnSameNote')

        previousNote.source.stop(now + holdModeTime / 1000); // Pequeño fadeout
        console.log('Ha tocado la misma nota')

        pausePreviousNote(previousNote, rope)

      } else {
        console.log('No se va a silenciar la misma nota')
      }
    } else {
      // Nota diferente en misma cuerda
      if (muteOnSameRope) {

        console.log('ACTIVADO muteOnSameRope')
        // previousNote.source.stop(Tone.now() + 0.02);
        previousNote.source.stop(now + holdModeTime / 1000); // Pequeño fadeout
        scheduleCleanup(previousNote, rope);
      }

    }
  }



  // 2. Manejo de notas en cuerdas diferentes
  if (prevRope !== null && prevRope !== rope && activeNotes[prevRope]) {
    if (muteOnDifferentRope) {
      console.log('ACTIVADO muteOnDifferentRope')

      activeNotes[prevRope].source.stop(now + holdModeTime / 1000); // Pequeño fadeout
      scheduleCleanup(activeNotes[prevRope], prevRope);
    }
  }


}



// Nueva función para limpieza segura
function cleanupNoteResources(note: ActiveNote) {
  if (note.timeoutId) {
    clearTimeout(note.timeoutId);
  }

  if (!note.source) return;

  try {
    console.log("Iniciando limpieza suave de nota");

    note.source.stop();

    // 1. Aplicar fadeout suave al volumen principal
    const fadeDuration = 0.2; // 200ms para fadeout
    // note.source.volume.rampTo(-Infinity, fadeDuration);

    // 2. Aplicar fadeout a los efectos (si tienen parámetro wet)
    note.effectNodes.forEach(node => {
      if ('wet' in node) {
        (node.wet as Tone.Param).rampTo(0, fadeDuration);
      }
    });

    // 3. Programar la limpieza después del fadeout
    setTimeout(() => {
      try {
        // 4. Detener y liberar recursos después del fade
        note.source.stop();
        note.source.dispose();

        // 5. Limpiar solo los efectos únicos de esta nota
        effectsManager.disposeChain(note.effectNodes);
        // effectsManager.disposeAll();
        console.log("Limpieza completada después de fadeout");
      } catch (error) {
        console.warn("Error en limpieza post-fade:", error);
      }
    }, fadeDuration * 1000); // Convertir a milisegundos

  } catch (error) {
    console.warn("Error durante el proceso de fadeout:", error);
    // Fallback: limpieza inmediata si hay error
    note.source.stop();
    note.source.dispose();
    effectsManager.disposeChain(note.effectNodes);
  }
}
// TODO: IMPLEMENTE ESTO
// effectsManager.disposeChain(note.effectNodes);

// TODO: ¿PARA QUE SIRVE ESTO? --> ELIMINA TODOS LOS EFECTOS DE SONIDO (HACER CLIC EN EL BÓTON DE SILENCIAR TODO, FUNCIONA, HACE COMO UN 'REINICIO' Y LAS NOTAS VUELVEN A SONAR)
// effectsManager.disposeAll();
