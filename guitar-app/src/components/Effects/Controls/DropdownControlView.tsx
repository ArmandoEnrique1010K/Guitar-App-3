import { useGuitar } from "../../../hooks/useGuitar";
import { translate } from "../../../utils/translate";

type DropDownControlViewProps = {
  name: string;
  property: string;
  options: string[];
};

export default function DropdownControlView({
  name,
  property,
  options,
}: DropDownControlViewProps) {
  const { handleChange } = useGuitar();

  return (
    <div>
      <label htmlFor={`id_${name}_${property}`}>{translate(property)}</label>
      <select
        id={`id_${name}_${property}`}
        name={name}
        data-property={property} // Especifica la propiedad a actualizar
        onChange={handleChange}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>{" "}
    </div>
  );
}
