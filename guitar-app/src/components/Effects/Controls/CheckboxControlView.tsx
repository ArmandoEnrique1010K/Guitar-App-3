import { useGuitar } from "../../../hooks/useGuitar";

type CheckboxControlViewProps = {
  name: string;
};
export default function CheckboxControlView({
  name,
}: CheckboxControlViewProps) {
  const { effects, handleChange } = useGuitar();

  return (
    <>
      <input
        id={`id_${name}`}
        type="checkbox"
        name={name}
        checked={
          (effects as Record<string, { enabled: boolean }>)[name]?.enabled
        }
        onChange={handleChange}
      />
      <label htmlFor={`id_${name}`}> Activar</label>
    </>
  );
}
