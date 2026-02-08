import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import MapZones from '@components/map-zones';
import { Zone } from '@data/zones';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-prevention-step-zone',
  imports: [IonCard, IonCardContent, MapZones, IonButton, IonIcon],
  template: `
    <ion-card>
      <ion-card-content>
        <h2 class="text-xl font-bold mb-4">Seleccionar Zona</h2>
        <app-map-zones [selected]="selected" (select)="onSelect($event)" />

        <div class="mt-6">
          <ion-button expand="block" (click)="next.emit()" [disabled]="!selected">
            Siguiente
            <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
})
export default class PreventionStepZoneComponent {
  @Input() selected: Zone | null = null;
  @Output() select = new EventEmitter<Zone>();
  @Output() next = new EventEmitter<void>();

  constructor() {
    addIcons({ arrowForwardOutline });
  }

  onSelect(zone: Zone) {
    this.select.emit(zone);
  }
}
