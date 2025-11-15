import { Component, signal, computed, inject } from '@angular/core';
import { Zone, zones } from '@data/zones';
import StoreService from '@service/state';

@Component({
  selector: 'app-map-zones',
  imports: [],
  template: `
    <div class="grid grid-cols-8 gap-1">
      @for ( zone of zonesList(); track zone.id) {
      <div
        (click)="onSelect(zone)"
        [class.border-8]="selectedZone()?.id === zone.id"
        [class.border-primary]="selectedZone()?.id === zone.id"
        class="cursor-pointer"
      >
        <img [src]="basePath + zone.image" [alt]="zone.name" class="w-full h-auto block" />
      </div>
      }
    </div>

    @if (selectedZone()) {
    <h2 class="mt-4 text-xl">Seleccionada: {{ selectedZone()!.name }}</h2>
    }
  `,
})
export default class MapZones {
  #store = inject(StoreService);

  basePath = '/zones/';

  private _zones = signal<Zone[]>(this.sortedZones());
  zonesList = this._zones.asReadonly();

  #selectedZone = signal<Zone | null>(null);

  selectedZone = computed(() => {
    if (!this.#selectedZone()) return;

    return this.#selectedZone();
  });

  private sortedZones(): Zone[] {
    const letters = ['o', 'p', 'q', 'r'];
    const cols = [14, 15, 16, 17, 18, 19, 20, 21];
    const result: Zone[] = [];
    for (const letter of letters) {
      for (const col of cols) {
        const id = `${letter}${col}`;
        const zone = zones.find((z) => z.id === id);
        if (zone) {
          result.push(zone);
        }
      }
    }
    return result;
  }

  onSelect(zone: Zone) {
    this.#selectedZone.set(zone);
    this.#store.setValueForCurrentStep(this.#selectedZone());
  }
}
