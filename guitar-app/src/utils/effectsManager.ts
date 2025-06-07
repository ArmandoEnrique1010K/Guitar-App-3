// effectsManager.ts
import * as Tone from 'tone';
import { AutoWahEffect, ChorusEffect, CompressorEffect, DelayEffect, DistortionEffect, Effects, EQ3Effect, PartialEffects, PhaserEffect, ReverbEffect, TremoloEffect, VibratoEffect } from '../types';

export class EffectsManager {
  private sharedEffects: Record<string, Tone.ToneAudioNode> = {};
  private activeChains: Tone.ToneAudioNode[][] = [];
  private maxEffects = 4; // Límite para evitar problemas de rendimiento
  private initialized = false;

  // Efectos que pueden ser compartidos (estado persistente)
  private readonly SHARED_EFFECTS = ['reverb', 'delay', 'compressor'];

  // Efectos que deben ser únicos por nota
  private readonly UNIQUE_EFFECTS = ['distortion', 'eq3', 'autoWah', 'phaser', 'chorus', 'vibrato', 'tremolo'];

  constructor() {
    this.initializeSharedEffects();
  }

  private async initializeSharedEffects(): Promise<void> {
    if (this.initialized) return;

    // Pre-crear efectos compartidos con configuraciones por defecto
    this.sharedEffects['reverb'] = new Tone.Reverb({
      decay: 2.5,
      preDelay: 0.01,
      wet: 0
    });
    await (this.sharedEffects['reverb'] as Tone.Reverb).generate();

    this.sharedEffects['delay'] = new Tone.FeedbackDelay({
      delayTime: '8n',
      feedback: 0.5,
      maxDelay: 0.005,
      wet: 0
    });

    this.sharedEffects['compressor'] = new Tone.Compressor({
      knee: 30,
      threshold: -20,
      ratio: 4,
      attack: 0.003,
      release: 0.25
    });

    this.initialized = true;
  }


  createEffectsChain(effects: Effects): Tone.ToneAudioNode[] {
    // // Limpiar efectos anteriores
    // this.disposeAllEffects();
    const chain: Tone.ToneAudioNode[] = [];


    // // Orden recomendado de efectos (puedes ajustarlo)
    // const effectsPipeline = [
    //   this.createDistortion(effects.distortion),
    //   this.createEQ3(effects.eq3),
    //   this.createCompressor(effects.compressor),
    //   this.createAutoWah(effects.autoWah),
    //   this.createPhaser(effects.phaser),
    //   this.createChorus(effects.chorus),
    //   this.createVibrato(effects.vibrato),
    //   this.createTremolo(effects.tremolo),
    //   this.createDelay(effects.delay),
    //   this.createReverb(effects.reverb)
    // ].filter(Boolean).slice(0, this.maxEffects) as Tone.ToneAudioNode[];

    // this.activeEffects = effectsPipeline;
    // return effectsPipeline;

    this.SHARED_EFFECTS.forEach(effectName => {
      const config = effects[effectName as keyof Effects];
      if (config?.enabled && this.sharedEffects[effectName]) {
        this.updateEffectParams(this.sharedEffects[effectName], config);
        chain.push(this.sharedEffects[effectName]);
      }
    });

    // 2. Luego procesar efectos únicos (nuevas instancias)
    this.UNIQUE_EFFECTS.forEach(effectName => {
      const config = effects[effectName as keyof Effects];
      if (config?.enabled) {
        // const effect = this.createEffectInstance(effectName, config);
        const effect = this.createEffectInstance(effectName as keyof PartialEffects, config);
        if (effect) chain.push(effect);
      }
    });

    // Limitar número total de efectos y mantener orden recomendado
    const orderedChain = this.orderEffects(chain).slice(0, this.maxEffects);
    this.activeChains.push(orderedChain);

    return orderedChain;

  }

