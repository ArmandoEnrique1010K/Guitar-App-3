const words: Record<string, string> = {
  'map': 'Mapa',
  'distortion': 'Distorsión',
  'wet': 'Balance',
  'oversample': 'Muestreo',
  'frequency': 'Frecuencia',
  'depth': 'Profundidad',
  'type': 'Tipo',
  'maxDelay': 'Latencia máxima',
};

export const translate = (word: string): string => {
  return words[word] || word;
};