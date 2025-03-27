import {
  ChorusEffect,
  DelayEffect,
  DistortionEffect,
  PhaserEffect,
  ReverbEffect,
  TremoloEffect,
  VibratoEffect,
} from "../../types";

type EffectsViewProps = {
  distortion: DistortionEffect;
  setDistortion: React.Dispatch<React.SetStateAction<DistortionEffect>>;
  reverb: ReverbEffect;
  setReverb: React.Dispatch<React.SetStateAction<ReverbEffect>>;
  vibrato: VibratoEffect;
  setVibrato: React.Dispatch<React.SetStateAction<VibratoEffect>>;
  chorus: ChorusEffect;
  setChorus: React.Dispatch<React.SetStateAction<ChorusEffect>>;
  tremolo: TremoloEffect;
  setTremolo: React.Dispatch<React.SetStateAction<TremoloEffect>>;
  delay: DelayEffect;
  setDelay: React.Dispatch<React.SetStateAction<DelayEffect>>;
  phaser: PhaserEffect;
  setPhaser: React.Dispatch<React.SetStateAction<PhaserEffect>>;
};

export default function EffectsView({
  distortion,
  setDistortion,
  reverb,
  setReverb,
  vibrato,
  setVibrato,
  chorus,
  setChorus,
  tremolo,
  setTremolo,
  delay,
  setDelay,
  phaser,
  setPhaser,
}: EffectsViewProps) {
  return (
    <>
      <h1>Efectos de sonido (activa como maximo 3)</h1>
      {/* https://tonejs.github.io/docs/r13/Distortion */}
      <h3>Distorsión</h3>
      <input
        type="checkbox"
        checked={distortion.enabled}
        onChange={(e) =>
          setDistortion({
            ...distortion,
            enabled: e.target.checked,
          })
        }
      />
      Habilitar
      <br />
      <label>Distortion</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={distortion.distortion}
        onChange={(e) =>
          setDistortion({
            ...distortion,
            distortion: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Oversample</label>
      <select
        value={distortion.oversample}
        onChange={(e) =>
          setDistortion({
            ...distortion,
            oversample: e.target.value as "none" | "2x" | "4x",
          })
        }
      >
        <option value="none">none</option>
        <option value="2x">2x</option>
        <option value="4x">4x</option>
      </select>
      <br />
      <label>Wet</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={distortion.wet}
        onChange={(e) =>
          setDistortion({
            ...distortion,
            wet: parseFloat(e.target.value),
          })
        }
      />
      {/* https://tonejs.github.io/docs/r13/Reverb */}
      <h3>Reverberación</h3>
      <input
        type="checkbox"
        checked={reverb.enabled}
        onChange={(e) =>
          setReverb({
            ...reverb,
            enabled: e.target.checked,
          })
        }
      />
      Habilitar
      <br />
      <label>Decay</label>
      <input
        type="range"
        min={0.01}
        max={10}
        step={0.01}
        value={reverb.decay}
        onChange={(e) =>
          setReverb({
            ...reverb,
            decay: parseFloat(e.target.value),
          })
        }
      />
      <label>PreDelay</label>
      <input
        type="range"
        min={0.01}
        max={5}
        step={0.01}
        value={reverb.preDelay}
        onChange={(e) =>
          setReverb({
            ...reverb,
            preDelay: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Wet</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={reverb.wet}
        onChange={(e) =>
          setReverb({
            ...reverb,
            wet: parseFloat(e.target.value),
          })
        }
      />
      {/* https://tonejs.github.io/docs/r13/Vibrato */}
      <h3>Vibrato</h3>
      <input
        type="checkbox"
        checked={vibrato.enabled}
        onChange={(e) =>
          setVibrato({
            ...vibrato,
            enabled: e.target.checked,
          })
        }
      />
      Habilitar
      <br />
      <label>Frequency</label>
      <input
        type="range"
        min={0.1}
        max={10}
        step={0.1}
        value={vibrato.frequency}
        onChange={(e) =>
          setVibrato({
            ...vibrato,
            frequency: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Depth</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={vibrato.depth}
        onChange={(e) =>
          setVibrato({
            ...vibrato,
            depth: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Type</label>
      <select
        value={vibrato.type}
        onChange={(e) =>
          setVibrato({
            ...vibrato,
            type: e.target.value as "sine" | "square" | "triangle" | "sawtooth",
          })
        }
      >
        <option value="sine">sine</option>
        <option value="square">square</option>
        <option value="triangle">triangle</option>
        <option value="sawtooth">sawtooth</option>
      </select>
      <br />
      <label>MaxDelay</label>
      <input
        type="range"
        min={0.1}
        max={15}
        step={0.1}
        value={vibrato.maxDelay}
        onChange={(e) =>
          setVibrato({
            ...vibrato,
            maxDelay: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Wet</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={vibrato.wet}
        onChange={(e) =>
          setVibrato({
            ...vibrato,
            wet: parseFloat(e.target.value),
          })
        }
      />
      <br />
      {/* https://tonejs.github.io/docs/r13/Chorus */}
      <h3>Coro</h3>
      <input
        type="checkbox"
        checked={chorus.enabled}
        onChange={(e) =>
          setChorus({
            ...chorus,
            enabled: e.target.checked,
          })
        }
      />
      Habilitar
      <br />
      <label>Delay Time</label>
      <input
        type="range"
        min={0}
        max={20}
        step={0.1}
        value={chorus.delayTime}
        onChange={(e) =>
          setChorus({
            ...chorus,
            delayTime: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Depth</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={chorus.depth}
        onChange={(e) =>
          setChorus({
            ...chorus,
            depth: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Feedback</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={chorus.feedback}
        onChange={(e) =>
          setChorus({
            ...chorus,
            feedback: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Frequency</label>
      <input
        type="range"
        min={0.1}
        max={10}
        step={0.1}
        value={chorus.frequency}
        onChange={(e) =>
          setChorus({
            ...chorus,
            frequency: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Spread</label>
      <input
        type="range"
        min={0}
        max={360}
        step={1}
        value={chorus.spread}
        onChange={(e) =>
          setChorus({
            ...chorus,
            spread: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Type</label>
      <select
        value={chorus.type}
        onChange={(e) =>
          setChorus({
            ...chorus,
            type: e.target.value as "sine" | "square" | "triangle" | "sawtooth",
          })
        }
      >
        <option value="sine">sine</option>
        <option value="square">square</option>
        <option value="triangle">triangle</option>
        <option value="sawtooth">sawtooth</option>
      </select>
      <br />
      <label>Wet</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={chorus.wet}
        onChange={(e) =>
          setChorus({
            ...chorus,
            wet: parseFloat(e.target.value),
          })
        }
      />
      {/* 
        
        Checkbox: Activa o desactiva el efecto de chorus.
Delay Time: Controla el tiempo de retardo.
Depth: Ajusta la profundidad del efecto.
Feedback: Controla la cantidad de retroalimentación.
Frequency: Ajusta la frecuencia del efecto.
Spread: Controla la propagación del efecto en el panorama estéreo.
Type: Selecciona la forma de onda del efecto (sine, square, triangle, sawtooth).
Wet: Ajusta el nivel de mezcla entre la señal procesada y la original.

        */}
      <br />
      {/* https://tonejs.github.io/docs/r13/Tremolo */}
      <h3>Tremolo</h3>
      <input
        type="checkbox"
        checked={tremolo.enabled}
        onChange={(e) =>
          setTremolo({
            ...tremolo,
            enabled: e.target.checked,
          })
        }
      />
      Habilitar
      <br />
      <label>Frecuencia</label>
      <input
        type="range"
        min={0.1}
        max={20}
        step={0.1}
        value={tremolo.frequency}
        onChange={(e) =>
          setTremolo({
            ...tremolo,
            frequency: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Profundidad</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={tremolo.depth}
        onChange={(e) =>
          setTremolo({
            ...tremolo,
            depth: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Spread</label>
      <input
        type="range"
        min={0}
        max={360}
        step={1}
        value={tremolo.spread}
        onChange={(e) =>
          setTremolo({
            ...tremolo,
            spread: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Tipo</label>
      <select
        value={tremolo.type}
        onChange={(e) =>
          setTremolo({
            ...tremolo,
            type: e.target.value as "sine" | "square" | "triangle" | "sawtooth",
          })
        }
      >
        <option value="sine">sine</option>
        <option value="square">square</option>
        <option value="triangle">triangle</option>
        <option value="sawtooth">sawtooth</option>
      </select>
      <br />
      <label>Wet</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={tremolo.wet}
        onChange={(e) =>
          setTremolo({
            ...tremolo,
            wet: parseFloat(e.target.value),
          })
        }
      />
      {/* */}
      <h3>Delay</h3>
      <input
        type="checkbox"
        checked={delay.enabled}
        onChange={(e) => setDelay({ ...delay, enabled: e.target.checked })}
      />
      Habilitar
      <br />
      <label>Delay Time (s)</label>
      <input
        type="range"
        min={0}
        max={2}
        step={0.01}
        value={delay.delayTime}
        onChange={(e) =>
          setDelay({ ...delay, delayTime: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Feedback</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={delay.feedback}
        onChange={(e) =>
          setDelay({ ...delay, feedback: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>MaxDelay</label>
      <input
        type="range"
        min={0.1}
        max={15}
        step={0.1}
        value={delay.maxDelay}
        onChange={(e) =>
          setDelay({
            ...delay,
            maxDelay: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Wet</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={delay.wet}
        onChange={(e) =>
          setDelay({ ...delay, wet: parseFloat(e.target.value) })
        }
      />
      {/* */}
      <h3>Phaser</h3>
      <input
        type="checkbox"
        checked={phaser.enabled}
        onChange={(e) => setPhaser({ ...phaser, enabled: e.target.checked })}
      />
      Habilitar
      <br />
      <label>Frequency (Hz)</label>
      <input
        type="range"
        min={0.1}
        max={10}
        step={0.1}
        value={phaser.frequency}
        onChange={(e) =>
          setPhaser({ ...phaser, frequency: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Octaves</label>
      <input
        type="range"
        min={1}
        max={6}
        step={1}
        value={phaser.octaves}
        onChange={(e) =>
          setPhaser({ ...phaser, octaves: parseInt(e.target.value) })
        }
      />
      <br />
      <label>Stages</label>
      <input
        type="range"
        min={2}
        max={20}
        step={2}
        value={phaser.stages}
        onChange={(e) =>
          setPhaser({ ...phaser, stages: parseInt(e.target.value) })
        }
      />
      <br />
      <label>Q (Resonancia)</label>
      <input
        type="range"
        min={1}
        max={20}
        step={1}
        value={phaser.Q}
        onChange={(e) =>
          setPhaser({ ...phaser, Q: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Base Frequency (Hz)</label>
      <input
        type="range"
        min={100}
        max={1000}
        step={10}
        value={phaser.baseFrequency}
        onChange={(e) =>
          setPhaser({ ...phaser, baseFrequency: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Wet</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={phaser.wet}
        onChange={(e) =>
          setPhaser({ ...phaser, wet: parseFloat(e.target.value) })
        }
      />
    </>
  );
}
