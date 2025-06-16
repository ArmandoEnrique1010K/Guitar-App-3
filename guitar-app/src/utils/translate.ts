const words: Record<string, string> = {
  'map': 'Mapa',
  'distortion': 'Distorsión',
  'wet': 'Balance'
};

export const translate = (word: string): string => {
  return words[word] || word;
};