import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import SessionHeaderComponent from '@components/session-header';
import ActionCards, { type ActionCardItem } from '@components/action-cards';

@Component({
  selector: 'app-home',
  imports: [IonContent, SessionHeaderComponent, ActionCards],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <div class="mx-auto max-w-5xl px-4 py-8 md:py-10 lg:py-12 space-y-8">
        <app-session-header (sessionChange)="onSessionChange($event)" />

        <div>
          <h2 class="text-xl font-semibold tracking-tight mb-4 text-center md:text-left">
            Acciones disponibles
          </h2>

          <app-action-cards [items]="cards" />
        </div>
      </div>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class Home {
  cards: ActionCardItem[] = [
    {
      icon: '🧰',
      title: 'Prevención',
      description: 'Medidas preventivas de fauna en pista.',
      routerLink: ['prevention'],
      color: 'primary',
    },
    {
      icon: '🚨',
      title: 'Actuación',
      description: 'Registrar acciones ejecutadas en campo.',
      routerLink: ['action'],
      color: 'secondary',
    },
    {
      icon: '🎯',
      title: 'Trampas',
      description: 'Revisión y control de trampas activas.',
      routerLink: ['traps'],
      color: 'primary',
    },
  ];

  onSessionChange(data: unknown): void {
    console.log('Session updated', data);
  }
}
