import {
  ChorusEffect,
  DelayEffect,
  DistortionEffect,
  Frets,
  Neck,
  PhaserEffect,
  ReverbEffect,
  TremoloEffect,
  VibratoEffect,
} from "../../types";
import ChordView from "../Chord/ChordView";

type RopeViewProps = {
  rope: number;
  frets: Frets;
  instrument: string;
  neck: Neck;
  gain: number;
  distortion: DistortionEffect;
  reverb: ReverbEffect;
  vibrato: VibratoEffect;
  chorus: ChorusEffect;
  tremolo: TremoloEffect;
  delay: DelayEffect;
  phaser: PhaserEffect;
};

export default function RopeView({
  rope,
  frets,
  instrument,
  neck,
  gain,
  distortion,
  reverb,
  vibrato,
  chorus,
  tremolo,
  delay,
  phaser,
}: RopeViewProps) {
  return (
    <div>
      {frets.map(({ chord, key: keyFromKeyboard }) => (
        // No se puede colocar fragmentos (<></>) dentro de un map, porque causaria un error.
        <ChordView
          key={`${rope}-${chord}`}
          chord={chord}
          rope={rope}
          keyFromKeyboard={keyFromKeyboard || ""}
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
