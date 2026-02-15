import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import TrapsActionsStore from '@service/traps-store';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-six',
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
export class TrapsFormStepSix {
  #store = inject(TrapsActionsStore);
  options = ['No', 'Si'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-six',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <traps-form-step-six />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepSix],
})
export default class TrapsStepSix {}
