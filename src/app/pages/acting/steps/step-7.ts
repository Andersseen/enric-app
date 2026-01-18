import { Component, inject, signal } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-seven',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      [items]="options"
      [selected]="selectedOption()"
      (select)="onSelect($event)"
    />
  `,
})
export class FormStepSeven {
  #store = inject(ActionsStore);
  options = ['Claxon', 'Sonido', 'Fogueo', 'Laser', 'Vuelo dispersión halcón'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'step-seven',
  template: `
    <step-page>
      <form-step-seven />
    </step-page>
  `,
  imports: [StepPage, FormStepSeven],
})
export default class StepSeven {}
