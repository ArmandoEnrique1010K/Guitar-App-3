import { instrumentsNames } from "../../data/instrumentsNames";
import { formatCamelCase } from "../../utils/formatCamelCase";
import { ALTERNATE, FIRST, MIDDLE } from "../../constants";
import { LAST } from "../../constants/index";
import { useGuitar } from "../../hooks/useGuitar";
import { muteAll } from "../../utils/audioPlayer";

export default function ControlsView() {
  const {
    setInstrument,
    gain,
    setGain,
    setKeysRowType,
    initialChord,
    setInitialChord,
    lockZeroChord,
    setLockZeroChord,
    invertKeyboard,
    setInvertKeyboard,
    mutePreviousNote,
    setMutePreviousNote,
    pulseMode,
    setPulseMode,
    holdMode,
    setHoldMode,
    amountMode,
    setAmountMode,
  } = useGuitar();

  return (
    <div>
      <h3>Tipo de instrumento</h3>
      <select name="" id="" onChange={(e) => setInstrument(e.target.value)}>
        {instrumentsNames.map((name) => (
          <option key={name} value={name}>
            {formatCamelCase(name)}
          </option>
        ))}
      </select>
      <h3>Volumen</h3>
      <input
        type="range"
        name=""
        id=""
        min={0.1}
        max={2}
        step={0.1}
        value={gain}
        onChange={(e) => {
          setGain(parseFloat(e.target.value));
        }}
      />{" "}
      {(gain * 100).toFixed(0)}
      <h3>Tipo de filas de teclas</h3>
      <select
        name=""
        id=""
        onChange={(e) => setKeysRowType(JSON.parse(e.target.value))}
      >
        <option value={JSON.stringify(FIRST)}>primeros</option>
        <option value={JSON.stringify(LAST)}>Ultimos</option>
        <option value={JSON.stringify(MIDDLE)}>Medios</option>
        <option value={JSON.stringify(ALTERNATE)}>Alternados</option>
      </select>
      <h3>Empezar desde el acorde</h3>
      <input
        type="range"
        name=""
        id=""
        min={1}
        max={12}
        step={1}
        value={initialChord}
        onChange={(e) => {
          setInitialChord(+e.target.value);
        }}
      />
      {initialChord}
      <h3>Bloquear acorde 0</h3>
      <input
        type="checkbox"
        checked={lockZeroChord}
        onChange={(e) => setLockZeroChord(e.target.checked)}
      />{" "}
      Bloquear
      <h3>Invertir el teclado</h3>
      <input
        type="checkbox"
        checked={invertKeyboard}
        onChange={(e) => setInvertKeyboard(e.target.checked)}
      />{" "}
      Invertir
      <h3>Silenciar nota anterior</h3>
      <input
        type="checkbox"
        checked={mutePreviousNote}
        onChange={(e) => setMutePreviousNote(e.target.checked)}
      />{" "}
      Silenciar nota anterior
      <h3>Modo pulso (manten pulsada una tecla)</h3>
      <input
        type="checkbox"
        checked={pulseMode}
        onChange={(e) => setPulseMode(e.target.checked)}
      />{" "}
      Activar
      <h3>
        Modo libre (mantiene reproduciendo la nota anterior si la actual se
        encuentra en la misma cuerda por un cortisimo tiempo)
      </h3>
      <input
        type="checkbox"
        checked={holdMode.enabled}
        onChange={(e) =>
          setHoldMode((prev) => ({ ...prev, enabled: e.target.checked }))
        }
      />{" "}
      Activar
      <br />
      <input
        type="checkbox"
        checked={holdMode.anyTime}
        onChange={(e) =>
          setHoldMode((prev) => ({ ...prev, anyTime: e.target.checked }))
        }
      />{" "}
      Sin tiempo en milisegundos
      <br />
      <input
        type="range"
        min={10}
        max={7000}
        step={1}
        value={holdMode.time}
        onChange={(e) => {
          setHoldMode((prev) => ({ ...prev, time: +e.target.value }));
        }}
      />{" "}
      Silenciar despues de {holdMode.time} milisegundos
      <h3>
        Modo amontonar (no silenciar la misma nota, debe estar activado el modo
        libre)
      </h3>
      <input
        type="checkbox"
        checked={amountMode}
        onChange={(e) => setAmountMode(e.target.checked)}
      />{" "}
      Activar
      <br />
      <h3>Silencio</h3>
      <button onClick={muteAll}>Silenciar todo</button>
    </div>
  );
}
