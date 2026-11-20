import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { provideEtyma } from '@etyma/angular';

import { routes } from './app.routes';
import { i18n } from '@i18n/i18n';
import LocaleService from '@service/locale.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideIonicAngular({}),
    provideEtyma(i18n),
    // Aplica el idioma guardado antes de pintar la primera pantalla
    provideAppInitializer(() => inject(LocaleService).init()),
  ],
};
