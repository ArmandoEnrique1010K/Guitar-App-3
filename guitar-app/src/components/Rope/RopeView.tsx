import {
  DistortionEffect,
  Frets,
  Neck,
  ReverbEffect,
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
        />
      ))}
    </div>
  );
}
