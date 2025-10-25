import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'app-reviews',
  imports: [IonContent, IonRippleEffect, RouterLink],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <div class="mx-auto max-w-xl px-4 py-8 md:py-12 lg:py-16">
        <div class="mb-6">
          <button
            type="button"
            routerLink="../"
            class="relative inline-flex items-center gap-2 rounded-lg border border-muted bg-surface px-3 py-2 text-sm font-medium shadow-sm transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary active:scale-[0.98]"
          >
            <span aria-hidden="true" class="text-lg">←</span>
            <span>Volver</span>
            <ion-ripple-effect class="pointer-events-none absolute inset-0" />
          </button>
        </div>

        <header class="mb-8 md:mb-10">
          <h1 class="text-2xl font-semibold tracking-tight text-center">Revisiones</h1>
          <p class="mt-2 text-sm text-muted text-center">Elige una opción</p>
        </header>

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            [class]="newBtnClass()"
            routerLink="new"
            (focus)="focused.set('new')"
            (blur)="focused.set(null)"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-on-primary"
                aria-hidden="true"
              >
                <span class="text-xl">➕</span>
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-base font-medium">Nuevo registro</h2>
                <p class="mt-1 line-clamp-2 text-sm text-muted">
                  Registrar inspecciones por ruta y horario.
                </p>
              </div>
            </div>
            <ion-ripple-effect class="pointer-events-none absolute inset-0" />
          </button>

          <button
            type="button"
            [class]="editBtnClass()"
            routerLink="edit"
            (focus)="focused.set('edit')"
            (blur)="focused.set(null)"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-on-secondary"
                aria-hidden="true"
              >
                <span class="text-xl">✏️</span>
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-base font-medium">Editar registro</h2>
                <p class="mt-1 line-clamp-2 text-sm text-muted">
                  Actualizar un registro existente.
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
export default class ReviewsPage {
  focused = signal<'new' | 'edit' | null>(null);

  baseBtnClass =
    'relative group overflow-hidden rounded-xl border border-muted bg-surface p-4 text-left shadow-sm transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary active:scale-[0.99]';

  newBtnClass = computed(() =>
    this.focused() === 'new' ? this.baseBtnClass + ' focus-visible:ring-2' : this.baseBtnClass
  );

  editBtnClass = computed(() =>
    this.focused() === 'edit' ? this.baseBtnClass + ' focus-visible:ring-2' : this.baseBtnClass
  );
}
