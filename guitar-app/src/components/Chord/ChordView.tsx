import {
  DistortionEffect,
  Neck,
  ReverbEffect,
  VibratoEffect,
} from "../../types";
import { playSound } from "../../utils/audioPlayer";

type ChordViewProps = {
  chord: number;
  rope: number;
  keyFromKeyboard: string;
  instrument: string;
  neck: Neck;
  gain: number;
  distortion: DistortionEffect;
  reverb: ReverbEffect;
  vibrato: VibratoEffect;
};

export default function ChordView({
  chord,
  rope,
  keyFromKeyboard,
  instrument,
  neck,
  gain: volume,
  distortion: distortionProps,
  reverb: reverbProps,
  vibrato: vibratoProps,
}: ChordViewProps) {
  const handlePlaySound = () => {
    // handleNotePlayed(note);
    playSound(
      instrument,
      neck,
      rope,
      chord,
      false, //mutePreviousChord,
      keyFromKeyboard,
      true,
      {
        gain: {
          gain: volume,
        },
        distortion: distortionProps,
        reverb: reverbProps,
        vibrato: vibratoProps,
      }
    );
  };

  return (
    <button onClick={handlePlaySound}>
      {chord} - {rope} - {keyFromKeyboard!}
    </button>
  );
}
