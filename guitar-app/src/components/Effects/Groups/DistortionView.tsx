import { DISTORTION } from "../../../constants/effectsProperties";
import { useGuitar } from "../../../hooks/useGuitar";
import DropdownControlView from "../Controls/DropdownControlView";
import SliderControlView from "../Controls/SliderControlView";

export default function DistortionView() {
  const { effects } = useGuitar();

  // useEffect(() => {
  //   console.log("CAMBIO EN DISTORCIÓN");
  // }, [effects.distortion]);

  return (
    <>
      <SliderControlView
        name="distortion"
        property="distortion"
        value={effects.distortion!.distortion}
        props={DISTORTION.distortion}
      />
      <DropdownControlView
        name="distortion"
        property="oversample"
        options={DISTORTION.oversample.values}
      />

      <SliderControlView
        name="distortion"
        property="wet"
        value={effects.distortion!.wet}
        props={DISTORTION.wet}
      />

      {/* <DropdownControlView
        name="distortion"
        property="oversample"
        label="Muestreo"
        value={effects.distortion?.oversample}
        options={[
          DISTORTION_OVERSAMPLE_NONE,
          DISTORTION_OVERSAMPLE_2X,
          DISTORTION_OVERSAMPLE_4X,
        ]}
      />
      <SliderControlView
        name="distortion"
        property="wet"
        label="Mezcla"
        value={effects.distortion?.wet}
        min={DISTORTION_WET_MIN}
        max={DISTORTION_WET_MAX}
        step={DISTORTION_WET_STEP}
        unit={DISTORTION_WET_UNIT}
      /> */}
    </>
  );
}