  private orderEffects(chain: Tone.ToneAudioNode[]): Tone.ToneAudioNode[] {
    // Orden óptimo de procesamiento de efectos
    const effectPriority = [
      'compressor', 'eq3', 'distortion', 'autoWah',
      'phaser', 'chorus', 'vibrato', 'tremolo', 'delay', 'reverb'
    ];

    return chain.sort((a, b) => {
      const aType = this.getEffectType(a);
      const bType = this.getEffectType(b);
      return effectPriority.indexOf(aType) - effectPriority.indexOf(bType);
    });
  }

  private getEffectType(node: Tone.ToneAudioNode): string {
    if (node instanceof Tone.Compressor) return 'compressor';
    if (node instanceof Tone.EQ3) return 'eq3';
    if (node instanceof Tone.Distortion) return 'distortion';
    if (node instanceof Tone.AutoWah) return 'autoWah';
    if (node instanceof Tone.Phaser) return 'phaser';
    if (node instanceof Tone.Chorus) return 'chorus';
    if (node instanceof Tone.Vibrato) return 'vibrato';
    if (node instanceof Tone.Tremolo) return 'tremolo';
    if (node instanceof Tone.FeedbackDelay) return 'delay';
    if (node instanceof Tone.Reverb) return 'reverb';
    return '';
  }

  // TODO: HAY PROBLEMAS CON REVERB, FEEDBACK DELAY, 


  private createEffectInstance(
    type: keyof PartialEffects,
    config: Partial<PartialEffects[keyof PartialEffects]>
  ): Tone.ToneAudioNode | null {
    switch (type) {
      case 'distortion': {
        const { distortion, oversample, wet } = config as DistortionEffect;
        return new Tone.Distortion({
          distortion, oversample, wet
        });
      }

      case 'reverb': {
        const { decay, preDelay, wet } = config as ReverbEffect;
        return new Tone.Reverb({
          decay, preDelay, wet
        })
      }
      // return new Tone.Reverb({
      //   decay: config.decay,
      //   preDelay: config.preDelay,
      //   wet: config.wet
      // });

      case 'vibrato': {
        const { frequency, depth, type, maxDelay, wet } = config as VibratoEffect
        return new Tone.Vibrato({
          frequency,
          depth,
          type,
          maxDelay,
          wet,
        });
      }

      case 'chorus': {
        const { frequency, delayTime, depth, feedback, spread, wet, type } = config as ChorusEffect
        return new Tone.Chorus({
          frequency,
          delayTime,
          depth,
          feedback,
          spread,
          wet,
          type
        }).start();
      }

      case 'tremolo': {
        const { frequency, depth, spread, type, wet } = config as TremoloEffect
        return new Tone.Tremolo({
          frequency,
          depth,
          spread,
          type,
          wet
        }).start();
      }

      case 'delay': {
        const { delayTime, feedback, maxDelay, wet } = config as DelayEffect
        return new Tone.FeedbackDelay({
          delayTime,
          feedback,
          maxDelay,
          wet
        });
      }

      case 'phaser': {
        const { frequency, octaves, stages, Q, baseFrequency, wet } = config as PhaserEffect;
        return new Tone.Phaser({
          frequency,
          octaves,
          stages,
          Q,
          baseFrequency,
          wet
        });
      }

      case 'eq3': {
        const { low, mid, high, lowFrequency, highFrequency } = config as EQ3Effect;
        return new Tone.EQ3({
          low,
          mid,
          high,
          lowFrequency,
          highFrequency
        });
      }

      case 'compressor': {
        const { threshold, ratio, attack, release, knee } = config as CompressorEffect;
        return new Tone.Compressor({
          threshold,
          ratio,
          attack,
          release,
          knee
        });
      }

      case 'autoWah': {
        const { baseFrequency, octaves, sensitivity, Q, gain, follower, wet } = config as AutoWahEffect;
        return new Tone.AutoWah({
          baseFrequency,
          octaves,
          sensitivity,
          Q,
          gain,
          follower,
          wet
        });
      }

      default:
        return null;

      // case 'vibrato':
      //   return new Tone.Vibrato({
      //     frequency: config.frequency,
      //     depth: config.depth,
      //     type: config.type,
      //     maxDelay: config.maxDelay,
      //     wet: config.wet
      //   });

      // case 'chorus':
      //   return new Tone.Chorus({
      //     frequency: config.frequency,
      //     delayTime: config.delayTime,
      //     depth: config.depth,
      //     feedback: config.feedback,
      //     spread: config.spread,
      //     wet: config.wet,
      //     type: config.type
      //   }).start();

      // case 'tremolo':
      //   return new Tone.Tremolo({
      //     frequency: config.frequency,
      //     depth: config.depth,
      //     spread: config.spread,
      //     type: config.type,
      //     wet: config.wet
      //   }).start();

      // case 'delay':
      //   return new Tone.FeedbackDelay({
      //     delayTime: config.delayTime,
      //     feedback: config.feedback,
      //     maxDelay: config.maxDelay,
      //     wet: config.wet
      //   });

      // case 'phaser':
      //   return new Tone.Phaser({
      //     frequency: config.frequency,
      //     octaves: config.octaves,
      //     stages: config.stages,
      //     Q: config.Q,
      //     baseFrequency: config.baseFrequency,
      //     wet: config.wet
      //   });

      // case 'eq3':
      //   return new Tone.EQ3({
      //     low: config.low,
      //     mid: config.mid,
      //     high: config.high,
      //     lowFrequency: config.lowFrequency,
      //     highFrequency: config.highFrequency
      //   });

      // case 'compressor':
      //   return new Tone.Compressor({
      //     threshold: config.threshold,
      //     ratio: config.ratio,
      //     attack: config.attack,
      //     release: config.release,
      //     knee: config.knee
      //   });

      // case 'autoWah':
      //   return new Tone.AutoWah({
      //     baseFrequency: config.baseFrequency,
      //     octaves: config.octaves,
      //     sensitivity: config.sensitivity,
      //     Q: config.Q,
      //     gain: config.gain,
      //     follower: config.follower,
      //     wet: config.wet
      //   });

      // default:
      //   return null;
    }
  }

