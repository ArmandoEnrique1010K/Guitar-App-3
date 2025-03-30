// Importa la librería Tone.js
import * as Tone from "tone";
import { Effects } from "../types";


// Configurar prioridad de programación en Tone.js para mejorar la estabilidad

type ActiveNote = {
  chord: number;
  source: Tone.ToneBufferSource;
  effectNodes: Tone.ToneAudioNode[]; // Almacena los nodos de efectos
}

// Objeto para rastrear el estado de las teclas en reproducción activa
const activeKeys: { [key: string]: boolean } = {};
// Objeto para almacenar los reproductores
const players: { [key: string]: Tone.Player } = {};

// Objeto para guardar la nota activa para cada cuerda
const activeNotes: { [key: number]: ActiveNote | undefined } = {};

// const activeNotes: { [key: number]: { chord: number; source: Tone.ToneBufferSource } | undefined } = {};

// Objeto para guardar la nota tocada anteriormente
let previousNotePlayed: { rope: number | null; chord: number | null } = { rope: null, chord: null };

// Almacena el valor devuelto por la función (mp3, wav o null)
// const format = audioFormat();

// Función para precargar sonidos en función del nombre de la carpeta
export function preloadSounds(name: string) {
  // Salir si el formato de audio no es soportado (return hace esa acción)
  // if (!format) return;

  // Ruta hacia la carpeta que contiene las notas de la guitarra
  // Utiliza Template String para establecer el nombre de la carpeta y el tipo de archivo soportado por el navegador
  // Ejemplo: /audio/cleanSolo/mp3/
  const audioPath = `assets/audio/${name}`;

  // El siguiente arreglo contiene los nombres de los archivos de audio que se van a pre-cargar

  // TODO: AQUI DEBERIA 
  const audioFiles = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
  ];

  // // Alternativa para crear el arreglo usando un bucle
  // // Array.from es un metodo estatico que crea una nueva instancia de un arreglo a partir de un objeto iterable.
  // // { length: 16 } crea un objeto con una propiedad "length" de 16, lo que define el tamaño del arreglo.
  // const audioFiles = Array.from({ length: 46 }, (_, i) =>
  // // convierte el índice i en una cadena y agrega ceros a la izquierda para que tenga al menos 2 dígitos.
  //   i.toString().padStart(2, "0")
  // );
  // // Por ejemplo, el índice 1 se convierte en "01", 2 en "02", y así sucesivamente hasta 46.

  // Itera por cada elemento del arreglo audioFiles
  audioFiles.forEach((file) => {
    // Define la ruta hacia el nombre del archivo de audio
    // Ejemplo: /audio/cleanSolo/mp3/00.mp3
    const audioFile = `${audioPath}/${file}.mp3`;

    // Crea un nuevo player o reproductor solo si no existe ya en el objeto players
    if (!players[audioFile]) {
      //
      // El constructor Tone.Player es un reproductor de archivos de audio con funciones de inicio, bucle y parada.
      players[audioFile] = new Tone.Player({
        // Contiene los siguientes 2 parametros (ruta de la ubicación del archivo de audio y un valor booleano para
        // indicar si se va reproducir automaticamente)
        url: audioFile,
        autostart: false,
        // Evento que se ejecuta luego de cargar el archivo
        onload: () => {
          // console.log(`Se cargo el archivo que se encuentra en ${audioFile}`);
        },
        // Evento que se ejecuta si hay un error al cargar el archivo
        onerror: (error) => {
          console.error(
            `Error al cargar el archivo que se encuentra en ${audioFile}:`,
            error
          );
        },
      });

      // Por lo general el metodo toDestination del constructor Tone.Player sirve para "conectar la salida al nodo de destino del contexto".
      players[audioFile].toDestination();
    }
  });
}

export function cleanupPreviousNote(rope: number) {
  if (activeNotes[rope]) {
    // Detener y desconectar la fuente
    activeNotes[rope]?.source.stop();
    activeNotes[rope]?.source.dispose();

    // Limpiar nodos de efectos
    activeNotes[rope]?.effectNodes.forEach(node => {
      node.dispose();
    });

    delete activeNotes[rope];
  }
}



