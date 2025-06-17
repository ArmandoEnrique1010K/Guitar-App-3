import { Neck } from "../../types";
import RopeView from "../Rope/RopeView";
import styles from "./Neck.module.css";

type NeckViewProps = {
  neck: Neck;
};

export default function NeckView({ neck }: NeckViewProps) {
  const drawNumbers = neck.map(({ frets }) =>
    frets.map((c) => (
      <span className={styles.number} key={c.key}>
        {c.chord === 12 ? (
          <>
            <span className={styles.circle2}>
              <span className={styles.circle}>{c.chord}</span>
              <span className={styles.circle}>{c.chord}</span>
            </span>
          </>
        ) : c.chord === 0 ? (
          ""
        ) : c.chord % 3 === 0 ? (
          <span className={styles.circle}>{c.chord}</span>
        ) : (
          ""
        )}
      </span>
    ))
  )[0];

  return (
    <>
      <div className={styles.container}>
        {neck.map(({ rope, frets }) => (
          <RopeView key={rope} rope={rope} frets={frets} />
        ))}
        <div className={styles.numbers}>{drawNumbers}</div>
      </div>
    </>
  );
}
