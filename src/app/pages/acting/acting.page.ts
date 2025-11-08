import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import AppHeader from '@components/header';
import ActionCards, { ActionCardItem } from '@components/action-cards';

@Component({
  selector: 'app-wildlife',
  imports: [IonContent, AppHeader, ActionCards],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <div class="mx-auto max-w-xl px-4 py-8 md:py-12 lg:py-16">
        <app-header [title]="'Fauna'" [subtitle]="'Elige una opción'" [showBackButton]="true" />
        <app-action-cards [items]="cards" />
      </div>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class ActingPage {
  cards: ActionCardItem[] = [
    {
      icon: '➕',
      title: 'Nuevo registro',
      description: 'Crear un nuevo avistamiento de fauna.',
      routerLink: ['new'],
      color: 'secondary',
    },
    {
      icon: '✏️',
      title: 'Editar registro',
      description: 'Actualizar un registro existente.',
      routerLink: ['edit'],
      color: 'primary',
    },
  ];
}
