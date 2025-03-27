import {
  ChorusEffect,
  DelayEffect,
  DistortionEffect,
  Neck,
  PhaserEffect,
  ReverbEffect,
  TremoloEffect,
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
  chorus: ChorusEffect;
  tremolo: TremoloEffect;
  delay: DelayEffect;
  phaser: PhaserEffect;
};

export default function NeckView({
  neck,
  instrument,
  gain,
  distortion,
  reverb,
  vibrato,
  chorus,
  tremolo,
  delay,
  phaser,
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
          chorus={chorus}
          tremolo={tremolo}
          delay={delay}
          phaser={phaser}
        />
      ))}
    </div>
  );
}
