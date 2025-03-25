import { Neck } from "../../types";
import RopeView from "../Rope/RopeView";

type NeckViewProps = {
  neck: Neck;
  instrument: string;
  gain: number;
};

export default function NeckView({ neck, instrument, gain }: NeckViewProps) {
  return (
    <div>
      {neck.map(({ rope, frets }) => (
        <RopeView
          key={rope}
          rope={rope}
          frets={frets}
          instrument={instrument}
          neck={neck}
          gain={gain}
        />
      ))}
    </div>
  );
}
