import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { COUNT_OPTIONS } from '@data/count-options';
import SelectionGridComponent from '@components/forms/selection-grid';
import TrapsActionsStore from '@service/traps-store';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-ten',
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
export class TrapsFormStepTen {
  #store = inject(TrapsActionsStore);
  numbers = COUNT_OPTIONS;
  selectedNumber = signal<number | null>(null);

  onSelect(num: number) {
    this.selectedNumber.set(num);
    this.#store.setValueForCurrentStep(this.selectedNumber());
  }
}

@Component({
  selector: 'traps-step-ten',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <traps-form-step-ten />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepTen],
})
export default class TrapsStepTen {}
