import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-five',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      group="actionType"
      colSize="6"
      colSizeMd="4"
      [items]="options"
      [selected]="selectedOption()"
      (select)="onSelect($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepFive {
  #store = inject(ActionsStore);
  options = ['Dispersión', 'Observación', 'Revisión', 'Retirar', 'FOD Fauna', 'Otras'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'step-five',
  template: `
    <step-page>
      <form-step-five />
    </step-page>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StepPage, FormStepFive],
})
export default class StepFive {}
