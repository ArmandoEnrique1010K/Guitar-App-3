// En una versión anterior, el algoritmo era bastante largo, simplifique el algoritmo usando una doble iteración con un bucle for. Esto simplifica el algoritmo de 510 lineas de codigo a 150 lineas de codigo.

// Utilice la extensión de Quokka para realizar pruebas hasta llegar a este algoritmo dinamico

// Importa la data en keyboard (el arreglo que contiene las filas del teclado)
import { keyboardKeys } from "../data/keyboardKeys";
import { Notes } from "../types";

// Número de teclas asignadas por cada fila del teclado (restamos 1 para manejar índices correctamente)
const keysByRow = 11 - 1;

// Función principal para asignar teclas a los trastes de las cuerdas de la guitarra
export const assignKeysToFrets = (
  // Parámetros para personalizar las asignaciones de teclas y opciones de configuración
  file: Notes,
  // Fila de teclas asociada a cada cuerda
  firstRowKeys: number,
  secondRowKeys: number,
  thirdRowKeys: number,
  fourthRowKeys: number,
  fifthRowKeys: number,
  sixthRowKeys: number,
  // Primer traste para empezar la asignación de teclas
  startFromTheChord: number,
  // Booleano para bloquear el traste 0 (evita modificar el primer acorde)
  lockTheZeroChord: boolean,
  // Booleano para invertir el orden de las filas del teclado
  invertKeyboard: boolean
) => {
  // Almacena el resultado final
  let result: Notes = [];

  // Las filas de teclas que se pasan se almacenan en un arreglo
  const arrayRowKeys = [
    firstRowKeys,
    secondRowKeys,
    thirdRowKeys,
    fourthRowKeys,
    fifthRowKeys,
    sixthRowKeys,
  ];

  // Bucle para iterar por cada cuerda de la guitarra
  for (let i = 0; i < 6; i++) {
    // Busca la cuerda de la guitarra
    // Se tiene en cuenta que el orden de las cuerdas se asigna de mayor a menor: 6, 5, 4, 3, 2, 1.
    const findRope = file.find((n) => n.rope === 6 - i) || { rope: 0, frets: [] };

    // Obtiene el elemento del arreglo por su indice
    const rowKeys = arrayRowKeys[i];

    // Asignación de filas de teclas de acuerdo a la opción de inversión
    const assignRowKeys =
      invertKeyboard === false
        ? keyboardKeys[rowKeys]?.keys
        : keyboardKeys[keyboardKeys.length - 1 - rowKeys]?.keys;

    // Bucle para iterar por cada nota de la cuerda
    for (let index = 0; index < findRope.frets.length; index++) {
      // Toma el traste o la nota actual
      const element = findRope.frets[index];

      // Asignación de tecla si `lockTheZeroChord` está en false
      if (index >= startFromTheChord && lockTheZeroChord === false) {
        // Asigna la tecla de la fila correspondiente, si existe
        if (index <= assignRowKeys?.length) {
          element.key = assignRowKeys[index - startFromTheChord];
        } else {
          // Si no hay tecla, asigna undefined
          element.key = undefined;
        }
      } else {
        // Si `lockTheZeroChord` está en true, asigna undefined a la nota
        element.key = undefined;
      }

      // Evita asignar el acorde 0 si `lockTheZeroChord` está en true y `startFromTheChord` es 0
      if (lockTheZeroChord === true && startFromTheChord === 0) {
        // Cambia a 1 para evitar asignación en el traste 0
        startFromTheChord = 1;
      }

      // Bloqueo específico del traste 0 si `lockTheZeroChord` está en true
      if (index === 0 && lockTheZeroChord === true) {
        // Asigna la primera tecla de la fila solo si existe
        const elementKey =
          assignRowKeys?.[0] !== undefined ? assignRowKeys?.[0] : "";
        if (elementKey) {
          element.key = elementKey;
        }

        // Pasa a la siguiente iteración del bucle
        continue;
      }

      // Comportamiento para trastes diferentes del primero (index !== 0) si `lockTheZeroChord` es true
      if (index !== 0 && lockTheZeroChord === true) {
        if (index >= startFromTheChord) {
          // Asigna teclas de la fila si están disponibles, de lo contrario asigna "OCULTAR"
          if (index < assignRowKeys?.length + keysByRow + 2) {
            element.key =
              assignRowKeys[index - startFromTheChord + 1] === undefined
                ? "OCULTAR"
                : assignRowKeys[index - startFromTheChord + 1];
          } else {
            element.key = undefined;
          }
        } else {
          element.key = "OCULTAR";
        }
      }

      // Bloqueo adicional de trastes fuera del rango permitido para `lockTheZeroChord`
      if (
        index === keysByRow + startFromTheChord &&
        lockTheZeroChord === true
      ) {
        element.key = "OCULTAR";
      }

      // Si `lockTheZeroChord` está en false, asigna teclas hasta que se alcance el final de la fila de teclas
      if (lockTheZeroChord === false) {
        if (index <= assignRowKeys?.length + keysByRow + 1) {
          element.key = assignRowKeys[index - startFromTheChord];
        } else {
          element.key = undefined;
        }
      }

      // Asignación específica de ocultación en casos no permitidos
      if (lockTheZeroChord === false && index <= startFromTheChord - 1) {
        element.key = "OCULTAR";
      }

      if (index > keysByRow + startFromTheChord) {
        element.key = "OCULTAR";
      }

      // Fin de la iteración de las notas
    }

    // Filtra las notas que no deben estar ocultas y devuelve solo los visibles
    const newFrets = findRope.frets.filter((f) => f.key !== "OCULTAR");

    // Almacena el resultado final, con cada cuerda y sus notas visibles en cada iteración
    result = [...result, { rope: findRope.rope, frets: newFrets }];
  }

  // Retorna el resultado final
  return result;
};