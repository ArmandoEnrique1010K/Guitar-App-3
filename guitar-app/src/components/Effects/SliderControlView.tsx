type SliderControlViewProps = {
  name: string;
  property: string;
  label: string;
  value: number | undefined;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
};

export default function SliderControlView({
  name,
  property,
  label,
  value,
  handleChange,
  min,
  max,
  step,
  unit,
}: SliderControlViewProps) {
  return (
    <div>
      <label htmlFor={`id_${name}_${property}`}>{label}</label>
      <input
        id={`id_${name}_${property}`}
        name={name}
        data-property={property}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      {value} {unit}
    </div>
  );
}
