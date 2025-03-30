import { createContext } from "react";
import {
  Neck,
  DistortionEffect,
  ReverbEffect,
  VibratoEffect,
  ChorusEffect,
  TremoloEffect,
  DelayEffect,
  PhaserEffect,
  EQ3Effect,
  Note,
} from "../types";

type GuitarContextProps = {
  loading: boolean;
  neck: Neck;
  instrument: string;
  setInstrument: React.Dispatch<React.SetStateAction<string>>;
  setKeysRowType: React.Dispatch<React.SetStateAction<number[]>>;
  initialChord: number;
  setInitialChord: React.Dispatch<React.SetStateAction<number>>;
  lockZeroChord: boolean;
  setLockZeroChord: React.Dispatch<React.SetStateAction<boolean>>;
  invertKeyboard: boolean;
  setInvertKeyboard: React.Dispatch<React.SetStateAction<boolean>>;
  mutePreviousNote: boolean;
  setMutePreviousNote: React.Dispatch<React.SetStateAction<boolean>>;
  pulseMode: boolean;
  setPulseMode: React.Dispatch<React.SetStateAction<boolean>>;

  notePlayed: Note;
  setNotePlayed: React.Dispatch<React.SetStateAction<Note>>;

  gain: number;
  setGain: React.Dispatch<React.SetStateAction<number>>;
  distortion: DistortionEffect;
  setDistortion: React.Dispatch<React.SetStateAction<DistortionEffect>>;
  reverb: ReverbEffect;
  setReverb: React.Dispatch<React.SetStateAction<ReverbEffect>>;
  vibrato: VibratoEffect;
  setVibrato: React.Dispatch<React.SetStateAction<VibratoEffect>>;
  chorus: ChorusEffect;
  setChorus: React.Dispatch<React.SetStateAction<ChorusEffect>>;
  tremolo: TremoloEffect;
  setTremolo: React.Dispatch<React.SetStateAction<TremoloEffect>>;
  delay: DelayEffect;
  setDelay: React.Dispatch<React.SetStateAction<DelayEffect>>;
  phaser: PhaserEffect;
  setPhaser: React.Dispatch<React.SetStateAction<PhaserEffect>>;
  eq3: EQ3Effect;
  setEq3: React.Dispatch<React.SetStateAction<EQ3Effect>>;
};

// Crear el contexto con valores por defecto
export const GuitarContext = createContext<GuitarContextProps>(null!);
