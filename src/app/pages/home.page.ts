import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  imports: [IonContent, IonRippleEffect],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <div class="mx-auto max-w-xl px-4 py-8 md:py-12 lg:py-16">
        <header class="mb-8 md:mb-10">
          <h1 class="text-2xl font-semibold tracking-tight">Operaciones Aeropuerto</h1>
          <p class="mt-2 text-sm text-muted">Selecciona una opción para continuar</p>
        </header>

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            [class]="reviewsBtnClass()"
            (click)="goTo('reviews')"
            (focus)="focused.set('reviews')"
            (blur)="focused.set(null)"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-on-primary"
                aria-hidden="true"
              >
                <span class="text-xl">📝</span>
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-base font-medium">Revisiones</h2>
                <p class="mt-1 line-clamp-2 text-sm text-muted">
                  Registrar inspecciones por ruta y horario.
                </p>
              </div>
            </div>
            <ion-ripple-effect class="pointer-events-none absolute inset-0" />
          </button>

          <button
            type="button"
            [class]="wildlifeBtnClass()"
            (click)="goTo('wildlife')"
            (focus)="focused.set('wildlife')"
            (blur)="focused.set(null)"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-on-secondary"
                aria-hidden="true"
              >
                <span class="text-xl">🦅</span>
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-base font-medium">Ver la fauna</h2>
                <p class="mt-1 line-clamp-2 text-sm text-muted">
                  Consulta especies avistadas y conteos previos.
                </p>
              </div>
            </div>
            <ion-ripple-effect class="pointer-events-none absolute inset-0" />
          </button>
        </section>
      </div>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full w-full font-sans antialiased',
  },
})
export default class Home {
  private readonly router = inject(Router);

  focused = signal<'reviews' | 'wildlife' | null>(null);

  baseBtnClass =
    'relative group overflow-hidden rounded-xl border border-muted bg-surface p-4 text-left shadow-sm transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary';

  reviewsBtnClass = computed(() => {
    const ring = this.focused() === 'reviews' ? ' focus-visible:ring-2' : '';
    return this.baseBtnClass + ring;
  });

  wildlifeBtnClass = computed(() => {
    const ring = this.focused() === 'wildlife' ? ' focus-visible:ring-2' : '';
    return this.baseBtnClass + ring;
  });

  goTo(dest: 'reviews' | 'wildlife'): void {
    void this.router.navigate([`home/${dest}`]);
  }
}