  // TODO: PARECE QUE EL PROBLEMA EN QUE SE CORTA EL AUDIO CON LOS EFECTOS DE SONIDO VIENE POR LA CANTIDAD DE NOTAS REPRODUCIDAS LUEGO DE CARGAR LA PAGINA WEB
  private updateEffectParams(effect: Tone.ToneAudioNode, config: Partial<Effects[keyof Effects]>): void {

    // if (effect instanceof Tone.Distortion && config) {
    //   effect.distortion = config.distortion;
    //   effect.oversample = config.oversample;
    //   effect.wet = config.wet
    // }
    if (effect instanceof Tone.Distortion && config) {
      const { distortion, oversample, wet } = config as Partial<DistortionEffect>;
      if (distortion !== undefined) effect.distortion = distortion;
      if (oversample !== undefined) effect.oversample = oversample;
      if (wet !== undefined) effect.wet.value = wet;
    }

    if (effect instanceof Tone.Reverb && config) {
      const { decay, preDelay, wet } = config as Partial<ReverbEffect>;

      if (decay !== undefined) effect.decay = decay;
      if (preDelay !== undefined) effect.preDelay = preDelay;
      if (wet !== undefined) effect.wet.value = wet;
    }

    // TODO: ADVERTENCIA, HICE UNA MODIFICACIÓN EN EL CONSTRUCTOR VIBRATO DE TONEJS
    if (effect instanceof Tone.Vibrato && config) {
      const { frequency, depth, type, maxDelay, wet } = config as Partial<VibratoEffect>;
      if (frequency !== undefined) effect.frequency.value = frequency;
      if (depth !== undefined) effect.depth.value = depth;
      if (type !== undefined) effect.type = type;
      if (maxDelay !== undefined) effect.maxDelay.value = maxDelay;
      if (wet !== undefined) effect.wet.value = wet;
    }

    if (effect instanceof Tone.FeedbackDelay && config) {
      const { delayTime, feedback, wet } = config as Partial<DelayEffect>;
      if (delayTime !== undefined) effect.delayTime.value = delayTime;
      if (feedback !== undefined) effect.feedback.value = feedback;
      if (wet !== undefined) effect.wet.value = wet;
    }

    if (effect instanceof Tone.Compressor && config) {
      const { threshold, ratio, attack, release, knee } = config as Partial<CompressorEffect>;
      if (threshold !== undefined) effect.threshold.value = threshold;
      if (ratio !== undefined) effect.ratio.value = ratio;
      if (attack !== undefined) effect.attack.value = attack;
      if (release !== undefined) effect.release.value = release;
      if (knee !== undefined) effect.knee.value = knee;
    }

    if (effect instanceof Tone.EQ3 && config) {
      const { low, mid, high, lowFrequency, highFrequency } = config as Partial<EQ3Effect>;
      if (low !== undefined) effect.low.value = low;
      if (mid !== undefined) effect.mid.value = mid;
      if (high !== undefined) effect.high.value = high;
      if (lowFrequency !== undefined) effect.lowFrequency.value = lowFrequency;
      if (highFrequency !== undefined) effect.highFrequency.value = highFrequency;
    }

    if (effect instanceof Tone.AutoWah && config) {
      const { baseFrequency, octaves, sensitivity, Q, gain, follower, wet } = config as Partial<AutoWahEffect>;
      if (baseFrequency !== undefined) effect.baseFrequency = baseFrequency;
      if (octaves !== undefined) effect.octaves = octaves;
      if (sensitivity !== undefined) effect.sensitivity = sensitivity;
      if (Q !== undefined) effect.Q.value = Q;
      if (gain !== undefined) effect.gain.value = gain;
      if (follower !== undefined) effect.follower = follower;
      if (wet !== undefined) effect.wet.value = wet;
    }

    // TODO: HICE UNA MODIFICACIÓN EN EL CONSTRUCTOR PHASER
    if (effect instanceof Tone.Phaser && config) {
      const { frequency, octaves, stages, Q, baseFrequency, wet } = config as Partial<PhaserEffect>;
      if (frequency !== undefined) effect.frequency.value = frequency;
      if (octaves !== undefined) effect.octaves = octaves;
      if (stages !== undefined) effect.stages.value = stages;
      if (Q !== undefined) effect.Q.value = Q;
      if (baseFrequency !== undefined) effect.baseFrequency = baseFrequency;
      if (wet !== undefined) effect.wet.value = wet;
    }

    if (effect instanceof Tone.Chorus && config) {
      const { frequency, delayTime, depth, feedback, spread, wet, type } = config as Partial<ChorusEffect>;
      if (frequency !== undefined) effect.frequency.value = frequency;
      if (delayTime !== undefined) effect.delayTime = delayTime;
      if (depth !== undefined) effect.depth = depth;
      if (feedback !== undefined) effect.feedback.value = feedback;
      if (spread !== undefined) effect.spread = spread;
      if (wet !== undefined) effect.wet.value = wet;
      if (type !== undefined) effect.type = type;
    }

    if (effect instanceof Tone.Tremolo && config) {
      const { frequency, depth, spread, type, wet } = config as Partial<TremoloEffect>;
      if (frequency !== undefined) effect.frequency.value = frequency;
      if (depth !== undefined) effect.depth.value = depth;
      if (spread !== undefined) effect.spread = spread;
      if (type !== undefined) effect.type = type;
      if (wet !== undefined) effect.wet.value = wet;
    }


    // if (effect instanceof Tone.Reverb && config) {
    //   effect.decay = config.decay;
    //   effect.preDelay = config.preDelay;
    //   effect.wet.value = config.wet;
    // }

    // if (effect instanceof Tone.Vibrato && config) {
    //   effect.frequency.value = config.frequency;
    //   effect.depth.setValueAtTime(config.depth, Tone.now());
    //   effect.type = config.type;
    //   effect.maxDelay.value = config.maxDelay;
    //   // Removed invalid property 'maxDelay' for Vibrato
    //   effect.wet.value = config.wet;
    // }

    // if (effect instanceof Tone.FeedbackDelay && config) {
    //   effect.delayTime.setValueAtTime(config.delayTime, Tone.now());
    //   effect.feedback = config.feedback;
    //   effect.wet.value = config.wet;
    // }



    // // ... actualizaciones similares para otros efectos compartidos
    // if (effect instanceof Tone.Compressor && config) {
    //   effect.threshold.value = config.threshold;
    //   effect.ratio.value = config.ratio;
    //   effect.attack.setValueAtTime(config.attack, Tone.now());
    //   effect.release.setValueAtTime(config.release, Tone.now());
    //   effect.knee.value = config.knee;
    // }
    // if (effect instanceof Tone.EQ3 && config) {
    //   effect.low.value = config.low;
    //   effect.mid.value = config.mid;
    //   effect.high.value = config.high;
    //   effect.lowFrequency.value = config.lowFrequency;
    //   effect.highFrequency.value = config.highFrequency;
    // }
    // if (effect instanceof Tone.AutoWah && config) {
    //   effect.baseFrequency = config.baseFrequency;
    //   effect.octaves = config.octaves;
    //   effect.sensitivity = config.sensitivity;
    //   effect.Q.value = config.Q;
    //   effect.gain.value = config.gain;
    //   effect.follower = config.follower;
    //   effect.wet.value = config.wet;
    // }
    // if (effect instanceof Tone.Phaser && config) {
    //   effect.frequency.value = config.frequency;
    //   effect.octaves = config.octaves;
    //   effect.stages = config.stages;
    //   effect.Q.value = config.Q;
    //   effect.baseFrequency = config.baseFrequency;
    //   effect.wet.value = config.wet;
    // }
    // if (effect instanceof Tone.Chorus && config) {
    //   effect.frequency.value = config.frequency;
    //   effect.delayTime = config.delayTime;
    //   effect.depth = config.depth;
    //   effect.feedback = config.feedback;
    //   effect.spread = config.spread;
    //   effect.wet.value = config.wet;
    //   effect.type = config.type;
    // }
    // if (effect instanceof Tone.Tremolo && config) {
    //   effect.frequency.value = config.frequency;
    //   effect.depth = config.depth;
    //   effect.spread = config.spread;
    //   effect.type = config.type;
    //   effect.wet.value = config.wet;
    // }
  }

