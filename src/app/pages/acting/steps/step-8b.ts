import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import ActionsStore from '@service/actions-store';

/** Vuelo de dispersión: elegir el ave (Halcón o Harris). */
@Component({
  selector: 'form-step-eight-b',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      group="flightMethod"
      [items]="birds"
      [selected]="selected()"
      (select)="onSelect($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepEightB {
  #store = inject(ActionsStore);
  birds: ('Halcón' | 'Harris')[] = ['Halcón', 'Harris'];

  selected = computed(() => (this.#store.step8bValue() as string | null) ?? null);

  onSelect(bird: string) {
    this.#store.setFlightBird(bird as 'Halcón' | 'Harris');
  }
}

@Component({
  selector: 'step-eight-b',
  template: `
    <step-page>
      <form-step-eight-b />
    </step-page>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StepPage, FormStepEightB],
})
export default class StepEightB {}
