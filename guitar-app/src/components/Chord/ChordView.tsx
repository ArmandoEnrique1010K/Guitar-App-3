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
    // distortion,
    reverb,
    vibrato,
    chorus,
    tremolo,
    delay,
    phaser,
    eq3,
    compressor,
    autoWah,
    mutePreviousNote,
    setNotePlayed,
    pulseMode,
    holdMode,

    effects,
  } = useGuitar();

  const { distortion } = effects;

  const handlePlaySound = (clickMode: boolean) => {
    setNotePlayed({ rope, chord });
    playSound(
      instrument,
      neck,
      rope,
      chord,
      mutePreviousNote,
      keyFromKeyboard,
      clickMode,
      holdMode.enabled,
      holdMode.time,

      gain,
      {
        distortion,
        reverb,
        vibrato,
        chorus,
        tremolo,
        delay,
        phaser,
        eq3,
        compressor,
        autoWah,
      }
    );
  };

  const handleStopSound = () => {
    muteCurrentNote();
  };

  useEffect(() => {
    const handleKeyDownPlaySound = (event: KeyboardEvent) => {
      if (event.key === keyFromKeyboard) {
        handlePlaySound(false);
      }
    };

    const handleKeyUpStopSound = (event: KeyboardEvent) => {
      if (event.key === keyFromKeyboard && pulseMode) {
        handleStopSound();
      }
    };

    window.addEventListener("keydown", handleKeyDownPlaySound);
    window.addEventListener("keyup", handleKeyUpStopSound);

    return () => {
      window.removeEventListener("keydown", handleKeyDownPlaySound);
      window.removeEventListener("keyup", handleKeyUpStopSound);
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
    compressor,
    autoWah,
    pulseMode,
    holdMode.enabled,
    holdMode.time,
  ]);

  const handleMouseDown = () => {
    handlePlaySound(true);
  };

  const handleMouseUp = () => {
    if (pulseMode) {
      handleStopSound();
    }
  };

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (!pulseMode) return; // No hacer nada si pulseMode es falso
      console.log("Key up detected:", event.key);
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [pulseMode]); // Dependencia de pulseMode

  return (
    <button
      // onClick={handlePlaySound}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={pulseMode ? handleMouseUp : undefined} // Detener si el mouse sale del botón
    >
      {chord} - {rope} - [{keyFromKeyboard!}]
    </button>
  );
}
