import { Component } from '@angular/core';
import ActionCards, { type ActionCardItem } from '@components/action-cards';

@Component({
  selector: 'app-list',
  imports: [ActionCards],
  template: `
    <div>
      <h2 class="text-xl font-semibold tracking-tight mb-4 text-center md:text-left">
        Acciones disponibles
      </h2>

      <app-action-cards [items]="cards" />
    </div>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class List {
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
      routerLink: ['action/step-1'],
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
}
