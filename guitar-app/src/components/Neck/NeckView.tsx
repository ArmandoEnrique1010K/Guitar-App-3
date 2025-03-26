import {
  DistortionEffect,
  Neck,
  ReverbEffect,
  VibratoEffect,
} from "../../types";
import RopeView from "../Rope/RopeView";

type NeckViewProps = {
  neck: Neck;
  instrument: string;
  gain: number;
  distortion: DistortionEffect;
  reverb: ReverbEffect;
  vibrato: VibratoEffect;
};

export default function NeckView({
  neck,
  instrument,
  gain,
  distortion,
  reverb,
  vibrato,
}: NeckViewProps) {
  return (
    <div>
      {neck.map(({ rope, frets }) => (
        <RopeView
          key={rope}
          rope={rope}
          frets={frets}
          instrument={instrument}
          neck={neck}
          gain={gain}
          distortion={distortion}
          reverb={reverb}
          vibrato={vibrato}
        />
      ))}
    </div>
  );
}
