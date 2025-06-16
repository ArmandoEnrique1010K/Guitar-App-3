import { DISTORTION } from "../../../constants/effectsProperties";
import { useGuitar } from "../../../hooks/useGuitar";
import SliderControlView from "../SliderControlView";

export default function DistortionView() {
  const { effects, handleChange } = useGuitar();

  return (
    <>
      <SliderControlView
        name="distortion"
        property="distortion"
        value={effects.distortion!.distortion}
        props={DISTORTION.distortion}
        change={handleChange}
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
      /> */}

      <SliderControlView
        name="distortion"
        property="wet"
        value={effects.distortion!.wet}
        props={DISTORTION.wet}
        change={handleChange}
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
