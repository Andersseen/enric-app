import { Component, ChangeDetectionStrategy, EventEmitter, Output, signal } from '@angular/core';

import { Zone, zones } from '@data/zones';

@Component({
  selector: 'app-grid-zonas',

  template: `
    <div class="grid grid-cols-8 gap-2">
      @for ( zone of zonesList(); track zone.id) {
      <div
        (click)="onSelect(zone)"
        [class.border-4]="selectedId() === zone.id"
        [class.border-indigo-500]="selectedId() === zone.id"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridZonasComponent {
  @Output() zoneSelect = new EventEmitter<Zone>();

  basePath = '/zones/';

  private _zones = signal<Zone[]>(this.sortedZones());
  zonesList = this._zones.asReadonly();

  private _selectedId = signal<string | null>(null);
  selectedId = this._selectedId.asReadonly();

  private _selectedZone = signal<Zone | null>(null);
  selectedZone = this._selectedZone.asReadonly();

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

  onSelect(zone: Zone): void {
    this._selectedId.set(zone.id);
    this._selectedZone.set(zone);
    this.zoneSelect.emit(zone);
  }
}
