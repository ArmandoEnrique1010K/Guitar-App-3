import { Frets } from "../../types";
import ChordView from "../Chord/ChordView";

type RopeViewProps = {
  rope: number;
  frets: Frets;
};

export default function RopeView({
  rope,
  frets,
  instrument,
  neck,
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
        />
      ))}
    </div>
  );
}
