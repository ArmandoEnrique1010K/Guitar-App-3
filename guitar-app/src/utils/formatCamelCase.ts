// Separa por mayusculas y formatea el texto
export function formatCamelCase(text: string) {
  return text.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}

// Ejemplo:
// "cleanSolo" --> "Clean Solo"