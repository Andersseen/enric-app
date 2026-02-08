import { Component, inject, computed } from '@angular/core';
import { IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
import ActionCards, { type ActionCardItem } from '@components/action-cards';
import SessionHeaderComponent from '@components/session-header';
import ThemeService from '@service/theme.service';

@Component({
  selector: 'app-list',
  imports: [ActionCards, SessionHeaderComponent, IonFab, IonFabButton, IonIcon],
  template: `
    <div>
      <!-- Session Configuration -->
      <app-session-header class="mb-6" />

      <h2
        class="text-xl font-semibold tracking-tight mb-4 text-center md:text-left text-foreground"
      >
        Acciones principales
      </h2>

      <app-action-cards [items]="mainActions" />

      <div class="mt-8 pt-6 border-t border-border">
        <h3
          class="text-lg font-semibold tracking-tight mb-3 text-center md:text-left text-foreground"
        >
          Reportes
        </h3>
        <app-action-cards [items]="reportsSection" />
      </div>

      <!-- Theme Toggle FAB -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button (click)="toggleTheme()" color="medium" size="small">
          <ion-icon [name]="themeIcon()"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </div>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class List {
  themeService = inject(ThemeService);

  // Computed signal for reactive icon
  themeIcon = computed(() =>
    this.themeService.theme() === 'dark' ? 'sunny-outline' : 'moon-outline',
  );

  constructor() {
    addIcons({ moonOutline, sunnyOutline });
  }

  mainActions: ActionCardItem[] = [
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

  reportsSection: ActionCardItem[] = [
    {
      icon: '📊',
      title: 'Mis Reportes',
      description: 'Ver, filtrar y compartir reportes generados.',
      routerLink: ['/home/prevention/reports'],
      color: 'primary',
    },
  ];

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
