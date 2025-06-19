import ConfigView from "../components/Configs/ConfigView";
import EffectsView from "../components/Effects/EffectsView";
import Spinner from "../components/Spinner/Spinner";
import NeckView from "../components/Neck/NeckView";
import Title from "../components/Title/Title";
import { useGuitar } from "../hooks/useGuitar";
import styles from "./GuitarPage.module.css";

export default function GuitarPage() {
  const { loading, neck } = useGuitar();

  return loading ? (
    <Spinner />
  ) : (
    <div className={styles.container}>
      <Title />
      <NeckView neck={neck} />
      <ConfigView />
      <EffectsView />
    </div>
  );
}
