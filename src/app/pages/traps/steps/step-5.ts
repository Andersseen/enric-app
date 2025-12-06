import { Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import StepPage from '.';
import TrapsStoreService from '@service/traps-store.service';

@Component({
  selector: 'traps-form-step-five',
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
export class TrapsFormStepFive {
  #store = inject(TrapsStoreService);
  options = ['Captura'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-five',
  template: `
    <step-page>
      <traps-form-step-five />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepFive],
})
export default class TrapsStepFive {}
