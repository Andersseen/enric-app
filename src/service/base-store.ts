import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STATE } from '@data/state';
import { BASE_STEPS, StepId } from '@data/steps';

@Injectable({ providedIn: 'root' })
export default class BaseStore {
  #steps = signal(BASE_STEPS);

  steps = this.#steps.asReadonly();
  protected router = inject(Router);

  state = signal(JSON.parse(JSON.stringify(STATE)));

  currentStep = signal<StepId>(this.steps()[0].id);

  acceptEmptyStep(stepId: StepId[]): boolean {
    if (stepId.includes(this.currentStep())) {
      return true;
    }
    return false;
  }

  reset() {
    this.state.set(JSON.parse(JSON.stringify(STATE)));
    this.currentStep.set(this.steps()[0].id);
    this.router.navigate(['/']);
  }
}
