import { Frets, Neck } from "../../types";
import ChordView from "../Chord/ChordView";

type RopeViewProps = {
  rope: number;
  frets: Frets;
  instrument: string;
  neck: Neck;
  gain: number;
};

export default function RopeView({
  rope,
  frets,
  instrument,
  neck,
  gain,
}: RopeViewProps) {
  return (
    <div>
      {frets.map(({ chord, key: keyFromKeyboard }) => (
        // No se puede colocar fragmentos (<></>) dentro de un map, porque causaria un error.
        <ChordView
          key={`${rope}-${chord}`}
          chord={chord}
          rope={rope}
          keyFromKeyboard={keyFromKeyboard || ""}
          instrument={instrument}
          neck={neck}
          gain={gain}
        />
      ))}
    </div>
  );
}