  disposeChain(chain: Tone.ToneAudioNode[]): void {
    // Solo eliminar efectos únicos, los compartidos persisten
    chain.forEach(effect => {
      const effectType = this.getEffectType(effect);
      if (!this.SHARED_EFFECTS.includes(effectType)) {
        try {
          effect.dispose();
        } catch (error) {
          console.warn(`Error disposing ${effectType}:`, error);
        }
      }
    });

    // Eliminar la cadena de la lista activa
    // Uncaught TypeError: Converting circular structure to JSON
    //     --> starting at object with constructor 'AudioContext'
    //       | property '_destination' -> object with constructor 'AudioDestinationNode'
    //     --- property '_context' closes the circle
    //     at JSON.stringify(<anonymous>)
    //     at effectsManager.ts: 521: 75
    //     at Array.filter(<anonymous>)
    //     at EffectsManager.disposeChain(effectsManager.ts: 521: 43)
    //     at effectsManager.ts: 526: 45
    //     at Array.forEach(<anonymous>)
    //     at EffectsManager.disposeAll(effectsManager.ts: 526: 23)
    //     at audioPlayer.ts: 304: 28
    // TODO: ¿ESTO PUEDE SER LA RAZÓN DE QUE SE CORTE EL SONIDO?
    this.activeChains = this.activeChains.filter(c => c !== chain);
  }

