import { Component } from '@angular/core';
import StepPanel from '@components/step-panel';
import FilterBirds from '@components/filter-birds';
import SessionHeaderComponent from '@components/session-header';

@Component({
  selector: 'app-list-step',
  template: `
    <app-step-panel title="Lista">
      <app-session-header />
      <app-filter-birds />
    </app-step-panel>
  `,
  imports: [StepPanel, FilterBirds, SessionHeaderComponent],
})
export default class ListStep {}
