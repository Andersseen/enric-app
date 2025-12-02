import { Component } from '@angular/core';
import { BottomBarComponent } from '@components/bottom-bar';
import ActionCards, { type ActionCardItem } from '@components/action-cards';

@Component({
  selector: 'app-prevention',
  imports: [BottomBarComponent, ActionCards],
  template: `
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="text-xl font-semibold tracking-tight mb-4 text-center md:text-left">Prevención</h2>
      <app-action-cards [items]="cards" />
    </div>
    <app-bottom-bar />
  `,
  host: { class: 'flex flex-col h-full w-full' },
})
export default class PreventionPage {
  cards: ActionCardItem[] = [
    {
      icon: '👁️',
      title: 'Observación',
      description: 'Registro de observaciones.',
      routerLink: [],
      color: 'primary',
    },
    {
      icon: '🛣️',
      title: 'Revisión pista',
      description: 'Inspección de pista.',
      routerLink: [],
      color: 'secondary',
    },
    {
      icon: '🧱',
      title: 'Revisión perimetral',
      description: 'Inspección del perímetro.',
      routerLink: [],
      color: 'primary',
    },
    {
      icon: '🐕',
      title: 'Revisión perro',
      description: 'Control con unidad canina.',
      routerLink: [],
      color: 'secondary',
    },
    {
      icon: '🦅',
      title: 'Vuelo de marcaje',
      description: 'Control mediante cetrería.',
      routerLink: [],
      color: 'primary',
    },
    {
      icon: '🪤',
      title: 'Colocación trampas',
      description: 'Gestión de trampas.',
      routerLink: [],
      color: 'secondary',
    },
  ];
}
