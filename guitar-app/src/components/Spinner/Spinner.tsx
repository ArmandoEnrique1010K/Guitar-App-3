import styles from "./Spinner.module.css";

export default function Spinner() {
  return (
    <div className={styles.container}>
      <img
        src="/spinners/green-spinner.svg"
        className={styles.image}
        alt="Spinner verde"
      />
      <h2 className={styles.text}>
        Cargando, observa el poder de React y ToneJS
      </h2>
    </div>
  );
}

// Imagen obtenida de
/* https://upload.wikimedia.org/wikipedia/commons/1/10/Emoji_u1f3b8.svg */
