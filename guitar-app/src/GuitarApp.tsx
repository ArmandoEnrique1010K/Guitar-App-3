import TitleView from "./components/Title/TitleView";
import ControlsView from "./components/Controls/ControlsView";
import NeckView from "./components/Neck/NeckView";
import EffectsView from "./components/Effects/EffectsView";
import { useGuitar } from "./hooks/useGuitar";
import Loading from "./components/Loader/Loading";

export default function GuitarApp() {
  const { loading, neck } = useGuitar();

  return loading ? (
    <Loading />
  ) : (
    <div>
      <TitleView />
      <NeckView neck={neck} />
      <ControlsView />
      <EffectsView />
    </div>
  );
}
