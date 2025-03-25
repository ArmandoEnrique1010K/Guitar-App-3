import { keyboardKeys } from "../data/keyboardKeys";

export const getAssignedKeys = (
  rowKeys: number,
  invertKeyboard: boolean
): string[] | undefined => {
  return invertKeyboard
    ? keyboardKeys[keyboardKeys.length - 1 - rowKeys]?.keys
    : keyboardKeys[rowKeys]?.keys;
};
