import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PreventionStep } from '../base-step';
import PreventionStepZoneComponent from '../components/prevention-step-zone.component';
import PreventionStepPage from '../prevention-step-page';
import { Zone } from '@data/zones';

@Component({
  selector: 'app-flight-step-one',
  imports: [PreventionStepZoneComponent, PreventionStepPage],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <app-prevention-step-page
      title="Vuelo de Marcaje - Zona"
      [showNext]="true"
      [canGoNext]="!!store.flightReviewZone()"
      (nextClicked)="next()"
    >
      <app-prevention-step-zone
        [selected]="store.flightReviewZone()"
        (select)="onSelect($event)"
      />
    </app-prevention-step-page>
  `,
})
export default class FlightStepOne extends PreventionStep {
  onSelect(zone: Zone) {
    this.store.flightReviewZone.set(zone);
  }

  next() {
    this.router.navigate(['home', 'prevention', 'marking-flight', 'step-2']);
  }
}
