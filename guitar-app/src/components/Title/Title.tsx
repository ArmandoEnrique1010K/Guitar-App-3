import { formatCamelCase } from "../../utils/formatCamelCase";
import { useGuitar } from "../../hooks/useGuitar";
import styles from "./Title.module.css";

export default function Title() {
  const { instrument } = useGuitar();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Guitar App - {formatCamelCase(instrument)}
      </h1>
    </div>
  );
}
