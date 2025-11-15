import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STATE } from '@data/state';
import { STEP_ID, STEP_STATE, STEPS } from '@data/steps';

@Injectable({ providedIn: 'root' })
export default class StoreService {
  #router = inject(Router);
  #steps = signal(STEPS);

  steps = this.#steps.asReadonly();
  state = signal(STATE);

  currentStep = signal<STEP_ID>(STEPS[0].id);

  currentStateStep = computed(() => STEP_STATE[this.currentStep()]);
  currentLabel = computed(() => this.state()[this.currentStep()].label);
  finishStep = computed(() => !!this.state()[this.currentStep()].value);

  constructor() {
    const step = this.#router.url.split('/').pop();
    if (step && (step as string) !== this.currentStep()) {
      this.currentStep.set(step as STEP_ID);
    }
  }

  setCurrentStep(stepId: STEP_ID) {
    this.currentStep.set(stepId);
  }

  setValueForCurrentStep(value: unknown) {
    this.state.update((currentState) => ({
      ...currentState,
      [this.currentStep()]: { label: currentState[this.currentStep()].label, value },
    }));
  }
}
