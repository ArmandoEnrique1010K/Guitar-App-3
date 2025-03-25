import { Neck } from "../../types";
import { playSound } from "../../utils/audioPlayer";

type ChordViewProps = {
  chord: number;
  rope: number;
  keyFromKeyboard: string;
  instrument: string;
  neck: Neck;
  gain: number;
};

export default function ChordView({
  chord,
  rope,
  keyFromKeyboard,
  instrument,
  neck,
  gain: volume,
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
          enabled: true,
          gain: volume,
        },
      }
    );
  };

  return (
    <button onClick={handlePlaySound}>
      {chord} - {rope} - {keyFromKeyboard!}
    </button>
  );
}
