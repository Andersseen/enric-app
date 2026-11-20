// Opciones para elegir un número de individuos (avistados o capturados).
// Del 0 al 30 uno a uno, y a partir de ahí en saltos cada vez mayores.
export const COUNT_OPTIONS: number[] = [
  ...Array.from({ length: 31 }, (_, i) => i),
  35, 40, 45, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 400, 500,
];
