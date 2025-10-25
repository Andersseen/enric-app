import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import AppHeader from '@components/header';
import ActionCards, { type ActionCardItem } from '@components/action-cards';

@Component({
  selector: 'app-home',
  imports: [IonContent, AppHeader, ActionCards],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <div class="mx-auto max-w-xl px-4 py-8 md:py-12 lg:py-16">
        <app-header
          [title]="'Operaciones Aeropuerto'"
          [subtitle]="'Selecciona una opción para continuar'"
        />
        <app-action-cards [items]="cards" />
      </div>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class Home {
  cards: ActionCardItem[] = [
    {
      icon: '📝',
      title: 'Revisiones',
      description: 'Registrar inspecciones por ruta y horario.',
      routerLink: ['reviews'],
      color: 'primary',
    },
    {
      icon: '🦅',
      title: 'Ver la fauna',
      description: 'Consulta especies avistadas y conteos previos.',
      routerLink: ['wildlife'],
      color: 'secondary',
    },
  ];
}
