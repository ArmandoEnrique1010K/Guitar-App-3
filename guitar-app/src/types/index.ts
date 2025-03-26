
export type Neck = {
  rope: number
  frets: Frets
}[]

export type Frets = {
  chord: number
  file: string
  key?: string
}[]


export type GainEffect = {
  gain: number
}

export type DistortionEffect = {
  enabled: boolean;
  distortion: number;        // nivel de distorsión (0 a 1)
  oversample: "none" | "2x" | "4x";
  wet: number;
}

export type ReverbEffect = {
  enabled: boolean;
  decay: number;            // segundos de decaimiento
  preDelay: number;         // segundos de retardo antes del reverb
  wet: number;              // seco o humedo
}

export type VibratoEffect = {
  enabled: boolean;
  frequency: number;        // frecuencia de vibrato en Hz
  depth: number;            // intensidad (0 a 1)
  type: "sine" | "square" | "triangle" | "sawtooth";
  maxDelay: number;         // retardo máximo interno del vibrato
  wet: number
}

export type Effects = {
  gain?: GainEffect,
  distortion?: DistortionEffect,
  reverb?: ReverbEffect,
  vibrato?: VibratoEffect
}