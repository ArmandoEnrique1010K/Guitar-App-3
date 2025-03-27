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
  chorus: ChorusEffect;
  tremolo: TremoloEffect;
  delay: DelayEffect;
  phaser: PhaserEffect;
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
  chorus: chorusProps,
  tremolo: tremoloProps,
  delay: delayProps,
  phaser: phaserProps,
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
        chorus: chorusProps,
        tremolo: tremoloProps,
        delay: delayProps,
        phaser: phaserProps,
      }
    );
  };

  return (
    <button onClick={handlePlaySound}>
      {chord} - {rope} - {keyFromKeyboard!}
    </button>
  );
}
