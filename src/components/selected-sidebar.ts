import { Component, input, model, output } from '@angular/core';
import { BirdItem } from '@data/bird';
import { IonIcon, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-selected-sidebar',
  imports: [IonIcon, IonButton],
  template: `
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
          @if(!selected().length ) {
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
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class SelectedSidebar {
  selected = model<number[]>([]);
  counts = model<Record<number, number>>({});
  selectedPanelOpen = model(false);
  selectedBirds = input<BirdItem[]>([]);

  birdSelected = output<BirdItem[]>();

  closePanel(): void {
    this.selectedPanelOpen.set(false);
  }

  toggleSelectedPanel(): void {
    this.selectedPanelOpen.update((v) => !v);
  }

  clearSelection(): void {
    this.selected.set([]);
    this.counts.set({});
    this.birdSelected.emit([]);
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
