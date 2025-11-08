import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  EventEmitter,
  Output,
} from '@angular/core';
import { IonContent, IonRippleEffect } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import AppHeader from '@components/header';
import { BIRDS, type BirdItem } from '@data/bird';

@Component({
  selector: 'app-birds',
  standalone: true,
  imports: [IonContent, IonRippleEffect, RouterLink, AppHeader],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <div class="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <app-header
          [title]="'Fauna - Pájaros'"
          [subtitle]="'Selecciona o marca tus especies favoritas'"
          [showBackButton]="true"
        />

        <div class="mb-4">
          <label for="search" class="sr-only">Buscar</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar pájaro (nombre común o científico)..."
            [value]="query()"
            (input)="onSearch($event)"
            class="w-full rounded-lg border border-muted bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
          />
        </div>

        <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          @for ( bird of filteredBirds(); track bird.id) {
          <div
            class="relative group overflow-hidden rounded-xl border border-muted bg-surface shadow-sm transition-all hover:shadow-md active:scale-[0.99] p-4"
          >
            <button
              type="button"
              class="absolute right-3 top-3 z-10 rounded-full p-1 text-basecolor/80 hover:text-primary focus-visible:ring-1 ring-primary active:scale-95 transition"
              aria-label="Favorito"
              (click)="toggleFavorite(bird.id)"
            >
              <span class="transition-colors" [class.text-primary]="bird.favorite">
                {{ bird.favorite ? '★' : '☆' }}
              </span>
              <ion-ripple-effect class="pointer-events-none absolute inset-0" />
            </button>

            <a [routerLink]="['/birds', bird.id]" class="block">
              <h3 class="text-sm font-semibold leading-snug mb-1">
                {{ bird.commonName }}
              </h3>
              <p class="text-xs italic text-muted">
                {{ bird.scientificName }}
              </p>
            </a>
          </div>
          }
        </section>
      </div>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class BirdsPage {
  @Output() birdSelected = new EventEmitter<BirdItem>();

  #initialBirds: BirdItem[] = BIRDS;

  birds = signal<BirdItem[]>(this.#initialBirds);
  query = signal('');

  filteredBirds = computed(() => {
    const q = this.query().toLowerCase().trim();
    const all = this.birds();
    const filtered = q
      ? all.filter(
          (b) =>
            b.commonName.toLowerCase().includes(q) || b.scientificName.toLowerCase().includes(q)
        )
      : all;

    // favoritos primero
    const favs = filtered.filter((b) => b.favorite);
    const rest = filtered.filter((b) => !b.favorite);
    return [...favs, ...rest];
  });

  onSearch(input: Event): void {
    const value = (input.target as HTMLInputElement).value;
    this.query.set(value);
  }

  toggleFavorite(id: number): void {
    this.birds.update((arr) => arr.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  }
}
