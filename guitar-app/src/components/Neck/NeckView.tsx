import { Neck } from "../../types";
import RopeView from "../Rope/RopeView";
import styles from "./Neck.module.css";

type NeckViewProps = {
  neck: Neck;
};

const renderCircle = (chord: number) => {
  if (chord === 12) {
    return (
      <div className={styles.twelveFretMarker}>
        <span className={styles.fretMarkerDot}></span>
        <span className={styles.fretMarkerDot}></span>
      </div>
    );
  }
  if (chord === 0) return null;
  if (chord % 3 === 0) return <span className={styles.fretMarkerDot}></span>;
  return null;
};

export default function NeckView({ neck }: NeckViewProps) {
  const firstRopeFrets = neck[0]?.frets || [];

  /* TIP: CONSIDERO QUE LAS NOTAS DE LA GUITARRA SE MOSTRARAN EN LA PARTE INFERIOR Y NO SOBRE LOS PUNTOS DE LA GUITARRA QUE APARECEN EN LA PANTALLA */
  return (
    <>
      <div className={styles.neckContainer}>
        {neck.map(({ rope, frets }) => (
          <RopeView key={rope} rope={rope} frets={frets} />
        ))}

        {/* Circulos en la guitarra */}
        <div className={styles.fretMarkersContainer}>
          {firstRopeFrets.map((fret) => (
            <div className={styles.fretMarkerCell} key={fret.key}>
              {renderCircle(fret.chord)}
            </div>
          ))}
        </div>
      </div>

      {/* Acordes de la guitarra en una fila */}
      <div className={styles.fretNumbersContainer}>
        {firstRopeFrets.map((fret) => (
          <span className={styles.fretNumber} key={fret.key}>
            {fret.chord}
          </span>
        ))}
      </div>
    </>
  );
}