  disposeAll(): void {
    // Limpiar todas las cadenas activas
    this.activeChains.forEach(chain => this.disposeChain(chain));
    this.activeChains = [];

    // Limpiar efectos compartidos
    Object.values(this.sharedEffects).forEach(effect => {
      try {
        effect.dispose();
      } catch (error) {
        console.warn('Error disposing shared effect:', error);
      }
    });
    this.sharedEffects = {};
    this.initialized = false;
  }

  // private createDistortion(config?: Effects['distortion']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   return new Tone.Distortion({
  //     distortion: config.distortion,
  //     oversample: config.oversample,
  //     wet: config.wet
  //   });
  // }

  // private createReverb(config?: Effects['reverb']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   const reverb = new Tone.Reverb({
  //     decay: config.decay,
  //     preDelay: config.preDelay,
  //     wet: config.wet
  //   });
  //   reverb.generate().catch(console.error);
  //   return reverb;
  // }

  // private createEQ3(config?: Effects['eq3']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   return new Tone.EQ3({
  //     low: config.low,
  //     mid: config.mid,
  //     high: config.high,
  //     lowFrequency: config.lowFrequency,
  //     highFrequency: config.highFrequency,
  //   });
  // }

  // private createCompressor(config?: Effects['compressor']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   return new Tone.Compressor({
  //     threshold: config.threshold,
  //     ratio: config.ratio,
  //     attack: config.attack,
  //     release: config.release,
  //     knee: config.knee
  //   });
  // }

