import { Outlet } from "react-router-dom";
import styles from "./GuitarLayout.module.css";
import { useGuitar } from "../hooks/useGuitar";

export default function GuitarLayout() {
  const { loading } = useGuitar();

  return (
    <div>
      {!loading && (
        <div className={styles.container}>
          <img src="logo/guitar.svg" />
          <ul>
            <li>Creditos</li>
            <li>Iniciar sesión</li>
          </ul>
        </div>
      )}
      <Outlet />
    </div>
  );
}
