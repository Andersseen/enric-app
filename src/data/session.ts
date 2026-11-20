/** Datos del turno que se eligen en la pantalla de inicio. */
export interface SessionData {
  weather: string;
  worker: string;
}

/** Datos comunes que lleva cada fila guardada en la tabla. */
export interface RecordMeta extends SessionData {
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
}
