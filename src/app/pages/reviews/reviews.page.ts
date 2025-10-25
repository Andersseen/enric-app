import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import AppHeader from '@components/header';
import ActionCards, { ActionCardItem } from '@components/action-cards';

@Component({
  selector: 'app-reviews',
  imports: [IonContent, AppHeader, ActionCards],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <div class="mx-auto max-w-xl px-4 py-8 md:py-12 lg:py-16">
        <app-header
          [title]="'Revisiones'"
          [subtitle]="'Elige una opción'"
          [showBackButton]="true"
        />
        <app-action-cards [items]="cards" />
      </div>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class ReviewsPage {
  cards: ActionCardItem[] = [
    {
      icon: '➕',
      title: 'Nuevo registro',
      description: 'Registrar inspecciones por ruta y horario.',
      routerLink: ['new'],
      color: 'primary',
    },
    {
      icon: '✏️',
      title: 'Editar registro',
      description: 'Actualizar un registro existente.',
      routerLink: ['edit'],
      color: 'secondary',
    },
  ];
}
