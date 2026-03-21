import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PreventionStep } from '../base-step';
import PreventionStepZoneComponent from '../components/prevention-step-zone.component';
import PreventionStepPage from '../prevention-step-page';
import { Zone } from '@data/zones';

@Component({
  selector: 'app-dog-review-step-one',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PreventionStepZoneComponent, PreventionStepPage],
  template: `
    <app-prevention-step-page title="Revisión perro - Zona">
      <app-prevention-step-zone
        [selected]="store.dogReviewZone()"
        (select)="onSelect($event)"
        (next)="next()"
      />
    </app-prevention-step-page>
  `,
})
export default class DogReviewStepOne extends PreventionStep {
  onSelect(zone: Zone) {
    this.store.dogReviewZone.set(zone);
  }

  next() {
    this.router.navigate(['home', 'prevention', 'dog-review', 'step-2']);
  }
}
