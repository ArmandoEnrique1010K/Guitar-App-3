import { VIBRATO } from "../../../constants/effectsProperties";
import { useGuitar } from "../../../hooks/useGuitar";
import DropdownControlView from "../Controls/DropdownControlView";
import SliderControlView from "../Controls/SliderControlView";

export default function VibratoView() {
  const { effects, handleChange } = useGuitar();

  return (
    <div>
      <SliderControlView
        name="vibrato"
        property="frequency"
        value={effects.vibrato!.frequency}
        props={VIBRATO.frequency}
        change={handleChange}
      />
      <SliderControlView
        name="vibrato"
        property="depth"
        value={effects.vibrato!.depth}
        props={VIBRATO.depth}
        change={handleChange}
      />
      <DropdownControlView
        name="vibrato"
        property="type"
        options={VIBRATO.type.values}
      />
      <SliderControlView
        name="vibrato"
        property="maxDelay"
        value={effects.vibrato!.maxDelay}
        change={handleChange}
        props={VIBRATO.maxDelay}
      />
      <SliderControlView
        name="vibrato"
        property="wet"
        value={effects.vibrato!.wet}
        change={handleChange}
        props={VIBRATO.wet}
      />
    </div>
  );
}
