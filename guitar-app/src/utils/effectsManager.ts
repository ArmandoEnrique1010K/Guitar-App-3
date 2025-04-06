// effectsManager.ts
import * as Tone from 'tone';
import { Effects } from '../types';

export class EffectsManager {
  private activeEffects: Tone.ToneAudioNode[] = [];
  private maxEffects = 4; // Límite para evitar problemas de rendimiento

  createEffectsChain(effects: Effects): Tone.ToneAudioNode[] {
    // Limpiar efectos anteriores
    this.disposeAllEffects();

    // Orden recomendado de efectos (puedes ajustarlo)
    const effectsPipeline = [
      this.createDistortion(effects.distortion),
      this.createEQ3(effects.eq3),
      this.createCompressor(effects.compressor),
      this.createAutoWah(effects.autoWah),
      this.createPhaser(effects.phaser),
      this.createChorus(effects.chorus),
      this.createVibrato(effects.vibrato),
      this.createTremolo(effects.tremolo),
      this.createDelay(effects.delay),
      this.createReverb(effects.reverb)
    ].filter(Boolean).slice(0, this.maxEffects) as Tone.ToneAudioNode[];

    this.activeEffects = effectsPipeline;
    return effectsPipeline;
  }

  private createDistortion(config?: Effects['distortion']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    return new Tone.Distortion({
      distortion: config.distortion,
      oversample: config.oversample,
      wet: config.wet
    });
  }

  private createReverb(config?: Effects['reverb']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    const reverb = new Tone.Reverb({
      decay: config.decay,
      preDelay: config.preDelay,
      wet: config.wet
    });
    reverb.generate().catch(console.error);
    return reverb;
  }

  private createEQ3(config?: Effects['eq3']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    return new Tone.EQ3({
      low: config.low,
      mid: config.mid,
      high: config.high,
      lowFrequency: config.lowFrequency,
      highFrequency: config.highFrequency,
    });
  }

  private createCompressor(config?: Effects['compressor']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    return new Tone.Compressor({
      threshold: config.threshold,
      ratio: config.ratio,
      attack: config.attack,
      release: config.release,
      knee: config.knee
    });
  }

  private createAutoWah(config?: Effects['autoWah']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    return new Tone.AutoWah({
      baseFrequency: config.baseFrequency,
      octaves: config.octaves,
      sensitivity: config.sensitivity,
      Q: config.Q,
      gain: config.gain,
      follower: config.follower,
      wet: config.wet
    });
  }

  private createPhaser(config?: Effects['phaser']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    return new Tone.Phaser({
      frequency: config.frequency,
      octaves: config.octaves,
      stages: config.stages,
      Q: config.Q,
      baseFrequency: config.baseFrequency,
      wet: config.wet
    });
  }

  private createChorus(config?: Effects['chorus']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    return new Tone.Chorus({
      frequency: config.frequency,
      delayTime: config.delayTime,
      depth: config.depth,
      feedback: config.feedback,
      spread: config.spread,
      wet: config.wet,
      type: config.type
    }).start();
  }

  private createVibrato(config?: Effects['vibrato']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    return new Tone.Vibrato({
      frequency: config.frequency,
      depth: config.depth,
      type: config.type,
      maxDelay: config.maxDelay,
      wet: config.wet
    });
  }

  private createTremolo(config?: Effects['tremolo']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    return new Tone.Tremolo({
      frequency: config.frequency,
      depth: config.depth,
      spread: config.spread,
      type: config.type,
      wet: config.wet
    }).start();
  }

  private createDelay(config?: Effects['delay']): Tone.ToneAudioNode | null {
    if (!config?.enabled) return null;
    return new Tone.FeedbackDelay({
      delayTime: config.delayTime,
      feedback: config.feedback,
      maxDelay: config.maxDelay,
      wet: config.wet
    });
  }


  disposeAllEffects(): void {
    this.activeEffects.forEach(effect => {
      try {
        effect.dispose();
      } catch (error) {
        console.warn('Error disposing effect:', error);
      }
    });
    this.activeEffects = [];
  }
}