import ControlsView from "../components/Controls/ControlsView";
import EffectsView from "../components/Effects/EffectsView";
import Spinner from "../components/Spinner/Spinner";
import NeckView from "../components/Neck/NeckView";
import TitleView from "../components/Title/TitleView";
import { useGuitar } from "../hooks/useGuitar";

export default function GuitarPage() {
  const { loading, neck } = useGuitar();

  return loading ? (
    <Spinner />
  ) : (
    <div>
      <TitleView />
      <NeckView neck={neck} />
      <ControlsView />
      <EffectsView />
    </div>
  );
}
