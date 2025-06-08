import { Neck } from "../../types";
import RopeView from "../Rope/RopeView";
import styles from "./Neck.module.css";

type NeckViewProps = {
  neck: Neck;
};

export default function NeckView({ neck }: NeckViewProps) {
  return (
    <div className={styles.container}>
      {neck.map(({ rope, frets }) => (
        <RopeView key={rope} rope={rope} frets={frets} />
      ))}
    </div>
  );
}
