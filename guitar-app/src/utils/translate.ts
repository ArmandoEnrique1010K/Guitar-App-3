const words: Record<string, string> = {
  'map': 'Mapa',
  // Tipos
  'distortion': 'Distorsión',
  'vibrato': 'Vibración',
  // Efectos
  'wet': 'Mezcla',
  'oversample': 'Muestreo',
  'frequency': 'Frecuencia',
  'depth': 'Profundidad',
  'type': 'Tipo',
  'maxDelay': 'Latencia máxima',
};

export const translate = (word: string): string => {
  return words[word] || word;
};