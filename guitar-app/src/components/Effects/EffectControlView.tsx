import { ReactNode } from "react";
import { translate } from "../../utils/translate";
import CheckboxControlView from "./Controls/CheckboxControlView";

type EffectControlViewProps = {
  name: string;
  controls: ReactNode;
};

export default function EffectControlView({
  name,
  controls,
}: EffectControlViewProps) {
  return (
    <div style={{ backgroundColor: "darkmagenta" }}>
      <h3>{translate(name)}</h3>
      <div>
        <CheckboxControlView name={name} />
        {controls}
      </div>
    </div>
  );
}
