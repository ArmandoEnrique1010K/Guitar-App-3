import { NumberProperty } from "../../../constants/effectsProperties";
import { useGuitar } from "../../../hooks/useGuitar";
import { translate } from "../../../utils/translate";

type SliderControlViewProps = {
  name: string;
  property: string;
  value: number;
  props: NumberProperty;
};

export default function SliderControlView({
  name,
  property,
  value,
  props,
}: SliderControlViewProps) {
  const { min, max, step, factor, unit, decimals } = props;

  const { handleChange } = useGuitar();
  return (
    <div>
      <label htmlFor={`id_${name}_${property}`}>{translate(property)}</label>
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
      {(value * factor).toFixed(decimals)} {unit}
    </div>
  );
}
