import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import ThemeService from '@service/theme.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet />
    </ion-app>
  `,
})
export default class App {
  // Se inyecta aquí para aplicar el tema guardado (claro/oscuro) en cualquier
  // pantalla de entrada, no solo al pasar por la pantalla de inicio.
  #theme = inject(ThemeService);
}
