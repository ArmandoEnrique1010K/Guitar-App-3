import { getAssignedKeys } from "./getAssignedKeys";
import { filterFrets } from "./filterFrets";
import { Neck } from '../types/index';
import { kEYSBYROW } from "../constants";

export const assignKeysToFrets = (
  file: Neck,
  firstRowKeys: number,
  secondRowKeys: number,
  thirdRowKeys: number,
  fourthRowKeys: number,
  fifthRowKeys: number,
  sixthRowKeys: number,
  startFromTheChord: number,
  lockTheZeroChord: boolean,
  invertKeyboard: boolean
): Neck => {
  let result: Neck = [];

  const arrayRowKeys = [
    firstRowKeys,
    secondRowKeys,
    thirdRowKeys,
    fourthRowKeys,
    fifthRowKeys,
    sixthRowKeys,
  ];

  for (let i = 0; i < 6; i++) {
    const findRope = file.find((n) => n.rope === 6 - i) || { rope: 0, frets: [] };
    const rowKeys = arrayRowKeys[i];

    const assignRowKeys = getAssignedKeys(rowKeys, invertKeyboard) || [];

    for (let index = 0; index < findRope.frets.length; index++) {
      const element = findRope.frets[index];

      if (index >= startFromTheChord && !lockTheZeroChord) {
        if (index <= assignRowKeys?.length) {
          element.key = assignRowKeys[index - startFromTheChord];
        } else {
          element.key = undefined;
        }
      } else {
        element.key = undefined;
      }

      if (lockTheZeroChord && startFromTheChord === 0) {
        startFromTheChord = 1
      }

      if (index === 0 && lockTheZeroChord) {
        const elementKey =
          assignRowKeys?.[0] !== undefined ? assignRowKeys?.[0] : "";
        if (elementKey) {
          element.key = elementKey;
        }
        continue
      }

      if (index !== 0 && lockTheZeroChord) {
        if (index >= startFromTheChord) {
          if (index < assignRowKeys?.length + kEYSBYROW + 1) {
            element.key = assignRowKeys[index - startFromTheChord + 1] === undefined ? "OCULTAR" : assignRowKeys[index - startFromTheChord + 1]
          } else {
            element.key = undefined
          }
        } else {
          element.key = "OCULTAR"
        }
      }

      if (!lockTheZeroChord) {
        if (index <= assignRowKeys?.length + kEYSBYROW) {
          element.key = assignRowKeys[index - startFromTheChord];
        } else {
          element.key = undefined;
        }
      }

      if (!lockTheZeroChord && index <= startFromTheChord - 1) {
        element.key = "OCULTAR";
      }

      if (index > kEYSBYROW - 1 + startFromTheChord) {
        element.key = "OCULTAR";
      }

    }



    // RESULTADO
    result = [...result, { rope: findRope.rope, frets: findRope.frets }];
  }

  return filterFrets(result);
};
