import { ReactNode } from "react";
import { useGuitar } from "../../hooks/useGuitar";
import { translate } from "../../utils/translate";

type EffectControlViewProps = {
  name: string;
  controls: ReactNode;
};

export default function EffectControlView({
  name,
  controls,
}: EffectControlViewProps) {
  const { handleChange, effects } = useGuitar();

  return (
    <div style={{ backgroundColor: "red" }}>
      <h3>{translate(name)}</h3>
      <div>
        <input
          id={`id_${name}`}
          type="checkbox"
          name={name}
          checked={effects.distortion?.enabled}
          onChange={handleChange}
        />
        <label htmlFor={`id_${name}`}> Activar</label>
        {controls}
      </div>
    </div>
  );
}
