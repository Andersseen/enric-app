import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonBackButton } from '@ionic/angular/standalone';
import { IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  imports: [IonRippleEffect, RouterLink, IonBackButton],
  template: `
    @if (showBackButton()) {
    <div class="mb-6">
      <ion-back-button
        type="button"
        routerLink="../"
        class="relative inline-flex items-center gap-2 rounded-lg border border-muted bg-surface px-3 py-2 text-sm font-medium shadow-sm transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary active:scale-[0.98]"
        aria-label="Volver"
      >
        <span aria-hidden="true" class="text-lg">←</span>
        <span>Volver</span>
        <ion-ripple-effect class="pointer-events-none absolute inset-0" />
      </ion-back-button>
    </div>
    }

    <header class="mb-8 md:mb-10">
      <h1 class="text-2xl font-semibold tracking-tight text-center">
        {{ title() }}
      </h1>
      @if (subtitle()) {}
      <p class="mt-2 text-center text-sm text-muted">
        {{ subtitle() }}
      </p>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export default class AppHeader {
  title = input.required<string>();
  subtitle = input<string | null>(null);
  showBackButton = input<boolean>(false);

  backClicked = output<void>();
}
