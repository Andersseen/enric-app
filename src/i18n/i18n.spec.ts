import es from './es.json';
import ca from './ca.json';
import { OPTION_KEYS, OptionGroup, optionKey, optionLabel } from './options';
import { ACTING_STEP_TITLES, TRAPS_STEP_TITLES } from './step-titles';
import { WEATHER_OPTIONS } from '@data/weather';
import type { MessageKey } from './i18n';

type Catalog = { [key: string]: string | Catalog };

function flatKeys(catalog: Catalog, prefix = ''): string[] {
  return Object.entries(catalog).flatMap(([key, value]) =>
    typeof value === 'string' ? [prefix + key] : flatKeys(value, `${prefix}${key}.`),
  );
}

const esKeys = new Set(flatKeys(es as Catalog));
const caKeys = new Set(flatKeys(ca as Catalog));

describe('catálogos de idioma', () => {
  it('el catalán tiene exactamente las mismas claves que el castellano', () => {
    expect([...esKeys].filter((k) => !caKeys.has(k))).toEqual([]);
    expect([...caKeys].filter((k) => !esKeys.has(k))).toEqual([]);
  });

  it('ningún mensaje está vacío', () => {
    const empty = (catalog: Catalog) =>
      flatKeys(catalog).filter((key) => {
        const value = key.split('.').reduce<unknown>((o, k) => (o as Catalog)[k], catalog);
        return typeof value !== 'string' || value.trim() === '';
      });
    expect(empty(es as Catalog)).toEqual([]);
    expect(empty(ca as Catalog)).toEqual([]);
  });
});

describe('opciones', () => {
  it('cada opción tiene su texto en el catálogo', () => {
    const missing = (Object.keys(OPTION_KEYS) as OptionGroup[]).flatMap((group) =>
      Object.keys(OPTION_KEYS[group])
        .map((value) => optionKey(group, value))
        .filter((key) => !key || !esKeys.has(key)),
    );
    expect(missing).toEqual([]);
  });

  it('todas las climatologías se pueden traducir', () => {
    expect(WEATHER_OPTIONS.filter((w) => !optionKey('weather', w))).toEqual([]);
  });

  it('optionLabel traduce valores conocidos y deja igual el resto', () => {
    const t = (key: MessageKey) => `T(${key})`;
    expect(optionLabel(t, 'behavior', 'Volando')).toBe('T(options.behavior.flying)');
    expect(optionLabel(t, 'yesNo', 'Si')).toBe('T(options.yesNo.yes)');
    expect(optionLabel(t, 'method', 'Zeus')).toBe('Zeus');
    expect(optionLabel(t, 'method', '')).toBe('-');
    expect(optionLabel(t, 'method', null)).toBe('-');
  });
});

describe('títulos de los pasos', () => {
  it('todos los títulos existen en el catálogo', () => {
    const titles = [...Object.values(ACTING_STEP_TITLES), ...Object.values(TRAPS_STEP_TITLES)];
    expect(titles.filter((key) => !esKeys.has(key))).toEqual([]);
  });

  it('en Trampas el paso 6 es Interacción (no hay paso de Operación)', () => {
    expect(TRAPS_STEP_TITLES['step-6']).toBe('steps.interaction');
    expect(ACTING_STEP_TITLES['step-6']).toBe('steps.operation');
  });
});
