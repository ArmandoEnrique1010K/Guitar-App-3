import { DistortionEffect, ReverbEffect, VibratoEffect } from "../../types";

type EffectsViewProps = {
  distortion: DistortionEffect;
  setDistortion: React.Dispatch<React.SetStateAction<DistortionEffect>>;
  reverb: ReverbEffect;
  setReverb: React.Dispatch<React.SetStateAction<ReverbEffect>>;
  vibrato: VibratoEffect;
  setVibrato: React.Dispatch<React.SetStateAction<VibratoEffect>>;
};

export default function EffectsView({
  distortion,
  setDistortion,
  reverb,
  setReverb,
  vibrato,
  setVibrato,
}: EffectsViewProps) {
  return (
    <>
      <h1>Efectos de sonido</h1>
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
    </>
  );
}
