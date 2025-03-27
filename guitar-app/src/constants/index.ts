import { ChorusEffect, DelayEffect, DistortionEffect, PhaserEffect, ReverbEffect, TremoloEffect, VibratoEffect } from "../types"

// TIEMPO DE CARGA INICIAL
export const LOADING_TIME = 1000

// TECLAS POR UNA FILA
export const kEYSBYROW = 11

// TIPOS DE ASIGNACIÓN DE FILAS DEL TECLADO
export const FIRST: number[] = [0, 1, 2, 3, 4, 5]
export const LAST = [4, 5, 0, 1, 2, 3]
export const MIDDLE = [4, 0, 1, 2, 3, 5]
export const ALTERNATE = [0, 1, 4, 5, 2, 3]

// VALORES INICIALES
export const INITIAL_DISTORTION: DistortionEffect = {
  enabled: false,
  distortion: 0.4,
  oversample: "none",
  wet: 1,
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
