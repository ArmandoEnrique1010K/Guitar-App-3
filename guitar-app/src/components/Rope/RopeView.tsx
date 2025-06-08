import { Frets } from "../../types";
import ChordView from "../Chord/ChordView";
import styles from "./Rope.module.css";
type RopeViewProps = {
  rope: number;
  frets: Frets;
};

export default function RopeView({ rope, frets }: RopeViewProps) {
  return (
    <div className={styles.container}>
      {frets.map(({ chord, key: keyFromKeyboard }) => (
        // No se puede colocar fragmentos (<></>) dentro de un map, porque causaria un error.
        <ChordView
          key={`${rope}-${chord}`}
          chord={chord}
          rope={rope}
          keyFromKeyboard={keyFromKeyboard || ""}
        />
      ))}
    </div>
  );
}
