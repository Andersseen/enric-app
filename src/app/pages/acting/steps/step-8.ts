import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-eight',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      [items]="options"
      [selected]="selectedOption()"
      (select)="onSelect($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepEight {
  #store = inject(ActionsStore);
  options = ['Claxon', 'Sonido', 'Pirotecnia', 'Láser', 'Vuelo dispersión halcón'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'step-eight',
  template: `
    <step-page>
      <form-step-eight />
    </step-page>
  `,
  imports: [StepPage, FormStepEight],
})
export default class StepEight {}
