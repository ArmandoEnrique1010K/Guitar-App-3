type DropDownControlViewProps = {
  name: string;
  property: string;
  label: string;
  value: string | undefined;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options: string[];
};

export default function DropdownControlView({
  name,
  property,
  label,
  value,
  handleChange,
  options,
}: DropDownControlViewProps) {
  return (
    <div>
      <label htmlFor={`id_${name}_${property}`}>{label}</label>
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
      {value}
    </div>
  );
}
