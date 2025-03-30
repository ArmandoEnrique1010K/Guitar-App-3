import { useEffect } from "react";
import { useGuitar } from "../../hooks/useGuitar";
import { muteCurrentNote, playSound } from "../../utils/audioPlayer";

type ChordViewProps = {
  chord: number;
  rope: number;
  keyFromKeyboard: string;
};

export default function ChordView({
  chord,
  rope,
  keyFromKeyboard,
}: ChordViewProps) {
  const {
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
    eq3,
    mutePreviousNote,
    setNotePlayed,
  } = useGuitar();

  const handlePlaySound = (clickMode) => {
    setNotePlayed({ rope, chord });
    playSound(
      instrument,
      neck,
      rope,
      chord,
      mutePreviousNote,
      keyFromKeyboard,
      clickMode,
      {
        gain: {
          gain,
        },
        distortion,
        reverb,
        vibrato,
        chorus,
        tremolo,
        delay,
        phaser,
        eq3,
      }
    );
  };

  useEffect(() => {
    const handleKeyDownPlaySound = (event) => {
      // ESTO ES MEJOR EN LUGAR DE UTILIZAR UN && en event.key
      if (event.key === keyFromKeyboard) {
        // handlePlaySound(false);
        handlePlaySound(false);
      }
    };

    const handleKeyUpStopSound = (event) => {
      // Si se suelta la tecla asignada y pulseMode es falso, se silencia la nota actual
      if (event.key === keyFromKeyboard) {
        //setIsPlayed(false)
        handleStopSound();
      }
    };

    const handleStopSound = () => {
      muteCurrentNote();
    };

    window.addEventListener("keydown", handleKeyDownPlaySound);
    // window.addEventListener("keyup", handleKeyUpStopSound);

    //if (mutePreviousNote === true) {
    //  window.addEventListener("keyup", handleKeyUpStopSound);
    //}

    return () => {
      window.removeEventListener("keydown", handleKeyDownPlaySound);
      // window.removeEventListener("keyup", handleKeyUpStopSound);

      //if (mutePreviousNote === true) {
      //  window.addEventListener("keyup", handleKeyUpStopSound);
      //}
    };
  }, [
    keyFromKeyboard,
    mutePreviousNote,
    gain,
    distortion,
    reverb,
    vibrato,
    chorus,
    tremolo,
    delay,
    phaser,
    eq3,
  ]);

  return (
    <button onClick={handlePlaySound}>
      {chord} - {rope} - [{keyFromKeyboard!}]
    </button>
  );
}
