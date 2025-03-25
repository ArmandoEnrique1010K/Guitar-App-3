import { formatCamelCase } from "../../utils/formatCamelCase";

type TitleViewProps = {
  instrument: string;
};

export default function TitleView({ instrument }: TitleViewProps) {
  return (
    <>
      <h1>Guitar App 1.1</h1>
      <h2>{formatCamelCase(instrument)}</h2>
    </>
  );
}
