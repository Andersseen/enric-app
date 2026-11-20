import { defineI18n, type I18nMessageKey } from '@etyma/core';
import es from './es.json';

/**
 * Idiomas de la app. El castellano es el idioma base (siempre cargado);
 * el catalán se carga solo cuando se elige.
 *
 * Importante: se traduce solo lo que se ve. Los valores que se guardan
 * (p. ej. "Volando", "Bocina", "Si") y las cabeceras de los Excel siguen en
 * castellano, porque el SCF es un formato oficial.
 */
export const i18n = defineI18n({
  locales: ['es', 'ca'],
  sourceLocale: 'es',
  source: es,
  loaders: {
    ca: () => import('./ca.json'),
  },
});

export type AppLocale = 'es' | 'ca';
export const APP_LOCALES: AppLocale[] = ['es', 'ca'];

/** Clave de traducción tipada (para claves construidas en tiempo de ejecución). */
export type MessageKey = I18nMessageKey<typeof i18n>;
