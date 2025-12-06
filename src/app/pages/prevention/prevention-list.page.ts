import { Component } from '@angular/core';
import ActionCards, { type ActionCardItem } from '@components/action-cards';

@Component({
  selector: 'app-prevention-list',
  imports: [ActionCards],
  template: `
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="text-xl font-semibold tracking-tight mb-4 text-center md:text-left">Prevención</h2>
      <app-action-cards [items]="cards" />
    </div>
  `,
  host: { class: 'flex flex-col h-full w-full' },
})
export default class PreventionListPage {
  cards: ActionCardItem[] = [
    {
      icon: '👁️',
      title: 'Observación',
      description: 'Registro de observaciones.',
      routerLink: ['observation'],
      color: 'primary',
    },
    {
      icon: '🛣️',
      title: 'Revisión pista',
      description: 'Inspección de pista.',
      routerLink: ['track-review'],
      color: 'secondary',
    },
    {
      icon: '🧱',
      title: 'Revisión perimetral',
      description: 'Inspección del perímetro.',
      routerLink: ['perimeter-review'],
      color: 'primary',
    },
    {
      icon: '🐕',
      title: 'Revisión perro',
      description: 'Control con unidad canina.',
      routerLink: ['dog-review'],
      color: 'secondary',
    },
    {
      icon: '🦅',
      title: 'Vuelo de marcaje',
      description: 'Control mediante cetrería.',
      routerLink: ['marking-flight'],
      color: 'primary',
    },
    {
      icon: '🪤',
      title: 'Colocación trampas',
      description: 'Gestión de trampas.',
      routerLink: ['traps-placement'],
      color: 'secondary',
    },
  ];
}
