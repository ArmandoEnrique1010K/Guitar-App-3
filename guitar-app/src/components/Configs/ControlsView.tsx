import { instrumentsNames } from "../../data/instrumentsNames";
import { formatCamelCase } from "../../utils/formatCamelCase";
// import { ALTERNATE, FIRST, MIDDLE } from "../../constants";
// import { LAST } from "../../constants/index";
import { useGuitar } from "../../hooks/useGuitar";
import { muteAll } from "../../utils/audioPlayer";
import { useEffect } from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

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
    pulseMode,
    setPulseMode,

    // mutePreviousNote,
    // setMutePreviousNote,
    // holdMode,
    // setHoldMode,
    // amountMode,
    // setAmountMode,
    noteConfig,
    setNoteConfig,

    message,
  } = useGuitar();

  // Vuelve a establecer el acorde inicial si lockZeroChord cambia
  const handleInitialChord = () => {
    if (lockZeroChord) {
      if (initialChord < 1) {
        setInitialChord(1);
      } else if (initialChord > 13) {
        setInitialChord(13);
      }
    } else {
      if (initialChord < 0) {
        setInitialChord(0);
      } else if (initialChord > 12) {
        setInitialChord(12);
      }
    }
  };

  useEffect(() => {
    handleInitialChord();
  }, [lockZeroChord]);

  //////////////////////////////////

  const initialKeysRowType = [
    {
      row: 0,
      value: "Fila [null]",
    },
    {
      row: 1,
      value: "Fila [undefined]",
    },
    {
      row: 2,
      value: "Fila [Z]",
    },
    {
      row: 3,
      value: "Fila [A]",
    },
    {
      row: 4,
      value: "Fila [Q]",
    },
    {
      row: 5,
      value: "Fila [1]",
    },
  ];

  const [parent, keysRowType] = useDragAndDrop<
    HTMLUListElement,
    { row: number; value: string }
  >(initialKeysRowType, {
    sortable: true,
  });

  // Actualizar el estado de las filas de teclas cuando cambie el orden
  useEffect(() => {
    setKeysRowType(keysRowType.map(({ row }) => row));
  }, [keysRowType]);

  // FUNCIONO NUEVA LIBRERIA: https://drag-and-drop.formkit.com/
  //////////////////////

  return (
    <div>
      <div>{message}</div>
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
      <h3>Tipo de filas de teclas (arrastra el elemento)</h3>
      <ul
        ref={parent}
        // TIP: SE AÑADE UN ESTILO INVERSO PARA QUE AL MOMENTO DE ARRASTRAR EL ELEMENTO SE SINCRONICE CON EL MASTIL DE LA GUITARRA
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        {keysRowType.map(({ row, value }) => (
          <li key={row} data-label={row}>
            {value}
          </li>
        ))}
      </ul>
      <h3>Empezar desde el acorde</h3>
      <input
        type="range"
        name=""
        id=""
        min={lockZeroChord ? 1 : 0}
        max={lockZeroChord ? 13 : 12}
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
      <br />
      <h3>Modo pulso (manten pulsada una tecla)</h3>
      <input
        type="checkbox"
        checked={pulseMode}
        onChange={(e) => setPulseMode(e.target.checked)}
      />{" "}
      Activar
      <br />
      <h3>Silenciar nota en diferente cuerda</h3>
      <input
        type="checkbox"
        checked={noteConfig.muteOnDifferentRope}
        onChange={() =>
          setNoteConfig((prev) => ({
            ...prev,
            muteOnDifferentRope: !prev.muteOnDifferentRope,
          }))
        }
      />{" "}
      Silenciar nota anterior en la cuerda diferente
      <br />
      <h3>Silenciar nota en la misma cuerda</h3>
      <input
        type="checkbox"
        checked={noteConfig.muteOnSameRope}
        onChange={() =>
          setNoteConfig((prev) => ({
            ...prev,
            muteOnSameRope: !prev.muteOnSameRope,
          }))
        }
      />{" "}
      Silenciar nota anterior en la misma cuerda
      <br />
      <h3>Silenciar la misma nota reproducida</h3>
      <input
        type="checkbox"
        checked={noteConfig.muteOnSameNote}
        onChange={() =>
          setNoteConfig((prev) => ({
            ...prev,
            muteOnSameNote: !prev.muteOnSameNote,
          }))
        }
      />{" "}
      Silenciar la misma nota reproducida
      <br />
      <h3>
        Mantener reproduciendo la nota anterior (evita silencios inesperados)
      </h3>
      <input
        type="checkbox"
        checked={noteConfig.holdMode}
        onChange={() =>
          setNoteConfig((prev) => ({
            ...prev,
            holdMode: !prev.holdMode,
          }))
        }
      />{" "}
      Modo mantener reproduciendo nota anterior
      <br />
      <h3>Tiempo de reproducción de la nota anterior (en milisegundos)</h3>
      <input
        type="range"
        min={0}
        max={3000}
        step={1}
        value={noteConfig.holdModeTime}
        onChange={(e) => {
          setNoteConfig((prev) => ({ ...prev, holdModeTime: +e.target.value }));
        }}
      />{" "}
      Silenciar despues de {noteConfig.holdModeTime} milisegundos
      {/* <h3>Silenciar nota anterior</h3>
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
      <br /> */}
      <h3>Silencio</h3>
      <button onClick={muteAll}>Silenciar todo</button>
    </div>
  );
}
