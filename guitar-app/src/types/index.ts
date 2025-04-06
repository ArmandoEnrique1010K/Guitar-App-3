import * as Tone from "tone";

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

export type ChorusEffect = {
  enabled: boolean;
  delayTime: number;        // tiempo de retardo en segundos
  depth: number;            // intensidad del efecto (0 a 1)
  feedback: number;         // retroalimentación del efecto (0 a 1)
  frequency: number;        // frecuencia del LFO en Hz
  spread: number;           // separación estéreo en grados
  type: "sine" | "square" | "triangle" | "sawtooth"; // forma de onda del LFO
  wet: number;              // mezcla del efecto (0 a 1)
}



export interface TremoloEffect {
  enabled: boolean;
  frequency: number;
  depth: number;
  spread: number;
  type: "sine" | "square" | "triangle" | "sawtooth";
  wet: number;
}

export type DelayEffect = {
  enabled: boolean;
  delayTime: number; // en segundos
  feedback: number; // 0 a 1
  maxDelay: number // segundos
  wet: number; // 0 a 1
};

export type PhaserEffect = {
  enabled: boolean;
  frequency: number; // Frecuencia de modulación en Hz
  octaves: number; // Cantidad de octavas para el barrido
  stages: number; // Cantidad de filtros internos (debe ser par)
  Q: number; // Factor de calidad de los filtros
  baseFrequency: number; // Frecuencia base del efecto
  wet: number; // Mezcla del efecto
};

export type EQ3Effect = {
  enabled: boolean;
  low: number;
  mid: number;
  high: number;
  lowFrequency: number;
  highFrequency: number;
};

export type CompressorEffect = {
  enabled: boolean;
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
  knee: number;
};

export type AutoWahEffect = {
  enabled: boolean;
  baseFrequency: number;
  octaves: number;
  sensitivity: number;
  Q: number;
  gain: number;
  follower: number;
  wet: number;
};

export type Effects = {
  // gain?: GainEffect,
  distortion?: DistortionEffect,
  reverb?: ReverbEffect,
  vibrato?: VibratoEffect
  chorus?: ChorusEffect
  tremolo?: TremoloEffect
  delay?: DelayEffect
  phaser?: PhaserEffect
  eq3?: EQ3Effect
  compressor?: CompressorEffect
  autoWah?: AutoWahEffect
}

export type PartialEffects = {
  distortion?: Partial<DistortionEffect>;
  eq3?: Partial<EQ3Effect>;
  autoWah?: Partial<AutoWahEffect>;
  phaser?: Partial<PhaserEffect>;
  chorus?: Partial<ChorusEffect>;
  vibrato?: Partial<VibratoEffect>;
  tremolo?: Partial<TremoloEffect>;
  delay?: Partial<DelayEffect>;
  reverb?: Partial<ReverbEffect>;
  compressor?: Partial<CompressorEffect>;
}

export type Note = {
  rope: number | null;
  chord: number | null;
}


export type ActiveNote = {
  chord: number;
  source: Tone.ToneBufferSource;
  effectNodes: Tone.ToneAudioNode[]; // Almacena los nodos de efectos
  timeoutId?: NodeJS.Timeout; // Para manejar los timeouts

  // npm install --save-dev @types/node

}

export type PreviousNote = {
  rope: number | null;
  timeoutId?: NodeJS.Timeout; // Para manejar los timeouts

  chord: number | null
}

export type PlaySoundParams = {
  name: string;
  data: { rope: number; frets: { chord: number; file: string }[] }[];
  rope: number;
  chord: number;
  muteOnDifferentRope: boolean;
  keyFromKeyboard: string;
  clickMode: boolean;
  effects: Effects;
}