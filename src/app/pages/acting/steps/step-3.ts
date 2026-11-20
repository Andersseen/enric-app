import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { COUNT_OPTIONS } from '@data/count-options';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-three',
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
export class FormStepThree {
  #store = inject(ActionsStore);
  numbers = COUNT_OPTIONS;
  selectedNumber = signal<number | null>(null);

  onSelect(num: number) {
    this.selectedNumber.set(num);
    this.#store.setValueForCurrentStep(this.selectedNumber());
  }
}

@Component({
  selector: 'step-three',
  template: `
    <step-page>
      <form-step-three />
    </step-page>
  `,
  imports: [StepPage, FormStepThree],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StepThree {}
