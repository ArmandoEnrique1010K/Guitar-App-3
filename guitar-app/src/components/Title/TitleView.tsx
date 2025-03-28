import { formatCamelCase } from "../../utils/formatCamelCase";
import { useGuitar } from "../../hooks/useGuitar";

export default function TitleView() {
  const { instrument } = useGuitar();

  return (
    <>
      <h1>Guitar App 1.1</h1>
      <h2>{formatCamelCase(instrument)}</h2>
    </>
  );
}
