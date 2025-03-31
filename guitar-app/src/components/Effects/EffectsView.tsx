import {
  DISTORTION_DISTORTION_MAX,
  DISTORTION_DISTORTION_MIN,
  DISTORTION_DISTORTION_STEP,
  DISTORTION_DISTORTION_UNIT,
  DISTORTION_OVERSAMPLE_2X,
  DISTORTION_OVERSAMPLE_4X,
  DISTORTION_OVERSAMPLE_NONE,
  DISTORTION_WET_MAX,
  DISTORTION_WET_MIN,
  DISTORTION_WET_STEP,
  DISTORTION_WET_UNIT,
} from "../../constants/effectsProperties";
import { useGuitar } from "../../hooks/useGuitar";
import DropdownControlView from "./DropdownControlView";
import EffectControlView from "./EffectControlView";
import SliderControlView from "./SliderControlView";

export default function EffectsView() {
  const {
    // distortion,
    // setDistortion,
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
    eq3,
    setEq3,
    compressor,
    setCompressor,
    autoWah,
    setAutoWah,

    effects,
    handleChange,
  } = useGuitar();

  return (
    <>
      <h1>Efectos de sonido (activa como maximo 3)</h1>
      {/* https://tonejs.github.io/docs/r13/Distortion */}
      <EffectControlView
        name="distortion"
        label="Distorsión"
        checked={effects.distortion?.enabled}
        handleChange={handleChange}
        controls={
          <>
            <SliderControlView
              name="distortion"
              property="distortion"
              label="Distorsión"
              value={effects.distortion?.distortion}
              handleChange={handleChange}
              min={DISTORTION_DISTORTION_MIN}
              max={DISTORTION_DISTORTION_MAX}
              step={DISTORTION_DISTORTION_STEP}
              unit={DISTORTION_DISTORTION_UNIT}
            />

            <DropdownControlView
              name="distortion"
              property="oversample"
              label="Muestreo"
              value={effects.distortion?.oversample}
              handleChange={handleChange}
              options={[
                DISTORTION_OVERSAMPLE_NONE,
                DISTORTION_OVERSAMPLE_2X,
                DISTORTION_OVERSAMPLE_4X,
              ]}
            />
            <SliderControlView
              name="distortion"
              property="wet"
              label="Mezcla"
              value={effects.distortion?.wet}
              handleChange={handleChange}
              min={DISTORTION_WET_MIN}
              max={DISTORTION_WET_MAX}
              step={DISTORTION_WET_STEP}
              unit={DISTORTION_WET_UNIT}
            />
          </>
        }
      />
      {/* <h3>Distorsión</h3>
      <input
        type="checkbox"
        name="distortion"
        checked={effects.distortion?.enabled}
        onChange={handleChange}
      />
      Habilitar
      <br />
      <label>Distortion</label>
      <input
        name="distortion"
        data-property="distortion"
        type="range"
        min={DISTORTION_DISTORTION_MIN}
        max={DISTORTION_DISTORTION_MAX}
        step={DISTORTION_DISTORTION_STEP}
        value={effects.distortion?.distortion}
        onChange={handleChange}
      />
      <br />
      <label>Oversample</label>
      <select
        name="distortion"
        data-property="oversample"
        onChange={handleChange}
      >
        <option value={DISTORTION_OVERSAMPLE_NONE}>
          {DISTORTION_OVERSAMPLE_NONE}
        </option>
        <option value={DISTORTION_OVERSAMPLE_2X}>
          {DISTORTION_OVERSAMPLE_2X}
        </option>
        <option value={DISTORTION_OVERSAMPLE_4X}>
          {DISTORTION_OVERSAMPLE_4X}
        </option>
      </select>
      <br /> */}
      <label>Wet</label>
      <input
        type="range"
        data-property="wet" // Especifica la propiedad a actualizar
        name="distortion"
        min={DISTORTION_WET_MIN}
        max={DISTORTION_WET_MAX}
        step={DISTORTION_WET_STEP}
        value={effects.distortion?.wet}
        onChange={handleChange}
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
        min={0.1}
        max={10}
        step={0.1}
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
        min={0}
        max={0.1}
        step={0.001}
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
        min={0.005}
        max={0.1}
        step={0.001}
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
      <h3>Ecualizador</h3>
      <input
        type="checkbox"
        checked={eq3.enabled}
        onChange={(e) => setEq3({ ...eq3, enabled: e.target.checked })}
      />{" "}
      Habilitar
      <br />
      <label>Bajos</label>
      <input
        type="range"
        min={-30}
        max={30}
        step={1}
        value={eq3.low}
        onChange={(e) => setEq3({ ...eq3, low: parseFloat(e.target.value) })}
      />
      <br />
      <label>Medios</label>
      <input
        type="range"
        min={-30}
        max={30}
        step={1}
        value={eq3.mid}
        onChange={(e) => setEq3({ ...eq3, mid: parseFloat(e.target.value) })}
      />
      <br />
      <label>Agudos</label>
      <input
        type="range"
        min={-30}
        max={30}
        step={1}
        value={eq3.high}
        onChange={(e) => setEq3({ ...eq3, high: parseFloat(e.target.value) })}
      />
      <br />
      <label>Frecuencia Baja (Hz)</label>
      <input
        type="range"
        min={100}
        max={1000}
        step={10}
        value={eq3.lowFrequency}
        onChange={(e) =>
          setEq3({ ...eq3, lowFrequency: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Frecuencia Alta (Hz)</label>
      <input
        type="range"
        min={1000}
        max={8000}
        step={100}
        value={eq3.highFrequency}
        onChange={(e) =>
          setEq3({ ...eq3, highFrequency: parseFloat(e.target.value) })
        }
      />
      <h3>Compresor</h3>
      <input
        type="checkbox"
        checked={compressor.enabled}
        onChange={(e) =>
          setCompressor({ ...compressor, enabled: e.target.checked })
        }
      />{" "}
      Habilitar
      <br />
      <label>Threshold (dB)</label>
      <input
        type="range"
        min={-60}
        max={0}
        step={1}
        value={compressor.threshold}
        onChange={(e) =>
          setCompressor({
            ...compressor,
            threshold: parseFloat(e.target.value),
          })
        }
      />
      <br />
      <label>Ratio</label>
      <input
        type="range"
        min={1}
        max={20}
        step={0.1}
        value={compressor.ratio}
        onChange={(e) =>
          setCompressor({ ...compressor, ratio: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Attack (s)</label>
      <input
        type="range"
        min={0.001}
        max={1}
        step={0.001}
        value={compressor.attack}
        onChange={(e) =>
          setCompressor({ ...compressor, attack: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Release (s)</label>
      <input
        type="range"
        min={0.01}
        max={1}
        step={0.01}
        value={compressor.release}
        onChange={(e) =>
          setCompressor({ ...compressor, release: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Knee (dB)</label>
      <input
        type="range"
        min={0}
        max={40}
        step={1}
        value={compressor.knee}
        onChange={(e) =>
          setCompressor({ ...compressor, knee: parseFloat(e.target.value) })
        }
      />
      <h3>Auto Wah</h3>
      <input
        type="checkbox"
        checked={autoWah.enabled}
        onChange={(e) => setAutoWah({ ...autoWah, enabled: e.target.checked })}
      />{" "}
      Habilitar
      <br />
      <label>Base Frequency (Hz)</label>
      <input
        type="range"
        min={20}
        max={2000}
        step={1}
        value={autoWah.baseFrequency}
        onChange={(e) =>
          setAutoWah({ ...autoWah, baseFrequency: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Octaves</label>
      <input
        type="range"
        min={1}
        max={6}
        step={0.1}
        value={autoWah.octaves}
        onChange={(e) =>
          setAutoWah({ ...autoWah, octaves: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Sensitivity</label>
      <input
        type="range"
        min={-40}
        max={0}
        step={0.1}
        value={autoWah.sensitivity}
        onChange={(e) =>
          setAutoWah({ ...autoWah, sensitivity: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Q (Resonancia)</label>
      <input
        type="range"
        min={0.1}
        max={10}
        step={0.1}
        value={autoWah.Q}
        onChange={(e) =>
          setAutoWah({ ...autoWah, Q: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Gain (dB)</label>
      <input
        type="range"
        min={0}
        max={10}
        step={0.1}
        value={autoWah.gain}
        onChange={(e) =>
          setAutoWah({ ...autoWah, gain: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Follower</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={autoWah.follower}
        onChange={(e) =>
          setAutoWah({ ...autoWah, follower: parseFloat(e.target.value) })
        }
      />
      <br />
      <label>Wet</label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={autoWah.wet}
        onChange={(e) =>
          setAutoWah({ ...autoWah, wet: parseFloat(e.target.value) })
        }
      />
    </>
  );
}
