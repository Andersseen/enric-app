import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { IonContent, IonRippleEffect } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import AppHeader from '@components/header';
import { BIRDS, type BirdItem } from '@data/bird';

@Component({
  selector: 'app-birds',
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
            placeholder="Buscar pájaro..."
            [value]="query()"
            (input)="onSearch($event)"
            class="w-full rounded-lg border border-muted bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
          />
        </div>

        <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          @for (bird of filteredBirds(); track bird.id) {
          <div
            class="relative group overflow-hidden rounded-xl border border-muted bg-surface shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
          >
            <button
              type="button"
              class="absolute right-2 top-2 z-10 rounded-full p-1 text-basecolor/80 hover:text-primary focus-visible:ring-1 ring-primary active:scale-95 transition"
              aria-label="Favorito"
              (click)="toggleFavorite(bird.id)"
            >
              <span class="transition-colors" [class.text-primary]="bird.favorite">
                {{ bird.favorite ? '★' : '☆' }}
              </span>
              <ion-ripple-effect class="pointer-events-none absolute inset-0" />
            </button>

            <a
              [routerLink]="['/birds', bird.id]"
              class="relative block w-full pb-[100%] overflow-hidden"
            >
              <img
                [src]="bird.image"
                [alt]="bird.name"
                loading="lazy"
                class="absolute inset-0 h-full w-full object-cover"
              />
              <div
                class="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm px-2 py-1 text-center text-xs font-medium text-white"
              >
                {{ bird.name }}
              </div>
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
  private readonly initialBirds: BirdItem[] = BIRDS;

  birds = signal<BirdItem[]>(this.initialBirds);
  query = signal('');

  filteredBirds = computed(() => {
    const q = this.query().toLowerCase().trim();
    const all = this.birds();
    const filtered = q ? all.filter((b) => b.name.toLowerCase().includes(q)) : all;

    return [...filtered.filter((b) => b.favorite), ...filtered.filter((b) => !b.favorite)];
  });

  onSearch(input: Event): void {
    const value = (input.target as HTMLInputElement).value;
    this.query.set(value);
  }

  toggleFavorite(id: number): void {
    this.birds.update((arr) => arr.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  }
}
