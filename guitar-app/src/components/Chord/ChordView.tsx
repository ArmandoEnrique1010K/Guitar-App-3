import { useEffect } from "react";
import { useGuitar } from "../../hooks/useGuitar";
import { muteCurrentNote, playSound } from "../../utils/audioPlayer";
import styles from "./Chord.module.css";
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
    // reverb,
    // vibrato,
    // chorus,
    // tremolo,
    // delay,
    // phaser,
    // eq3,
    // compressor,
    // autoWah,
    // mutePreviousNote,
    // holdMode,
    // amountMode,

    noteConfig,
    setNotePlayed,
    pulseMode,
    effects,
  } = useGuitar();

  const {
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
  } = effects;

  const handlePlaySound = (clickMode: boolean) => {
    setNotePlayed({ rope, chord });
    playSound(
      instrument,
      neck,
      rope,
      chord,
      keyFromKeyboard,
      clickMode,
      noteConfig.muteOnDifferentRope,
      noteConfig.muteOnSameRope,
      noteConfig.muteOnSameNote,
      noteConfig.holdMode,
      noteConfig.holdModeTime,

      // holdMode.enabled,

      // mutePreviousNote,
      // holdMode.anyTime,
      // holdMode.time,
      // amountMode,
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
    // mutePreviousNote,
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
    noteConfig,
    // holdMode.enabled,
    // holdMode.anyTime,
    // holdMode.time,
    // amountMode,
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

      // TODO: ¿PORQUE IMPRIME VARIAS VECES EL MISMO MENSAJE?
      console.log("Key up detected:", event.key);
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [pulseMode]); // Dependencia de pulseMode

  return (
    <button
      className={chord === 0 ? styles.firstChord : styles.container}
      // onClick={handlePlaySound}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={pulseMode ? handleMouseUp : undefined} // Detener si el mouse sale del botón
    >
      {keyFromKeyboard === "Dead"
        ? "´"
        : keyFromKeyboard === "Shift"
        ? "⇧"
        : keyFromKeyboard}
    </button>
  );
}
