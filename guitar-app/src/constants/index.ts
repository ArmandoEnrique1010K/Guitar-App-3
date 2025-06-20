import { AutoWahEffect, ChorusEffect, CompressorEffect, DelayEffect, DistortionEffect, EQ3Effect, PhaserEffect, ReverbEffect, TremoloEffect, VibratoEffect } from "../types"
import { DISTORTION_DISTORTION_DEFAULT, DISTORTION_OVERSAMPLE_DEFAULT, DISTORTION_WET_DEFAULT } from "./effectsProperties"

// TIEMPO DE CARGA INICIAL
export const LOADING_TIME = 2000

// TECLAS POR UNA FILA
export const kEYSBYROW = 11

// TIPOS DE ASIGNACIÓN DE FILAS DEL TECLADO
export const FIRST: number[] = [0, 1, 2, 3, 4, 5]
export const LAST = [4, 5, 0, 1, 2, 3]
export const MIDDLE = [4, 0, 1, 2, 3, 5]
export const ALTERNATE = [0, 1, 4, 5, 2, 3]

export const DEFAULT_KEYS: number[] = [5, 4, 3, 2, 1, 0]

export const INITIAL_MESSAGE = "Bienvenido, recuerde desactivar la tecla BLOQ MAYUS para tocar las notas. En el caso de que si se entrecorta el audio, pulsa el botón 'Silenciar Todo'"

// VALORES INICIALES
export const INITIAL_DISTORTION: DistortionEffect = {
  enabled: false,
  distortion: DISTORTION_DISTORTION_DEFAULT,
  oversample: DISTORTION_OVERSAMPLE_DEFAULT,
  wet: DISTORTION_WET_DEFAULT,
};

export const INITIAL_REVERB: ReverbEffect = {
  enabled: false,
  decay: 1.5,
  preDelay: 0.01,
  wet: 1,
}

export const INITIAL_VIBRATO: VibratoEffect = {
  enabled: false,
  depth: 0.1,
  frequency: 5,
  maxDelay: 0.005,
  type: "sine",
  wet: 1,
}

export const INITIAL_CHORUS: ChorusEffect = {
  enabled: false,
  delayTime: 3.5,
  depth: 0.7,
  feedback: 0.4, // Default value for feedback is typically around 0.4
  frequency: 1.5,
  spread: 180,
  type: "sine",
  wet: 1
}

export const INITIAL_TREMOLO: TremoloEffect = {
  enabled: false,
  frequency: 5, // Frecuencia en Hz (valor típico entre 1 y 10)
  depth: 0.5, // Profundidad del efecto (0 a 1)
  spread: 180, // Extensión del efecto estéreo (0 a 360)
  type: "sine", // Forma de onda
  wet: 0.5, // Cantidad del efecto aplicado (0 a 1)
};

export const INITIAL_DELAY: DelayEffect = {
  enabled: false,
  delayTime: 0.25, // 250ms de retardo
  feedback: 0.5, // 50% del sonido se retroalimenta
  maxDelay: 0.005,
  wet: 0.5, // Mezcla del efecto
};

export const INITIAL_PHASER: PhaserEffect = {
  enabled: false,
  frequency: 0.5, // 0.5 Hz de modulación
  octaves: 3, // 3 octavas de barrido
  stages: 10, // Debe ser un número par
  Q: 10, // Factor de calidad
  baseFrequency: 350, // 350 Hz
  wet: 0.5, // Mezcla del efecto
};

export const INITIAL_EQ3: EQ3Effect = {
  enabled: false,
  low: 0,
  mid: 0,
  high: 0,
  lowFrequency: 400,  // Hz
  highFrequency: 2500, // Hz
}

export const INITIAL_COMPRESSOR: CompressorEffect = {
  enabled: false,
  threshold: -24, // dB
  ratio: 4, // Relación 4:1
  attack: 0.003, // Segundos (3ms)
  release: 0.25, // Segundos (250ms)
  knee: 30, // dB
}

export const INITIAL_AUTOWAH: AutoWahEffect = {
  enabled: false,
  baseFrequency: 100, // Hz
  octaves: 6,
  sensitivity: 0.5, // dB
  follower: 1, // s
  Q: 2,
  gain: 5,
  wet: 1
}