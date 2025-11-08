import { Component, computed, signal, EventEmitter, Output } from '@angular/core';
import {
  IonCard,
  IonContent,
  IonIcon,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';

import AppHeader from '@components/header';
import { BIRDS, type BirdItem } from '@data/bird';
import { addIcons } from 'ionicons';
import { starOutline, star } from 'ionicons/icons';

@Component({
  selector: 'app-birds',
  imports: [
    IonContent,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    AppHeader,
    IonIcon,
    IonButton,
  ],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <div class="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <app-header
          [title]="'Actuación - Especies'"
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

        <section class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          @for ( bird of filteredBirds(); track bird.id) {
          <ion-card
            class="relative flex justify-between group overflow-hidden rounded-xl border cursor-pointer
            shadow-sm transition-all hover:shadow-md active:scale-[0.99] p-4"
          >
            <div>
              <ion-card-header>
                <ion-card-title clas="text-md"> {{ bird.commonName }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                {{ bird.scientificName }}
              </ion-card-content>
            </div>
            <ion-button fill="clear" (click)="toggleFavorite(bird.id)" aria-label="Favorito">
              @if(bird.favorite){
              <ion-icon name="star" color="primary" size="large" />
              } @else{
              <ion-icon name="star-outline" />
              }
            </ion-button>
          </ion-card>
          }
        </section>
      </div>
    </ion-content>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class ActingPage {
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

    const favs = filtered.filter((b) => b.favorite);
    const rest = filtered.filter((b) => !b.favorite);
    return [...favs, ...rest];
  });

  constructor() {
    addIcons({ starOutline, star });
  }

  onSearch(input: Event): void {
    const value = (input.target as HTMLInputElement).value;
    this.query.set(value);
  }

  toggleFavorite(id: number): void {
    this.birds.update((arr) => arr.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  }
}
