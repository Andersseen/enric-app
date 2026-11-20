import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { injectI18n } from '@etyma/angular';
import { APP_LOCALES, AppLocale, i18n } from '@i18n/i18n';

const LOCALE_STORAGE_KEY = 'app-locale';

/**
 * Idioma de la app. Etyma no guarda el idioma elegido (no usa la URL en esta
 * app), así que se recuerda aquí con Capacitor Preferences.
 */
@Injectable({ providedIn: 'root' })
export default class LocaleService {
  readonly i18n = injectI18n(i18n);
  readonly locale = this.i18n.locale;

  /** Se ejecuta al arrancar la app (antes de pintar la primera pantalla). */
  async init(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: LOCALE_STORAGE_KEY });
      if (value && APP_LOCALES.includes(value as AppLocale) && value !== this.locale()) {
        await this.i18n.setLocale(value);
      }
    } catch (e) {
      console.error('Error loading locale', e);
    }
    this.applyDocumentLang();
  }

  async setLocale(locale: AppLocale): Promise<void> {
    await this.i18n.setLocale(locale);
    this.applyDocumentLang();
    await Preferences.set({ key: LOCALE_STORAGE_KEY, value: locale });
  }

  private applyDocumentLang(): void {
    document.documentElement.lang = this.locale();
  }
}
