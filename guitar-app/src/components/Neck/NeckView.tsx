import { Neck } from "../../types";
import RopeView from "../Rope/RopeView";
import styles from "./Neck.module.css";

type NeckViewProps = {
  neck: Neck;
};

export default function NeckView({ neck }: NeckViewProps) {
  return (
    <>
      <div className={styles.container}>
        {neck.map(({ rope, frets }) => (
          <RopeView key={rope} rope={rope} frets={frets} />
        ))}
      </div>
      <div className={styles.numbers}>
        {/* {neck.map(({ frets }) =>
          frets.map(({ chord }, idx) => <span key={idx}>{chord}</span>)
        )} */}

        {/* {neck.map(({ frets }, ropeIdx) =>
          frets.length > 0 ? <span key={ropeIdx}>{frets[0].chord}</span> : null
        )} */}

        {
          neck.map(({ frets }) =>
            frets.map((c) => <span className={styles.number}>{c.chord}</span>)
          )[0]
        }
      </div>
    </>
  );
}
