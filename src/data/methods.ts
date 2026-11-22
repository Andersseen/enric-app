/**
 * Métodos de "Vuelo dispersión": con halcón o con Harris. Los dos usan un
 * animal (paso "Animal empleado") y permiten indicar capturas.
 */
export const FALCON_FLIGHT = 'Vuelo dispersión halcón';
export const HARRIS_FLIGHT = 'Vuelo dispersión Harris';

export function isFlightMethod(method: unknown): boolean {
  return method === FALCON_FLIGHT || method === HARRIS_FLIGHT;
}
