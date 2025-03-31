import { ReactNode } from "react";

type EffectControlViewProps = {
  name: string;
  label: string;
  checked: boolean | undefined;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  controls: ReactNode;
};

export default function EffectControlView({
  name,
  label,
  checked,
  handleChange,
  controls,
}: EffectControlViewProps) {
  return (
    <>
      <h3>{label}</h3>
      <div>
        <input
          id={`id_${name}`}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleChange}
        />
        <label htmlFor={`id_${name}`}>{label}</label>
        {controls}
      </div>
    </>
  );
}
