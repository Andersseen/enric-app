import { ChangeDetectionStrategy, Component } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import { PreventionStep } from '../base-step';
import PreventionStepPage from '../prevention-step-page';

@Component({
  selector: 'app-flight-step-two',
  imports: [PreventionStepPage, SelectionGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <app-prevention-step-page title="Método">
      <div class="p-4">
        <app-selection-grid
          [items]="options"
          [selected]="store.flightReviewMethod()"
          (select)="onSelect($event)"
          colSize="6"
        />
      </div>
    </app-prevention-step-page>
  `,
})
export default class FlightStepTwo extends PreventionStep {
  options = ['Halcón', 'Harris'];

  onSelect(option: string) {
    this.store.flightReviewMethod.set(option);
    this.next();
  }

  next() {
    this.router.navigate(['home', 'prevention', 'marking-flight', 'step-3']);
  }
}
