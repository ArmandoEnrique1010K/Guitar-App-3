import React from "react";
import { instrumentsNames } from "../../data/instrumentsNames";
import { formatCamelCase } from "../../utils/formatCamelCase";
import { ALTERNATE, FIRST, MIDDLE } from "../../constants";
import { LAST } from "../../constants/index";

type ControlsViewProps = {
  setInstrument: React.Dispatch<React.SetStateAction<string>>;
  setKeysRowType: React.Dispatch<React.SetStateAction<number[]>>;
  setGain: React.Dispatch<React.SetStateAction<number>>;
  gain: number;
  initialChord: number;
  setInitialChord: React.Dispatch<React.SetStateAction<number>>;
};

export default function ControlsView({
  setInstrument,
  setKeysRowType,
  setGain,
  gain,
  initialChord,
  setInitialChord,
}: ControlsViewProps) {
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
    </div>
  );
}
