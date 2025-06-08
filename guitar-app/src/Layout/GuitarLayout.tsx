import { Outlet } from "react-router-dom";
import styles from "./GuitarLayout.module.css";
import { useGuitar } from "../hooks/useGuitar";

export default function GuitarLayout() {
  const { loading } = useGuitar();

  return (
    <div>
      {!loading && (
        <div className={styles.container}>
          <img className={styles.logo} src="logo/guitar.svg" />
          <ul className={styles.menu}>
            <li className={styles.option}>Creditos</li>
            <li className={styles.option}>Iniciar sesión</li>
          </ul>
        </div>
      )}
      <Outlet />
    </div>
  );
}
