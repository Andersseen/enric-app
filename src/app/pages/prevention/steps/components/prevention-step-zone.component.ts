import { Component, EventEmitter, Input, Output } from '@angular/core';
import MapZones from '@components/map-zones';
import { Zone } from '@data/zones';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-prevention-step-zone',
  imports: [IonCard, IonCardContent, MapZones],
  template: `
    <ion-card>
      <ion-card-content>
        <h2 class="text-xl font-bold mb-4">Seleccionar Zona</h2>
        <app-map-zones [selected]="selected" (select)="onSelect($event)" />
      </ion-card-content>
    </ion-card>
  `,
})
export default class PreventionStepZoneComponent {
  @Input() selected: Zone | null = null;
  @Input() showNextButton: boolean = true;
  @Output() select = new EventEmitter<Zone>();
  @Output() next = new EventEmitter<void>();

  constructor() {
    addIcons({ arrowForwardOutline });
  }

  onSelect(zone: Zone) {
    this.select.emit(zone);
  }
}
