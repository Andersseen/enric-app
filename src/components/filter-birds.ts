import { Component, computed, signal, inject } from '@angular/core';
import {
  IonCard,
  IonIcon,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { BIRDS, type BirdItem } from '@data/bird';
import { addIcons } from 'ionicons';
import { starOutline, star, checkmark, close, chevronForward } from 'ionicons/icons';
import SearchBar from '@components/searchbar';
import StoreService from '@service/state';

@Component({
  selector: 'app-filter-birds',
  imports: [IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonIcon, IonButton, SearchBar],
  template: `
    <div class="mx-auto p-8">
      <!-- SEARCH + TOGGLE SELECTED PANEL -->

      <app-search-bar class="w-full" (valueChange)="onSearch($event)" />

      <!-- GRID OF BIRDS -->
      <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        @for ( bird of filteredBirds(); track bird.id) {
        <ion-card
          class="relative flex justify-between overflow-hidden rounded-xl border cursor-pointer transition-all p-2 h-20"
          role="button"
          tabindex="0"
          (click)="onCardClick(bird)"
          [attr.aria-label]="'Seleccionar ' + bird.commonName"
          [class.border-4]="selectedBird()?.id === bird.id"
          [class.border-primary]="selectedBird()?.id === bird.id"
        >
          <div class="min-w-0 pr-2">
            <ion-card-header>
              <ion-card-title class="text-md truncate"> {{ bird.commonName }}</ion-card-title>
            </ion-card-header>
            <ion-card-content class="text-sm text-muted truncate">
              {{ bird.scientificName }}
            </ion-card-content>
          </div>

          <div class="flex items-start gap-2">
            <!-- Favorite toggle -->
            <ion-button
              fill="clear"
              (click)="toggleFavorite(bird.id); $event.stopPropagation()"
              aria-label="Favorito"
              title="Marcar favorito"
            >
              @if(bird.favorite){
              <ion-icon name="star" color="primary" size="large" />
              } @else{
              <ion-icon name="star-outline" />
              }
            </ion-button>
          </div>
        </ion-card>
        }
      </section>
    </div>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class FilterBirds {
  #store = inject(StoreService);

  #initialBirds: BirdItem[] = BIRDS;

  birds = signal<BirdItem[]>(this.#initialBirds);
  query = signal('');

  selectedBird = signal({} as BirdItem);

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
    addIcons({ starOutline, star, checkmark, close, chevronForward });
  }

  onSearch(value: string): void {
    this.query.set(value);
  }

  toggleFavorite(id: number): void {
    this.birds.update((arr) => arr.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  }

  onCardClick(bird: BirdItem): void {
    this.selectedBird.set(bird);
    this.#store.setValueForCurrentStep(bird);
  }
}
