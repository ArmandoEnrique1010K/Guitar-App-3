import { createContext } from "react";
import { Neck, Note, Effects } from "../types";

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
  holdMode: { enabled: boolean; anyTime: boolean; time: number };
  setHoldMode: React.Dispatch<
    React.SetStateAction<{ enabled: boolean; anyTime: boolean; time: number }>
  >;
  notePlayed: Note;
  setNotePlayed: React.Dispatch<React.SetStateAction<Note>>;

  amountMode: boolean;
  setAmountMode: React.Dispatch<React.SetStateAction<boolean>>;

  gain: number;
  setGain: React.Dispatch<React.SetStateAction<number>>;

  effects: Effects;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

// Crear el contexto con valores por defecto
export const GuitarContext = createContext<GuitarContextProps>(null!);
