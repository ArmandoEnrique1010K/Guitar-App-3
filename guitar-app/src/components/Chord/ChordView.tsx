import { playSound } from "../../utils/audioPlayer";

type ChordViewProps = {
  chord: number;
  rope: number;
  keyFromKeyboard: string;
};

export default function ChordView({
  chord,
  rope,
  keyFromKeyboard,
  instrument,
  neck,
}: ChordViewProps) {
  const handlePlaySound = () => {
    // handleNotePlayed(note);
    playSound(
      instrument,
      neck,
      rope,
      chord,
      false, //mutePreviousChord,
      // volume,
      keyFromKeyboard,
      true,
      {
        gain: {
          enabled: true,
          gain: 1,
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
