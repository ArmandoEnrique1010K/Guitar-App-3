// effectPresets.ts
export const EffectPresets = {
  CLEAN: {
    compressor: { enabled: true, threshold: -24, ratio: 4, attack: 0.003, release: 0.25 },
    eq3: { enabled: true, low: 0, mid: 0, high: 0 }
  },
  ROCK: {
    distortion: { enabled: true, distortion: 0.5, wet: 0.7 },
    reverb: { enabled: true, decay: 1.2, wet: 0.3 },
    compressor: { enabled: true, threshold: -18, ratio: 6 }
  },
  METAL: {
    distortion: { enabled: true, distortion: 0.8, oversample: '4x', wet: 0.8 },
    eq3: { enabled: true, low: 4, mid: -2, high: 3 },
    compressor: { enabled: true, threshold: -12, ratio: 8 }
  },
  AMBIENT: {
    reverb: { enabled: true, decay: 4.5, wet: 0.6 },
    delay: { enabled: true, delayTime: '8n.', feedback: 0.5, wet: 0.4 },
    chorus: { enabled: true, frequency: 1.5, delayTime: 3.5, wet: 0.3 }
  }
};

export type PresetName = keyof typeof EffectPresets;
