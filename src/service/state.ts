import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STEPS } from '@data/steps';

@Injectable({ providedIn: 'root' })
export class StoreService {
  #router = inject(Router);
  #steps = signal(STEPS);

  steps = this.#steps.asReadonly();

  currentStep = signal<string>(STEPS[0].id);

  constructor() {
    const step = this.#router.url.split('/').pop();
    if (step && (step as string) !== this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  setCurrentStep(stepId: string) {
    this.currentStep.set(stepId);
  }
}