// Función para reproducir un sonido, requiere 8 argumentos
export function playSound(
  // Nombre de la carpeta
  name: string,
  // Arreglo con los datos de las cuerdas y acordes
  data: { rope: number; frets: { chord: number; file: string }[] }[] = [],
  // Número de cuerda
  rope: number,
  // Número de acorde
  chord: number,
  // Modo de silencio en diferentes cuerdas
  muteOnDifferentRope: boolean,
  // Nivel de volumen
  // volume,
  // Tecla presionada en el teclado
  keyfromkeyboard: string,
  // Indicador de si la reproducción es mediante un clic
  clickMode: boolean,
  // Efectos de sonido
  effects: Effects
) {
  // 1. Asegurarse que el contexto de audio esté iniciado
  // if (Tone.context.state !== 'running') {
  //   Tone.start().then(() => {
  //     console.log('AudioContext iniciado');
  //     // Volver a llamar a playSound después de iniciar el contexto
  //     playSound(name, data, rope, chord, muteOnDifferentRope, keyfromkeyboard, clickMode, effects);
  //   });
  //   return;
  // }


  // Verificación de teclado y limpieza previa (mantener igual)
  if (keyfromkeyboard && !clickMode && activeKeys[keyfromkeyboard]) {
    return;
  }

  if (keyfromkeyboard && !clickMode) {
    activeKeys[keyfromkeyboard] = true;
  }

  const audioPath = `/audio/${name}/`;
  const ropeData = data.find((note) => note.rope === rope);
  if (!ropeData) {
    console.log("Cuerda no encontrada.");
    return;
  }
  const fretData = ropeData.frets.find((fret) => fret.chord === chord);
  if (!fretData) {
    console.log("Acorde no encontrado para esta cuerda.");
    return;
  }

  const audioFile = `assets${audioPath}${fretData.file}.mp3`;
  const player = players[audioFile];

  if (!player || !player.loaded) {
    console.error("Reproductor no disponible o archivo no cargado:", audioFile);
    return;
  }


  // Verifica si la nota anterior es la misma que la actual y la detiene si es así
  // Esto evita que se reproduzca la misma nota repetidamente cuando ya está sonando
  if (
    // Verifica que haya una nota activa en la cuerda
    activeNotes[rope] &&
    // Verifica que el acorde es el mismo
    activeNotes[rope].chord === chord &&
    // Verifica que existe una fuente de audio activa
    activeNotes[rope].source
  ) {
    // Detiene la fuente de audio actual
    activeNotes[rope].source.stop();
    console.log(`Nota anterior (${rope}, ${chord}) detenida.`);
  }

  // Detiene la nota anterior si se toca nuevamente la misma cuerda, incluso si el acorde es distinto
  // Esto asegura que solo una nota suene por cuerda a la vez
  if (
    activeNotes[rope] &&
    // Verifica que la cuerda es la misma
    ropeData.rope === rope &&
    activeNotes[rope].source
  ) {
    // Detiene la fuente de audio actual en esa cuerda
    activeNotes[rope].source.stop();
    console.log(
      `Nota anterior (${rope}, ${chord}) detenida porque ha tocado la misma cuerda.`
    );
  }

  // Si `muteOnDifferentRope` es true, detiene la nota anterior al cambiar de cuerda
  // Esto permite que una nueva nota silencie cualquier otra nota que esté sonando en una cuerda diferente
  if (
    // Verifica que haya una nota tocada previamente
    previousNotePlayed &&
    // Verifica que la nota anterior tiene una cuerda válida
    previousNotePlayed.rope !== null &&
    // Asegura que la cuerda anterior es distinta a la actual
    previousNotePlayed.rope !== rope &&
    // Verifica que hay una nota activa en la cuerda anterior
    activeNotes[previousNotePlayed.rope] &&
    // Verifica que la fuente de audio de la nota anterior sigue activa
    activeNotes[previousNotePlayed.rope]?.source &&
    // Verifica si el modo de silencio entre cuerdas está activado
    muteOnDifferentRope === true
  ) {
    activeNotes[previousNotePlayed.rope]?.source.stop(); // Detiene la nota anterior
    console.log(
      `Nota anterior (${previousNotePlayed.rope}, ${previousNotePlayed.chord}) detenida porque muteOnDifferentRope está en true.`
    );

    delete activeNotes[previousNotePlayed.rope];
  }

  // Antes de crear nuevos nodos, limpia los anteriores
  cleanupPreviousNote(rope);

  // Crear buffer source
  const bufferSource = new Tone.ToneBufferSource(player.buffer);

  console.log(player.buffer)
  const gainNode = new Tone.Gain(effects.gain!.gain || 0)

  // TODO: PORQUE CUANDO COLOCO .toDestination() COMIENZA A SONAR, PERO NO APLICA LAS DEMÁS CONDICIONES COMO SI SUBO EL VOLUMEN NO SUENA O CUANDO TOCO UNA CUERDA DISTINTA NO MANTIENE SONANDO LA NOTA ANTERIOR
  // bufferSource.connect(gainNode)


  // TODO: EL ERROR PUEDE PROVENIR DE AQUI
  // Almacenar nodos para limpieza posterior
  const effectNodes: Tone.ToneAudioNode[] = [gainNode];
  // Configurar la cadena de audio básica
  let lastNode: Tone.ToneAudioNode = bufferSource;

  // Crear y conectar otros efectos si están habilitados
  if (effects.distortion?.enabled) {
    const distortionNode = new Tone.Distortion({
      distortion: effects.distortion.distortion,
      oversample: effects.distortion.oversample,
      wet: effects.distortion.wet,
    })

    lastNode.connect(distortionNode);
    lastNode = distortionNode;
    effectNodes.push(distortionNode);

    // .connect(gainNode);
    // bufferSource.disconnect();

    // TODO: LO MISMO OCURRE CUANDO COLOCO .toDestination(), PERO NO APLICA LA DISTORSIÓN 
    // bufferSource.connect(distortionNode).toDestination()
    // effectNodes.push(distortionNode)

    // console.log('EFECTO DE SONIDO DISTORSIÓN')
  }

  if (effects.reverb?.enabled) {
    const reverbNode = new Tone.Reverb({
      decay: effects.reverb.decay,
      preDelay: effects.reverb.preDelay,
      wet: effects.reverb.wet,
    })

    // .connect(gainNode);
    // bufferSource.disconnect();
    // bufferSource.connect(reverbNode);

    lastNode.connect(reverbNode);
    lastNode = reverbNode;
    effectNodes.push(reverbNode);

  }

  if (effects.vibrato?.enabled) {
    const vibratoNode = new Tone.Vibrato({
      frequency: effects.vibrato.frequency,
      depth: effects.vibrato.depth,
      type: effects.vibrato.type,
      maxDelay: effects.vibrato.maxDelay,
      wet: effects.vibrato.wet,
    })
    // .connect(gainNode);
    // bufferSource.disconnect();
    // bufferSource.connect(vibratoNode);

    lastNode.connect(vibratoNode);
    lastNode = vibratoNode;
    effectNodes.push(vibratoNode);

  }

  if (effects.chorus?.enabled) {
    const chorusNode = new Tone.Chorus({
      delayTime: effects.chorus.delayTime,
      depth: effects.chorus.depth,
      feedback: effects.chorus.feedback,
      frequency: effects.chorus.frequency,
      spread: effects.chorus.spread,
      type: effects.chorus.type,
      wet: effects.chorus.wet,
    })
    // .connect(gainNode);
    // bufferSource.disconnect();
    // bufferSource.connect(chorusNode);

    lastNode.connect(chorusNode);
    lastNode = chorusNode;
    effectNodes.push(chorusNode);
  }

  if (effects.tremolo?.enabled) {
    const tremoloNode = new Tone.Tremolo({
      frequency: effects.tremolo.frequency,
      depth: effects.tremolo.depth,
      spread: effects.tremolo.spread,
      type: effects.tremolo.type,
      wet: effects.tremolo.wet,
    }).start()

    // .connect(gainNode);
    // bufferSource.disconnect();
    // bufferSource.connect(tremoloNode);

    lastNode.connect(tremoloNode);
    lastNode = tremoloNode;
    effectNodes.push(tremoloNode);
  }

  if (effects.delay?.enabled) {
    const delayNode = new Tone.FeedbackDelay({
      delayTime: effects.delay.delayTime,
      feedback: effects.delay.feedback,
      maxDelay: effects.delay.maxDelay,
      wet: effects.delay.wet,
    })

    // .connect(gainNode);
    // bufferSource.disconnect();
    // bufferSource.connect(delayNode);

    lastNode.connect(delayNode);
    lastNode = delayNode;
    effectNodes.push(delayNode);
  }

  if (effects.phaser?.enabled) {
    const phaserNode = new Tone.Phaser({
      frequency: effects.phaser.frequency,
      octaves: effects.phaser.octaves,
      stages: effects.phaser.stages,
      Q: effects.phaser.Q,
      baseFrequency: effects.phaser.baseFrequency,
      wet: effects.phaser.wet,
    })

    // .connect(gainNode);
    // bufferSource.disconnect();
    // bufferSource.connect(phaserNode);

    lastNode.connect(phaserNode);
    lastNode = phaserNode;
    effectNodes.push(phaserNode);
  }

  if (effects.eq3?.enabled) {
    const eq3Node = new Tone.EQ3({
      low: effects.eq3.low,
      mid: effects.eq3.mid,
      high: effects.eq3.high,
      lowFrequency: effects.eq3.lowFrequency,
      highFrequency: effects.eq3.highFrequency,
    })

    // .connect(gainNode);
    // bufferSource.disconnect();
    // bufferSource.connect(eq3Node);

    lastNode.connect(eq3Node);
    lastNode = eq3Node;
    effectNodes.push(eq3Node);

  }

  // Conectar el último nodo al gainNode
  lastNode.connect(gainNode);

  // Conectar el gainNode al destino final (SOLO UNA VEZ)
  gainNode.toDestination();

  // Configurar tiempo de inicio
  const now = Tone.now();
  bufferSource.start(now);
  bufferSource.stop(now + bufferSource.buffer.duration);

  // console.log('Player state:', {
  //   loaded: player.loaded,
  //   buffer: player.buffer,
  //   duration: player.buffer?.duration
  // });


  // Tone.Draw.schedule(() => {
  //   console.log("Audio context estado:", Tone.context.state);
  //   console.log('Current time:', Tone.now());

  //   console.log("Número de nodos activos:", /* contador de nodos */);
  // }, now);


  // si un nodo es null, no lo agregas
  // Almacenar todo junto
  activeNotes[rope] = {
    chord,
    source: bufferSource,
    effectNodes
  };

  // Alamacena la nota anterior
  previousNotePlayed = { rope, chord };

  console.log(`Reproduciendo la nota ${rope}, ${chord} desde audioPlayer`);

  // Almacena la nueva cuerda activa
  // activeNotes[rope] = { chord, source: bufferSource };


  // Agrega un listener global solo si se usa una tecla
  if (keyfromkeyboard && clickMode === false) {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === keyfromkeyboard) {
        activeKeys[keyfromkeyboard] = false;
        document.removeEventListener("keyup", handleKeyUp);
      }
    };

    document.addEventListener("keyup", handleKeyUp);
  }

  // Resetea el estado de la tecla después del clic
  if (clickMode === true) {
    // console.log(clickMode);
    // console.log("Modo de clic activado para la reproducción de la nota.");
    activeKeys[keyfromkeyboard] = false;
  }

}

