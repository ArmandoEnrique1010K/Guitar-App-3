import React from "react";
import { instrumentsNames } from "../../data/instrumentsNames";
import { formatCamelCase } from "../../utils/formatCamelCase";

type ControlsViewProps = {
  setInstrument: React.Dispatch<React.SetStateAction<string>>;
};

export default function ControlsView({ setInstrument }: ControlsViewProps) {
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
    </div>
  );
}
