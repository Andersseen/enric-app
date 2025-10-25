import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  signal,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'app-reviews-new',
  imports: [IonContent, IonRippleEffect, RouterLink],
  template: `
    <ion-content
      [fullscreen]="true"
      class="text-basecolor"
      [scrollEvents]="false"
      (ionViewDidEnter)="onViewDidEnter()"
    >
      <div class="mx-auto max-w-xl px-4 py-6 md:py-8 lg:py-10">
        <h1 #pageTitle tabindex="-1" class="sr-only">Nuevo registro</h1>

        <div class="mb-4 flex items-center gap-2">
          <button
            type="button"
            routerLink="../"
            class="relative inline-flex items-center gap-2 rounded-lg border border-muted bg-surface px-3 py-2 text-sm font-medium shadow-sm transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary active:scale-[0.98]"
          >
            <span aria-hidden="true" class="text-lg">←</span>
            <span>Volver</span>
            <ion-ripple-effect class="pointer-events-none absolute inset-0" />
          </button>

          <div class="flex-1">
            <label for="search" class="sr-only">Buscar</label>
            <input
              #searchInput
              id="search"
              type="text"
              [value]="query()"
              (input)="onSearch($event)"
              placeholder="Buscar número (ej. 20)"
              class="w-full rounded-lg border border-muted bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            />
          </div>
        </div>

        <ul class="overflow-hidden rounded-xl border border-muted">
          @for (item of filteredItems(); track item) {
          <li class="border-b border-muted last:border-b-0">
            <a
              [routerLink]="['/reviews/new', item]"
              class="relative flex h-16 w-full items-center justify-center px-4 text-center text-base font-medium transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary active:scale-[0.99]"
            >
              <span>Ítem {{ item }}</span>
              <ion-ripple-effect class="pointer-events-none absolute inset-0" />
            </a>
          </li>
          }
        </ul>
      </div>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class ReviewsNewPage {
  @ViewChild('pageTitle', { static: true }) pageTitle?: ElementRef<HTMLElement>;
  @ViewChild('searchInput', { static: true }) searchInput?: ElementRef<HTMLInputElement>;

  readonly items = signal<number[]>(Array.from({ length: 20 }, (_, i) => i + 1));
  readonly query = signal<string>('');
  readonly filteredItems = computed(() => {
    const q = this.query().trim();
    if (!q) return this.items();
    return this.items().filter((n) => String(n).includes(q));
  });

  onSearch(input: Event): void {
    this.query.set((input.target as HTMLInputElement).value);
  }

  onViewDidEnter(): void {
    queueMicrotask(() => {
      if (this.searchInput?.nativeElement) {
        this.searchInput.nativeElement.focus();
        return;
      }
      this.pageTitle?.nativeElement?.focus();
    });
  }
}
