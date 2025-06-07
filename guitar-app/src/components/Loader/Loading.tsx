import styles from "../Loader/Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      <img
        src="/spinners/green-spinner.svg"
        className={styles.image}
        alt="Guitar Logo"
      />
      {/* <img src="/logo/guitar.svg" className={styles.image} alt="Guitar Logo" /> */}
      <h2 className={styles.text}>
        Cargando, observa el poder de React y ToneJS
      </h2>
    </div>
  );
}

// Imagen obtenida de
/* https://upload.wikimedia.org/wikipedia/commons/1/10/Emoji_u1f3b8.svg */
