import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import StepPage from '.';
import TrapsActionsStore from '@service/traps-store';

@Component({
  selector: 'traps-form-step-five',
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
export class TrapsFormStepFive {
  #store = inject(TrapsActionsStore);
  options = ['Captura'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-five',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <traps-form-step-five />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepFive],
})
export default class TrapsStepFive {}
