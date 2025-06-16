import { NumberProperty } from "../../../constants/effectsProperties";
import { translate } from "../../../utils/translate";

type SliderControlViewProps = {
  name: string;
  property: string;
  value: number;
  props: NumberProperty;
  change: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

export default function SliderControlView({
  name,
  property,
  // label,
  value,
  props,
  change,
}: // min,
// max,
// step,
// unit,
SliderControlViewProps) {
  const { min, max, step, factor, unit } = props;

  return (
    <div>
      <label htmlFor={`id_${name}_${property}`}>{translate(property)}</label>
      <input
        // id={`id_${name}_${property}`}
        name={name}
        data-property={property}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={change}
      />
      {/* {(value * factor).toFixed(0)} {unit} */}
      {value * factor} {unit}
    </div>
  );
}
