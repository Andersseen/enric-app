import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { COUNT_OPTIONS } from '@data/count-options';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-eleven',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepEleven {
  #store = inject(ActionsStore);
  numbers = COUNT_OPTIONS;
  selectedNumber = signal<number | null>(null);

  onSelect(num: number) {
    this.selectedNumber.set(num);
    this.#store.setValueForCurrentStep(this.selectedNumber());
  }
}

@Component({
  selector: 'step-eleven',
  template: `
    <step-page>
      <form-step-eleven />
    </step-page>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StepPage, FormStepEleven],
})
export default class StepEleven {}
