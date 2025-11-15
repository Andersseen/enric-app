import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Step, STEP_ID, STEP_STASTE, STEPS } from '@data/steps';

@Injectable({ providedIn: 'root' })
export class StoreService {
  #router = inject(Router);
  #steps = signal(STEPS);

  steps = this.#steps.asReadonly();

  currentStep = signal<STEP_ID>(STEPS[0].id);
  currentStepState = computed(() => STEP_STASTE[this.currentStep()]);

  constructor() {
    const step = this.#router.url.split('/').pop();
    if (step && (step as string) !== this.currentStep()) {
      this.currentStep.set(step as STEP_ID);
    }
  }

  setCurrentStep(stepId: STEP_ID) {
    this.currentStep.set(stepId);
  }
}
