import type { MessageKey } from './i18n';

/**
 * Opciones de selección: el VALOR (en castellano) es lo que se guarda y sale en
 * el Excel; la CLAVE es el texto traducido que se muestra en pantalla.
 */
export const OPTION_KEYS = {
  yesNo: { Si: 'yes', No: 'no' },
  behavior: {
    Posado: 'perched',
    Volando: 'flying',
    Cruzando: 'crossing',
    Alimentación: 'feeding',
    Corriendo: 'running',
    Parado: 'stopped',
    Atrapado: 'trapped',
  },
  actionType: {
    Dispersión: 'dispersal',
    Observación: 'observation',
    Revisión: 'review',
    Retirar: 'removal',
    'FOD Fauna': 'fodWildlife',
    Otras: 'other',
  },
  method: {
    Bocina: 'horn',
    Ahuyentador: 'repeller',
    Pirotecnia: 'pyrotechnics',
    Láser: 'laser',
    Perro: 'dog',
    'Vuelo dispersión': 'flight',
    'Vuelo dispersión halcón': 'falconFlight',
    'Vuelo dispersión Harris': 'harrisFlight',
    Observación: 'observation',
  },
  trapAction: { Captura: 'capture', Retirar: 'removal' },
  trapMethod: {
    'Bal-chatri': 'balChatri',
    Lazo: 'snare',
    'Jaula trampa': 'cageTrap',
    Manual: 'manual',
    capillo: 'hood',
  },
  flightMethod: { Halcón: 'falcon', Harris: 'harris' },
  weather: {
    Despejado: 'clear',
    'Despejado/viento': 'clearWind',
    Claros: 'sunnySpells',
    'Claros/viento': 'sunnySpellsWind',
    Nublado: 'cloudy',
    'Nublado/viento': 'cloudyWind',
    Lluvioso: 'showery',
    'Lluvioso/viento': 'showeryWind',
    Lluvia: 'rain',
    'Lluvia/viento': 'rainWind',
    Tormenta: 'storm',
  },
} as const satisfies Record<string, Record<string, string>>;

export type OptionGroup = keyof typeof OPTION_KEYS;

/**
 * Clave de traducción del texto que se muestra para un valor guardado,
 * o `null` si el valor no es una opción conocida (p. ej. un nombre propio).
 */
export function optionKey(group: OptionGroup, value: unknown): MessageKey | null {
  const id = (OPTION_KEYS[group] as Record<string, string>)[String(value)];
  return id ? (`options.${group}.${id}` as MessageKey) : null;
}

/**
 * Texto que se muestra para un valor guardado: traducido si es una opción
 * conocida, el propio valor si no (p. ej. un nombre), o "-" si está vacío.
 */
export function optionLabel(
  t: (key: MessageKey) => string,
  group: OptionGroup,
  value: unknown,
): string {
  if (value === null || value === undefined || value === '') return '-';
  const key = optionKey(group, value);
  return key ? t(key) : String(value);
}
