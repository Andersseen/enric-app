import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import MapZones from '@components/map-zones';
import { Zone } from '@data/zones';
import { IonCard, IonCardContent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'app-prevention-step-zone',
  imports: [IonCard, IonCardContent, MapZones],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-card>
      <ion-card-content>
        <h2 class="text-xl font-bold mb-4">{{ t('common.selectZone') }}</h2>
        <app-map-zones [selected]="selected" (select)="onSelect($event)" />
      </ion-card-content>
    </ion-card>
  `,
})
export default class PreventionStepZoneComponent {
  protected t = injectT(i18n);
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
