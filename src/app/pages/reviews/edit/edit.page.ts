import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { IonContent, IonRippleEffect } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import AppHeader from '@components/header';

interface BirdItem {
  id: number;
  name: string;
  image: string;
  favorite: boolean;
}

@Component({
  selector: 'app-birds',
  imports: [IonContent, IonRippleEffect, RouterLink, AppHeader],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <div class="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <app-header
          [title]="'Fauna - Pajaros'"
          [subtitle]="'Selecciona un pájaro o marca como favorito'"
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
              class="flex flex-col items-center justify-center gap-2 p-4 text-center"
            >
              <img
                [src]="bird.image"
                [alt]="bird.name"
                loading="lazy"
                class="h-16 w-16 rounded-md object-cover"
              />
              <div class="text-sm font-medium truncate w-full text-ellipsis text-basecolor">
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
  private readonly initialBirds: BirdItem[] = [
    {
      id: 1,
      name: 'Gorrión común',
      image: 'https://picsum.photos/seed/sparrow/100',
      favorite: false,
    },
    { id: 2, name: 'Paloma', image: 'https://picsum.photos/seed/pigeon/100', favorite: false },
    { id: 3, name: 'Cuervo', image: 'https://picsum.photos/seed/crow/100', favorite: false },
    { id: 4, name: 'Canario', image: 'https://picsum.photos/seed/canary/100', favorite: false },
    { id: 5, name: 'Golondrina', image: 'https://picsum.photos/seed/swallow/100', favorite: false },
    { id: 6, name: 'Petirrojo', image: 'https://picsum.photos/seed/robin/100', favorite: false },
    { id: 7, name: 'Mirlo', image: 'https://picsum.photos/seed/blackbird/100', favorite: false },
    { id: 8, name: 'Vencejo', image: 'https://picsum.photos/seed/swift/100', favorite: false },
    { id: 9, name: 'Halcón', image: 'https://picsum.photos/seed/falcon/100', favorite: false },
    { id: 10, name: 'Águila', image: 'https://picsum.photos/seed/eagle/100', favorite: false },
    { id: 11, name: 'Búho', image: 'https://picsum.photos/seed/owl/100', favorite: false },
    { id: 12, name: 'Lechuza', image: 'https://picsum.photos/seed/barnowl/100', favorite: false },
    { id: 13, name: 'Gaviota', image: 'https://picsum.photos/seed/seagull/100', favorite: false },
    {
      id: 14,
      name: 'Cormorán',
      image: 'https://picsum.photos/seed/cormorant/100',
      favorite: false,
    },
    { id: 15, name: 'Abubilla', image: 'https://picsum.photos/seed/hoopoe/100', favorite: false },
    { id: 16, name: 'Carbonero', image: 'https://picsum.photos/seed/tit/100', favorite: false },
    {
      id: 17,
      name: 'Jilguero',
      image: 'https://picsum.photos/seed/goldfinch/100',
      favorite: false,
    },
    { id: 18, name: 'Cigüeña', image: 'https://picsum.photos/seed/stork/100', favorite: false },
    {
      id: 19,
      name: 'Martín pescador',
      image: 'https://picsum.photos/seed/kingfisher/100',
      favorite: false,
    },
    { id: 20, name: 'Zorzal', image: 'https://picsum.photos/seed/thrush/100', favorite: false },
  ];

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
