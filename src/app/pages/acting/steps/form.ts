import { Component } from '@angular/core';
import Form from '@components/form';
import StepPage from './';

@Component({
  selector: 'app-form-step',
  template: `
    <step-page>
      <app-form />
    </step-page>
  `,
  imports: [Form, StepPage],
})
export default class FormStep {}
