import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-seven',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      colSize="12"
      colSizeMd="6"
      [items]="options"
      [selected]="selectedOption()"
      (select)="onSelect($event)"
    />
  `,
})
export class FormStepSeven {
  #store = inject(ActionsStore);
  options = ['No', 'Si'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'step-seven',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <form-step-seven />
    </step-page>
  `,
  imports: [StepPage, FormStepSeven],
})
export default class StepSeven {}