  // private createAutoWah(config?: Effects['autoWah']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   return new Tone.AutoWah({
  //     baseFrequency: config.baseFrequency,
  //     octaves: config.octaves,
  //     sensitivity: config.sensitivity,
  //     Q: config.Q,
  //     gain: config.gain,
  //     follower: config.follower,
  //     wet: config.wet
  //   });
  // }

  // private createPhaser(config?: Effects['phaser']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   return new Tone.Phaser({
  //     frequency: config.frequency,
  //     octaves: config.octaves,
  //     stages: config.stages,
  //     Q: config.Q,
  //     baseFrequency: config.baseFrequency,
  //     wet: config.wet
  //   });
  // }

  // private createChorus(config?: Effects['chorus']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   return new Tone.Chorus({
  //     frequency: config.frequency,
  //     delayTime: config.delayTime,
  //     depth: config.depth,
  //     feedback: config.feedback,
  //     spread: config.spread,
  //     wet: config.wet,
  //     type: config.type
  //   }).start();
  // }

  // private createVibrato(config?: Effects['vibrato']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   return new Tone.Vibrato({
  //     frequency: config.frequency,
  //     depth: config.depth,
  //     type: config.type,
  //     maxDelay: config.maxDelay,
  //     wet: config.wet
  //   });
  // }

  // private createTremolo(config?: Effects['tremolo']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   return new Tone.Tremolo({
  //     frequency: config.frequency,
  //     depth: config.depth,
  //     spread: config.spread,
  //     type: config.type,
  //     wet: config.wet
  //   }).start();
  // }

  // private createDelay(config?: Effects['delay']): Tone.ToneAudioNode | null {
  //   if (!config?.enabled) return null;
  //   return new Tone.FeedbackDelay({
  //     delayTime: config.delayTime,
  //     feedback: config.feedback,
  //     maxDelay: config.maxDelay,
  //     wet: config.wet
  //   });
  // }


  // disposeAllEffects(): void {
  //   this.activeEffects.forEach(effect => {
  //     try {
  //       effect.dispose();
  //     } catch (error) {
  //       console.warn('Error disposing effect:', error);
  //     }
  //   });
  //   this.activeEffects = [];
  // }
}