import { Component } from '@angular/core';
import StepPage from '.';
import FilterBirds from '@components/filter-birds';

@Component({
  selector: 'app-traps-step-two',
  template: `
    <step-page>
      <app-filter-birds />
    </step-page>
  `,
  imports: [FilterBirds, StepPage],
})
export default class TrapsStepTwo {}