// // Función para silenciar todas las notas activas en todas las cuerdas
// export function muteAll() {
//   // Itera sobre cada cuerda en el objeto activeNotes
//   for (const rope in activeNotes) {
//     // Verifica que la propiedad pertenece a activeNotes y no a su prototipo
//     // Sintaxis correcta hasOwnProperty.call
//     if (!Object.prototype.hasOwnProperty.call(activeNotes, rope)) {
//       const note = activeNotes[rope];

//       // Si la nota en esta cuerda tiene una fuente de audio activa, la detiene
//       if (note?.source) {
//         // Detener la reproducción de audio
//         note.source.stop();
//         console.log(`Nota en cuerda ${rope} silenciada.`);
//       }

//       // Elimina la referencia de la nota en activeNotes para liberar recursos
//       delete activeNotes[rope];
//     }
//   }

//   // Restablece el registro de la última nota reproducida para indicar que no hay ninguna nota activa
//   previousNotePlayed = { rope: null, chord: null };
//   console.log("Todas las notas han sido silenciadas.");
// }


export function muteAll() {
  for (const rope in activeNotes) {
    if (Object.prototype.hasOwnProperty.call(activeNotes, rope)) {
      const note = activeNotes[rope];
      if (note) {
        note.source.stop();
        note.source.dispose();
        note.effectNodes.forEach(node => node.dispose());
        delete activeNotes[rope];
      }
    }
  }
  previousNotePlayed = { rope: null, chord: null };
}

// Función para silenciar solo la nota actualmente activa en la cuerda previa
export function muteCurrentNote() {
  const { rope, chord } = previousNotePlayed;

  // Verifica si hay una nota activa previa que pueda ser silenciada
  if (rope !== null && chord !== null) {
    const note = activeNotes[rope];

    // Si existe una fuente de audio activa en la cuerda previa, la detiene
    if (note && note.source) {
      // Detener la reproducción de audio de la nota actual
      note.source.stop();
      console.log(
        `Nota en cuerda ${rope}, acorde ${chord} ha sido silenciada.`
      );

      // Elimina la referencia de la nota actual en activeNotes para liberar recursos
      delete activeNotes[rope];
    } else {
      console.log("No hay ninguna nota activa para silenciar.");
    }

    // Restablece previousNotePlayed para indicar que no hay ninguna nota activa actualmente
    previousNotePlayed = { rope: null, chord: null };
  } else {
    console.log("No hay ninguna nota activa para silenciar.");
  }
}