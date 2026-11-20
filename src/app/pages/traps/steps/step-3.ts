import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { COUNT_OPTIONS } from '@data/count-options';
import SelectionGridComponent from '@components/forms/selection-grid';
import StepPage from '.';
import TrapsStore from '@service/traps-store';

@Component({
  selector: 'traps-form-step-three',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      compact
      colSize="3"
      colSizeMd="2"
      colSizeLg="2"
      [items]="numbers"
      [selected]="selectedNumber()"
      (select)="onSelect($event)"
    />
  `,
})
export class TrapsFormStepThree {
  #store = inject(TrapsStore);
  numbers = COUNT_OPTIONS.filter((n) => n > 0);
  selectedNumber = signal<number | null>(null);

  onSelect(num: number) {
    this.selectedNumber.set(num);
    this.#store.setValueForCurrentStep(this.selectedNumber());
  }
}

@Component({
  selector: 'traps-step-three',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <traps-form-step-three />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepThree],
})
export default class TrapsStepThree {}
