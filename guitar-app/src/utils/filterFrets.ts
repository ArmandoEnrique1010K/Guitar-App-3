import { Neck } from "../types";

export const filterFrets = (neck: Neck): Neck => {
  return neck.map((note) => ({
    ...note,
    frets: note.frets.filter((f) => f.key !== "OCULTAR"),
  }));
};
