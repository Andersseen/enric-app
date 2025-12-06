import { Component, signal, input, output } from '@angular/core';
import { Zone, zones } from '@data/zones';

@Component({
  selector: 'app-map-zones',
  imports: [],
  template: `
    <div class="grid grid-cols-8 gap-1">
      @for ( zone of zonesList(); track zone.id) {
      <div
        (click)="onSelect(zone)"
        [class.border-4]="selected()?.id === zone.id"
        [class.border-primary]="selected()?.id === zone.id"
        class="cursor-pointer"
      >
        <img [src]="basePath + zone.image" [alt]="zone.name" class="w-full h-auto block" />
      </div>
      }
    </div>

    @if (selected()) {
    <h2 class="mt-4 text-xl">Seleccionada: {{ selected()!.name }}</h2>
    }
  `,
})
export default class MapZones {
  selected = input<Zone | null>(null);
  select = output<Zone>();

  #zones = signal<Zone[]>(this.sortedZones());

  basePath = '/zones/';

  zonesList = this.#zones.asReadonly();

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
    this.select.emit(zone);
  }
}
