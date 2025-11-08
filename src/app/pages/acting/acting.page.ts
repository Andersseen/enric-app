import { Component, computed, signal, EventEmitter, OnDestroy } from '@angular/core';
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
import { starOutline, star, checkmark, close, chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-acting',
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
      <div class="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <app-header
          [title]="'Actuación - Especies'"
          [subtitle]="'Selecciona o marca tus especies favoritas'"
          [showBackButton]="true"
        />

        <!-- SEARCH + TOGGLE SELECTED PANEL -->
        <div
          class="mb-4 flex items-center justify-between gap-4 sticky top-0 z-10 bg-background w-full"
        >
          <div class="flex-1">
            <label for="search" class="sr-only">Buscar</label>
            <input
              id="search"
              type="text"
              placeholder="Buscar pájaro (nombre común o científico)..."
              [value]="query()"
              (input)="onSearch($event)"
              class="w-full rounded-lg border border-muted bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
              aria-label="Buscar especies"
            />
          </div>

          <!-- Toggle panel button -->
          <ion-button
            (click)="toggleSelectedPanel()"
            [attr.aria-expanded]="selectedPanelOpen()"
            aria-controls="selected-panel"
            aria-label="Abrir lista de seleccionados"
            title="Mostrar seleccionados"
            shape="outline"
          >
            <ion-icon name="chevron-forward"></ion-icon>
            <span class="hidden sm:inline">Seleccionados</span>
            <span class="ml-1 font-medium">{{ selected().length }}</span>
          </ion-button>
        </div>

        <!-- GRID OF BIRDS -->
        <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          @for ( bird of filteredBirds(); track bird.id) {
          <ion-card
            class="relative flex justify-between group overflow-hidden rounded-xl border cursor-pointer
            shadow-sm transition-all hover:shadow-md active:scale-[0.99] p-4"
            role="button"
            tabindex="0"
            (click)="onCardClick(bird, $event)"
            (keydown.enter)="onCardClick(bird, $event)"
            (keydown.space)="onCardClick(bird, $event)"
            aria-pressed="{{ selected().includes(bird.id) }}"
            [attr.aria-label]="'Seleccionar ' + bird.commonName"
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

              <!-- Selected indicator -->
              <button
                class="rounded-full p-2"
                (click)="toggleSelect(bird.id); $event.stopPropagation()"
                [attr.aria-pressed]="selected().includes(bird.id)"
                aria-label="Seleccionar"
                title="Seleccionar"
              >
                @if(selected().includes(bird.id)){
                <ion-icon name="checkmark" color="success" />
                } @else {
                <div class="w-4 h-4 rounded border"></div>
                }
              </button>
            </div>
          </ion-card>
          }
        </section>
      </div>

      @if(selectedPanelOpen()){
      <div class="fixed inset-0 z-40 bg-black/40" (click)="closePanel()" aria-hidden="true"></div>
      }

      <!-- SELECTED SIDEBAR -->
      <aside
        id="selected-panel"
        role="region"
        aria-label="Lista de especies seleccionadas"
        [attr.aria-hidden]="!selectedPanelOpen()"
        class="hidden sm:flex flex-col gap-4 fixed top-0 right-0 z-50 h-full min-h-screen w-80 max-w-full transform transition-transform duration-300 ease-in-out
               bg-surface/95 backdrop-blur-sm border-l p-4 shadow-lg"
        [class.translate-x-full]="!selectedPanelOpen()"
        [class.translate-x-0]="selectedPanelOpen()"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-medium">Seleccionados ({{ selected().length }})</h3>
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-md"
              (click)="toggleSelectedPanel()"
              aria-label="Cerrar lista de seleccionados"
              title="Cerrar"
            >
              <ion-icon name="close"></ion-icon>
            </button>
          </div>
        </div>

        <div class="overflow-y-auto max-h-[calc(100%-72px)] pr-2">
          @if(selected().length === 0) {
          <p class="text-sm text-muted">No hay especies seleccionadas.</p>
          } @else {
          <ul class="space-y-2">
            @for (b of selectedBirds(); track b.id) {
            <li class="flex items-center justify-between gap-3 rounded-md p-2 hover:bg-muted/10">
              <div class="min-w-0">
                <div class="font-medium truncate">{{ b.commonName }}</div>
                <div class="text-xs text-muted truncate">{{ b.scientificName }}</div>
              </div>

              <div class="flex items-center gap-2">
                <!-- input numérico para la cantidad -->
                <input
                  type="number"
                  min="0"
                  class="w-20 rounded border px-2 py-1 text-sm"
                  [value]="counts()[b.id]"
                  (input)="onCountInput(b.id, $event)"
                  aria-label="Cantidad de {{ b.commonName }}"
                />

                <button
                  class="p-2"
                  (click)="removeSelected(b.id)"
                  aria-label="Quitar selección"
                  title="Quitar"
                >
                  <ion-icon name="close"></ion-icon>
                </button>
              </div>
            </li>
            }
          </ul>
          }
          <ion-button
            (click)="clearSelection()"
            [disabled]="!selected().length"
            aria-label="Limpiar seleccionados"
            title="Limpiar"
            expand="block"
            color="danger"
          >
            Limpiar
          </ion-button>
        </div>

        <ion-button expand="block" color="success"> Seguir </ion-button>
      </aside>

      <!-- RESPONSIVE: small screens -> bottom sheet behavior -->
      <div
        class="sm:hidden fixed left-0 right-0 bottom-0 z-50"
        [attr.aria-hidden]="!selectedPanelOpen()"
        [class.hidden]="!selectedPanelOpen()"
      >
        <div class="bg-surface/98 border-t p-3 shadow-lg">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium">Seleccionados ({{ selected().length }})</h4>
            <button (click)="toggleSelectedPanel()" aria-label="Cerrar">
              <ion-icon name="close"></ion-icon>
            </button>
          </div>

          <div class="overflow-y-auto max-h-56">
            @if(selected().length === 0) {
            <p class="text-sm text-muted">No hay especies seleccionadas.</p>
            } @else {
            <ul class="space-y-2">
              @for (b of selectedBirds(); track b.id) {
              <li class="flex items-center justify-between gap-3">
                <div>
                  <div class="font-medium truncate">{{ b.commonName }}</div>
                  <div class="text-xs text-muted truncate">{{ b.scientificName }}</div>
                </div>

                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    class="w-20 rounded border px-2 py-1 text-sm"
                    [value]="counts()[b.id]"
                    (input)="onCountInput(b.id, $event)"
                    aria-label="Cantidad de {{ b.commonName }}"
                  />
                  <button (click)="removeSelected(b.id)" aria-label="Quitar selección">
                    <ion-icon name="close"></ion-icon>
                  </button>
                </div>
              </li>
              }
            </ul>
            }
            <ion-button
              (click)="clearSelection()"
              [disabled]="!selected().length"
              aria-label="Limpiar seleccionados"
              title="Limpiar"
              expand="block"
              color="danger"
            >
              Limpiar
            </ion-button>
          </div>
        </div>
        <ion-button expand="block" color="success"> Seguir </ion-button>
      </div>
    </ion-content>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class ActingPage implements OnDestroy {
  birdSelected = new EventEmitter<BirdItem[]>();

  #initialBirds: BirdItem[] = BIRDS;

  birds = signal<BirdItem[]>(this.#initialBirds);
  query = signal('');

  selected = signal<number[]>([]);
  selectedPanelOpen = signal(false);

  counts = signal<Record<number, number>>({});

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

  selectedBirds = computed(() => this.birds().filter((b) => this.selected().includes(b.id)));

  #escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.selectedPanelOpen()) {
      this.selectedPanelOpen.set(false);
    }
  };

  constructor() {
    addIcons({ starOutline, star, checkmark, close, chevronForward });
    document.addEventListener('keydown', this.#escapeHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.#escapeHandler);
  }

  onSearch(input: Event): void {
    const value = (input.target as HTMLInputElement).value;
    this.query.set(value);
  }

  toggleFavorite(id: number): void {
    this.birds.update((arr) => arr.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  }

  toggleSelect(id: number): void {
    const cur = this.selected();
    if (cur.includes(id)) {
      this.selected.set(cur.filter((x) => x !== id));
      this.counts.update((c) => {
        const copy = { ...c };
        delete copy[id];
        return copy;
      });
    } else {
      this.selected.set([...cur, id]);

      this.counts.update((c) => ({ ...(c ?? {}), [id]: c?.[id] ?? 0 }));
    }
    this.birdSelected.emit(this.selectedBirds());
  }

  closePanel(): void {
    this.selectedPanelOpen.set(false);
  }

  onCardClick(bird: BirdItem, ev: Event): void {
    this.toggleSelect(bird.id);
  }

  clearSelection(): void {
    this.selected.set([]);
    this.counts.set({});
    this.birdSelected.emit([]);
  }

  toggleSelectedPanel(): void {
    this.selectedPanelOpen.update((v) => !v);
  }

  onCountInput(id: number, ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    const num = Math.max(0, Number.parseInt(v || '0', 10) || 0);
    this.counts.update((c) => ({ ...(c ?? {}), [id]: num }));
  }

  removeSelected(id: number): void {
    this.selected.set(this.selected().filter((x) => x !== id));
    this.counts.update((c) => {
      const copy = { ...c };
      delete copy[id];
      return copy;
    });
    this.birdSelected.emit(this.selectedBirds());
  }
}
